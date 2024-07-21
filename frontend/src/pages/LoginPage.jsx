import { useState } from "react";
import { FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const loginUser = async (userData) => {
    try {
      const response = await axios.post(
        // `${process.env.REACT_APP_API}/user/login/`,
        "http://192.168.155.213:8000/user/login/",
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.access);
        toast.success("Login Successful...");
        return data;
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response && error.response.status === 400) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Failed to login. Please try again");
      }
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    // if (formData.password.length < 6) {
    //   setError("Password must be at least 6 characters long");
    //   return;
    // }

    try {
      const data = await loginUser(formData);
      if (data) {
        window.location.href = "/events";
      }
    } catch (error) {
      toast.error("Login Error");
    }
  };

  return (
    <>
      <video src="../../public/bg.mp4" autoPlay loop muted playsInline></video>
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 hover:bg-gray-600/10 border border-gray-800 text-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4">Login Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="RXXXXXX"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
            >
              Login
            </button>
          </form>

          <p className="text-black-700 mt-4">
            By Logging in, you will unlock all the features of the app.{" "}
            <FaUnlockAlt className="inline" />
          </p>

          <p className="text-black-700 mt-2">
            Don't have an account? Create here{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
