import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../assets/API/API_URL";
import LoadingScreen from "../components/LoadingScreen";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: Please log in");
          return;
        }
        const response = await axios.get(`${baseURL}/auth/profile`, {
          "Content-Type": "application/json",
          headers: { Authorization: token },
        });
        setUser(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseURL}/auth/profile`, formData, {
        "Content-Type": "application/json",
        headers: { Authorization: token },
      });
      setUser(formData);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
     <LoadingScreen/>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const handle =()=>{
    navigate("/home");
  }

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <button className=" absolute left-[480px] top-[110px] flex gap-3 justify-end py-3 pr-2.5 text-2xl font-semibold leading-5 text-blue-600 whitespace-nowrap rounded-lg border border-blue-600 border-solid w-[45px]" onClick={handle}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d74983c39c46366e6436cd5074d5b98860f61ea77dce3c5f5725985468ffce69?apiKey=8d6992485656477797592f8415f51272&"
            className="shrink-0 w-6 aspect-square"
          />
          </button>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-theme-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase mx-auto">
            {user.name[0]}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            {editMode ? "Edit Profile" : "Your Profile"}
          </h2>
          <p className="text-gray-600 mb-4">Manage your personal information</p>
          
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm mt-3"
                placeholder="Your Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm mt-3"
                placeholder="Your Email"
              />
            </>
          ) : (
            <>
              <h3 className="text-xl font-table-body-heading text-gray-700 mt-3 text-3xl font-bold text-gray-800 mt-4">
               Name:  {user.name}
              </h3>
              <p className="text-gray-500">{user.email}</p>
            </>
          )}

          <div className="mt-6">
            {editMode ? (
              <button
                onClick={handleSave}
                className="w-full bg-theme-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-theme-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
          <button
            className="mt-6  bg-theme-white-default text-theme-primary-dark border border-theme-primary-dark px-6 py-3 rounded hover:bg-theme-primary-default hover:text-theme-white-default justify-center items-center"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
