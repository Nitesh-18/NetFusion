import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const AuthPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isLogin && !formData.name) newErrors.name = "Name is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data before sending request
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Determine the endpoint for login or registration
      const endpoint = isLogin
        ? "http://localhost:8080/api/auth/login" // Login endpoint
        : "http://localhost:8080/api/auth/register"; // Register endpoint

      // Send formData to login or register the user
      const response = await axios.post(endpoint, formData);

      // Extract token and redirect URL from the response
      const { token, redirectUrl } = response.data;

      // Store the token in localStorage for authentication
      localStorage.setItem("authToken", token);

      // Redirect based on login or registration flow
      if (isLogin) {
        navigate("/home"); // Redirect to home after login
      } else {
        navigate(redirectUrl); // Redirect to setup-profile after registration
      }
    } catch (error) {
      // Show error message if any issues during login/registration
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      // Stop the loading state
      setLoading(false);
    }
  };

  // Temporarily handle Google Login/Register
  const handleGoogleLogin = () => {
    // Show under development message
    toast.info("Under Development");

    // Commented out Google Auth logic
    // window.location.href = "http://localhost:8080/api/auth/google";
  };

  const handleGoogleAuth = async () => {
    try {
      const parsed = queryString.parse(window.location.search);
      const { token, redirectUrl } = parsed;

      if (token) {
        localStorage.setItem("authToken", token);
        navigate(redirectUrl || "/home");
      }
    } catch (error) {
      // Handle any errors that might occur during Google Auth
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    handleGoogleAuth();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 text-white relative overflow-hidden"
    >
      {/* Background Gradient Movement */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%"],
          backgroundSize: "200%",
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
  
      {/* Moving Objects (Circles or Blobs) */}
      <motion.div
        className="absolute w-64 h-64 bg-blue-500 rounded-full opacity-20"
        animate={{ x: ["-100%", "100%"], y: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ top: "10%", left: "-10%" }}
      />
      <motion.div
        className="absolute w-48 h-48 bg-purple-500 rounded-full opacity-20"
        animate={{ x: ["100%", "-100%"], y: ["100%", "0%"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ bottom: "20%", right: "-10%" }}
      />
      <motion.div
        className="absolute w-56 h-56 bg-indigo-500 rounded-full opacity-20"
        animate={{ x: ["-100%", "100%"], y: ["100%", "0%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ bottom: "10%", left: "-10%" }}
      />
  
      {/* Auth Form Section */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        <Tabs.Root
          defaultValue="login"
          className="flex flex-col items-center"
          onValueChange={(value) => {
            setIsLogin(value === "login");
            setErrors({});
          }}
        >
          <Tabs.List className="flex justify-around w-full mb-6">
            <Tabs.Trigger
              value="login"
              className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-500 ease-in-out ${
                isLogin ? "bg-indigo-700 text-white" : "text-gray-400"
              }`}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="register"
              className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-500 ease-in-out ${
                !isLogin ? "bg-indigo-700 text-white" : "text-gray-400"
              }`}
            >
              Register
            </Tabs.Trigger>
          </Tabs.List>
  
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Tabs.Content value="login" className="w-full">
              <h2 className="text-3xl font-bold text-center mb-6">
                Welcome Back!
              </h2>
              <p className="text-center mb-6">Login to your account</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 mt-1 bg-gray-700 border ${
                      errors.email ? "border-red-500" : "border-gray-600"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 mt-1 bg-gray-700 border ${
                      errors.password ? "border-red-500" : "border-gray-600"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md transition-all duration-500 hover:bg-indigo-700 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? <span className="loader"></span> : "Login"}
                </button>
              </form>
              <button
                onClick={() => {
                  handleGoogleLogin();
                }}
                className="w-full mt-4 py-3 bg-red-600 text-white font-bold rounded-md transition-all duration-500 hover:bg-red-700 transform hover:scale-105"
              >
                Login with Google
              </button>
            </Tabs.Content>
  
            <Tabs.Content value="register" className="w-full">
              <h2 className="text-3xl font-bold text-center mb-6">
                Create an Account
              </h2>
              <p className="text-center mb-6">Register a new account</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 mt-1 bg-gray-700 border ${
                        errors.name ? "border-red-500" : "border-gray-600"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 mt-1 bg-gray-700 border ${
                      errors.email ? "border-red-500" : "border-gray-600"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 mt-1 bg-gray-700 border ${
                      errors.password ? "border-red-500" : "border-gray-600"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md transition-all duration-500 hover:bg-indigo-700 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? <span className="loader"></span> : "Register"}
                </button>
              </form>
              <button
                onClick={() => {
                  handleGoogleLogin();
                }}
                className="w-full mt-4 py-3 bg-red-600 text-white font-bold rounded-md transition-all duration-500 hover:bg-red-700 transform hover:scale-105"
              >
                Register with Google
              </button>
            </Tabs.Content>
          </motion.div>
        </Tabs.Root>
      </motion.div>
    </motion.div>
  );
  
  
};

export default AuthPage;
