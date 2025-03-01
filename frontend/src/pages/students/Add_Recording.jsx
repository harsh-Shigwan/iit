import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../../assets/API_URL";
import Header from "../../components/Header";
import { BounceLoader } from "react-spinners";
const Add_Recordings = () => {
  const [formData, setFormData] = useState({ audioFile: "", studentId: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentInput, setStudentInput] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })
  
  const { data: myData = [], isLoading, isError } = useQuery({
    queryKey: ["students"], // Unique key for caching
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/api/students/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.students || []; // Return the students array
    },
    staleTime: 60000, // Cache data for 1 minute
    onError: (error) => {
      console.error("API Error:", error);
    },
  });

  // Handle student input change
  const handleStudentChange = (event) => {
    setStudentInput(event.target.value);
    setShowStudentDropdown(true);
  };

  // Handle student selection from dropdown
  const handleStudentSelect = (student) => {
    setStudentInput(student.name);
    setSelectedStudent(student.studentId);
    setShowStudentDropdown(false);
  };

  // Handle form input change
  const handleChange = (event) => {
    if (event.target.name === "audioFile") {
      setFormData({ ...formData, audioFile: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      await axios.post(
        `${baseURL}/api/upload`,
        {
          studentId: selectedStudent,
          audioFile: formData.audioFile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAlert({ show: true, message: "Recording uploaded successfully!", type: "success" });
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("API Error:", error);
      setAlert({ show: true, message: "Error uploading recording. Please try again.", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 2000);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Loading state for students
  if (isLoading) {
    return <div>Loading students...</div>;
  }

  // Error state for students
  if (isError) {
    return <div>Error fetching students. Please try again later.</div>;
  }

  return (
    <div className="bg-whitesmoke h-screen">
      <Header />
      <fieldset className="mt-20">
        <form
          onSubmit={handleSubmit}
          className="m-0 w-[1110px] shadow-lg bg-theme-white-default flex flex-col py-6 pr-[22px] gap-[30px] mt-5 mx-auto"
        >
          <div className="flex flex-col px-7 mt-6 max-md:px-5">
            <div className="flex gap-5 justify-between max-md:flex-wrap">
              <div className="flex flex-col flex-1">
                <label className="text-sm text-slate-600 font-medium">
                  Student Roll Number
                </label>
                <input
                  className="p-4 mt-3 text-base text-gray-500 rounded-md bg-slate-100"
                  type="text"
                  placeholder="Enter Student ID"
                  value={studentInput}
                  onChange={handleStudentChange}
                  onFocus={() => setShowStudentDropdown(true)}
                  onBlur={() => setTimeout(() => setShowStudentDropdown(false), 200)}
                  name="name"
                />
                {showStudentDropdown && (
                  <div className="flex flex-col max-h-64 overflow-y-auto bg-white border border-gray-300 w-[513px] absolute text-slate-600 font-medium mt-[100px] rounded-md">
                    {myData
                      .filter(
                        (student) =>
                          student.name.toLowerCase().includes(studentInput.toLowerCase()) ||
                          student.studentId.toString().includes(studentInput.toLowerCase())
                      )
                      .map((student) => (
                        <div
                          key={student.studentId}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onMouseDown={() => handleStudentSelect(student)}
                        >
                          {student.studentId} : {student.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm text-slate-600 font-medium">
                  Audio File
                </label>
                <input
                  className="py-4 pr-16 pl-4 mt-3 text-base text-gray-500 rounded-md bg-slate-100 max-md:pr-5"
                  accept="audio/*"
                  onChange={handleChange}
                  type="file"
                  name="audioFile"
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
              disabled={isSubmitting} 
            >
              {isSubmitting ? "Submitting..." : "Submit"} 
            </button>
          </div>
          {isSubmitting && (
            <div className="flex justify-center items-center mt-4  ">
            <BounceLoader color="#3754db" size={80} />
            </div>
          )}
        </form>
      </fieldset>

      {alert.show && (
        <div className={`fixed top-20 right-5 p-4 rounded-md text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default Add_Recordings;