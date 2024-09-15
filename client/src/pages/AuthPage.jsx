import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // To handle navigation
import axios from "axios";
import queryString from "query-string"; // To parse Google Auth redirect URL

const AuthPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirection

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation logic
  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isLogin && !formData.name) newErrors.name = "Name is required";
    return newErrors;
  };

  // Handle form submission for login/register
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/register";
      const response = await axios.post(endpoint, formData);

      const { redirectUrl, token } = response.data; // Extract redirectUrl and token

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Redirect based on the server-sent URL
      window.location.href = `http://localhost:5173${redirectUrl}`;
    } catch (error) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Auth login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/google";
  };

  // Handle Google Auth redirect after successful authentication
  useEffect(() => {
    const parsed = queryString.parse(window.location.search); // Parse the query string
    const { token, redirectUrl } = parsed;

    if (token) {
      // Store the token received from the URL
      localStorage.setItem("authToken", token);

      // Redirect the user based on redirectUrl or default to home
      navigate(redirectUrl || "/home");
    }
  }, [navigate]);

  // Handle Tab switching between login and register
  const handleTabChange = (tab) => {
    setIsLogin(tab === "login");
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }} // Slower transition on page load
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 text-white"
    >
      {/* Subtle moving gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        style={{ backgroundSize: "200%" }}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }} // Adding bounce effect
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
            transition={{ duration: 0.6, ease: "easeInOut" }} // Slower, smoother transitions
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
                  {loading ? <span className="loader"></span> : "Login"}
                </button>
              </form>
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 py-3 bg-red-600 text-white font-bold rounded-md transition-all duration-500 hover:bg-red-700 transform hover:scale-105"
              >
                Login with Google
              </button>
            </Tabs.Content>

            <Tabs.Content value="register" className="w-full">
              <h2 className="text-3xl font-bold text-center mb-6">
                Create Your Account
              </h2>
              <p className="text-center mb-6">Sign up to get started</p>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={handleGoogleLogin}
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
