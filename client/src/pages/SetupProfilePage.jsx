import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Progress Bar Component
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

const SetupProfilePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    avatar: null,
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(formData.avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [formData.avatar]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("avatar", formData.avatar);
      formDataToSend.append("bio", formData.bio);

      await axios.post(
        "http://localhost:8080/api/auth/setup-profile",
        formDataToSend
      );
      navigate("/home");
    } catch (error) {
      console.error("Error submitting profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username}</p>
            )}
            <button
              onClick={handleNextStep}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
              <button
                onClick={handleNextStep}
                className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Continue with Default Avatar
              </button>
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us something about yourself"
            />
            {errors.bio && <p className="text-red-500">{errors.bio}</p>}
            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Finish and Go to Home"}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SetupProfilePage;
