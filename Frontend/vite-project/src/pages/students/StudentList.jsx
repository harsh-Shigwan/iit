import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../assets/API_URL";

const StudentList = () => {
  const StudentAPI = `${baseURL}/api/assessments/all`;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(StudentAPI);
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Audio List</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Student Name</th>
            <th className="border border-gray-300 px-4 py-2">Student ID</th>
            <th className="border border-gray-300 px-4 py-2">Audio</th>
          </tr>
        </thead>
        <tbody>
          {students.map((record, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{record.studentId.name}</td>
              <td className="border border-gray-300 px-4 py-2">{record.studentId.studentId}</td>
              <td className="border border-gray-300 px-4 py-2">
                <audio key={record.s3Url} controls>
                  <source src={record.s3Url} type="audio/mp4" />
                  <source src={record.s3Url.replace(".m4a", ".mp3")} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
