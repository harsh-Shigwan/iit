import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../assets/API_URL';
const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    
    // Name validation (only letters and spaces, min 3 chars)
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (!/^[A-Za-z ]{3,}$/.test(formData.name)) {
      tempErrors.name = 'Name must be at least 3 characters long and contain only letters and spaces';
    }

    // Email/Phone validation
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email) && !/^\d{10}$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email or 10-digit phone number';
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await axios.post(`${baseURL}/auth/signup`, formData);
      alert('Registration Successful! Please Sign In.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Error registering.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Your Account</h2>
        <p className="text-gray-600 text-center mb-8">It’s free and easy</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-700 font-semibold block mb-2">Your Name</label>
            <input type="text" name="name" placeholder="Enter your name" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-2">E-mail </label>
            <input type="text" name="email" placeholder="Type your e-mail or phone number" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-2">Password</label>
            <input type="password" name="password" placeholder="Type your password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long, with one uppercase letter, one number, and one special character</p>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">Register</button>
        </form>
        <p className="text-center mt-6 text-gray-600">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Sign In</span></p>
      </div>
    </div>
  );
};

export default SignUp;
