import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_AVATAR_URL =
  "https://firebasestorage.googleapis.com/v0/b/netfusion-7c638.appspot.com/o/Avatar%2FDefault-Avatar.png?alt=media&token=6e3ff85e-ea26-4bf6-b846-0651529dc607";

const ProgressBar = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mb-6">
      <div
        className="bg-blue-500 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const fetchUsernameSuggestions = async (username) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/auth/username-suggestions?username=${username}`
    );
    return response.data.suggestions;
  } catch (error) {
    console.error("Error fetching username suggestions:", error);
    return [];
  }
};

const SetupProfilePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    avatar: DEFAULT_AVATAR_URL,
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.avatar && typeof formData.avatar !== "string") {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(formData.avatar);
    } else {
      setAvatarPreview(null);
    }

    if (step === 1 && formData.username) {
      fetchUsernameSuggestions(formData.username).then((suggestions) =>
        setUsernameSuggestions(suggestions)
      );
    }
  }, [formData.avatar, formData.username, step]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const validateStep = () => {
    let newErrors = {};
    if (step === 1 && !formData.username) {
      newErrors.username = "Username is required";
    } else if (step === 3 && formData.bio.length < 5) {
      newErrors.bio = "Bio must be at least 5 characters long";
    }
    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      } else {
        // Append the default avatar URL as a fallback
        formDataToSend.append("avatar", DEFAULT_AVATAR_URL);
      }
      formDataToSend.append("bio", formData.bio);

      const response = await axios.post(
        "http://localhost:8080/api/auth/setup-profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-700">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">
          {step === 1 && "Choose a Username"}
          {step === 2 && "Upload an Avatar"}
          {step === 3 && "Write a Bio"}
        </h2>
        <ProgressBar step={step} totalSteps={3} />
        {step === 1 && (
          <motion.div
            key="username-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 mt-2">{errors.username}</p>
            )}
            <ul className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              {usernameSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
            <button
              onClick={handleNextStep}
              className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="avatar-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <input
                type="file"
                name="avatar"
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="mt-4 w-24 h-24 rounded-full object-cover"
                />
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You can choose to upload or use a default avatar.
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => {
                    setFormData({ ...formData, avatar: DEFAULT_AVATAR_URL });
                    handleNextStep(); // Move to the next step
                  }}
                  className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400"
                >
                  Continue with Default Avatar
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                >
                  Continue with Uploaded Avatar
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="bio-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Write a short bio..."
            ></textarea>
            {errors.bio && <p className="text-red-500 mt-2">{errors.bio}</p>}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default SetupProfilePage;
