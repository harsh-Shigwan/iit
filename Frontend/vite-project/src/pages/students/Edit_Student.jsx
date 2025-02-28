import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import baseURL from "../../assets/API_URL";

const Edit_Student = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const edit_studentsAPI = `${baseURL}/api/students/${studentId}`;

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
  });

  // Fetch existing student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(edit_studentsAPI, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response edit:", response.data);

        // Ensure API returns correct structure
        if (response.data.student) {
          setFormData({
            name: response.data.student.name || "",
            studentId: response.data.student.studentId || "",
          });
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        console.log("Error response data:", error.response?.data);
      }
    };

    if (token) fetchStudentData();
  }, [studentId, token]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("Submitting form data:", formData);
      const response = await axios.put(edit_studentsAPI, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data);
      alert("Student details updated successfully!");
      navigate("/add_students");
    } catch (error) {
      console.error("API Error:", error);
      console.log("Error response data:", error.response?.data);
    }
  };

  return (
    <div className="bg-whitesmoke">
      <Header />
      <fieldset className="mt-12">
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
    </div>
  );
};

export default Edit_Student;
