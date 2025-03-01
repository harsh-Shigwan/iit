import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../assets/API_URL";
const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(`${baseURL}/auth/signin`, formData);
      console.log("Token:", res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Invalid credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">👋</h1>
        </div>

        <div className="mt-3">
          <h2 className="text-3xl font-semibold">Welcome back!</h2>
          <p className="text-gray-600 mt-1">Let's build something great..</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="text-sm font-semibold text-gray-600">E-mail</div>
          <input
            type="email"
            name="email"
            placeholder="Type your e-mail"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="text-sm font-semibold text-gray-600 mt-12">Password</div>
          <input
            type="password"
            name="password"
            placeholder="********"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            Sign in
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-sm font-semibold text-gray-600">
          Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;