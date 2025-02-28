import React from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../assets/profile.svg";

const Header = () => {
  const navigate = useNavigate();

  const handle = () => {
    navigate("/profile");
  };

  return (
    <div className="relative bg-theme-white-default px-10 h-12 mt-4 flex items-center justify-between shadow-md">
      <Link to={'/home'} className="text-2xl text-slate-700 font-medium mb-4" >
        Amazon School of Languages
      </Link>

      <img
        src={profile}
        alt="Profile"
        onClick={handle}
        className="w-10 h-10  mb-2 cursor-pointer" 
      />
    </div>
  );
};

export default Header;
