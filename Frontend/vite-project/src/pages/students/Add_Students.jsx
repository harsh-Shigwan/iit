import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import baseURL
 from "../../assets/API_URL";
import Header from "../../components/Header";
import All_Students from "./All_Students";
import { useNavigate } from "react-router-dom";

const Add_Students = () => {
    const add_studentsAPI  = `${baseURL}/api/students/register/`
  const [formData, setFormData] = useState({ name: "", studentId: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(add_studentsAPI, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);
      queryClient.invalidateQueries(["students"]); 
      navigate("/home");
    } catch (error) {
      console.error("API Error:", error);
      console.log("Error response data:", error.response?.data);
    }
  };
  return (
    <div  className=" bg-whitesmoke  h-full">
     <Header></Header>
    
   
        <fieldset className=" mt-12">
        <form
        onSubmit={handleSubmit}
        className="m-0 w-[1110px] bg-theme-white-default flex flex-col py-6 pr-[22px] gap-[30px] mt-5 mx-auto"
      >
        <div className="flex flex-col px-7 mt-6 max-md:px-5">
          <div className="flex gap-5 justify-between max-md:flex-wrap">
            <div className="flex flex-col flex-1">
              <label className="text-sm text-slate-600 font-medium">
                Student Roll Number
              </label>
              <input
                className="p-4 mt-2 text-base text-gray-500 rounded-md bg-slate-100"
                type="text"
                placeholder="Enter Roll Number"
                value={formData.studentId}
                onChange={handleChange}
                name="studentId"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm text-slate-600 font-medium">
                Student Name
              </label>
              <input
                className="py-4 pr-16 pl-4 mt-3 text-base text-gray-500 rounded-md bg-slate-100 max-md:pr-5"
                type="text"
                placeholder="Enter Student Name"
                value={formData.name}
                onChange={handleChange}
                name="name"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-5 mt-8 self-end">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-700 text-base font-semibold border border-blue-700 px-8 py-4 rounded-lg max-md:px-5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white text-base font-semibold bg-blue-700 border border-blue-700 px-7 py-4 rounded-lg max-md:px-5"
          >
            Submit
          </button>
        </div>
      </form>
      
        </fieldset>
  
     <All_Students/>
    </div>
  );
};


  

export default Add_Students;