import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Plus from "../../assets/Plus.svg";
import show from "../../assets/carbon_search.svg";
import baseURL from "../../assets/API/API_URL";
import arrow_down from "../../assets/down-arrow.svg";
import arrow_up from "../../assets/up-arrow.svg";
import calendar from "../../assets/calendar.svg";
import add_user from "../../assets/user.svg";

const Assessment = () => {
  const navigate = useNavigate();
  const targetRef = useRef();
  const datePickerRef = useRef();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseTime, setResponseTime] = useState(null);
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState({
    show: false,
    message: "",
    id: null,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortedData = [...students].sort((a, b) => {
    const aValue =
      sortColumn === "name" ? a.studentId?.name : a.studentId?.studentId;
    const bValue =
      sortColumn === "name" ? b.studentId?.name : b.studentId?.studentId;

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  const handleDateRangeChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleShowAllDates = () => {
    setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
  };

  const filteredData = sortedData.filter((item) => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) return true;
    const itemDate = new Date(item.createdAt);
    const startDate = new Date(dateRange[0].startDate);
    const endDate = new Date(dateRange[0].endDate);
    return itemDate >= startDate && itemDate <= endDate;
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const startTime = performance.now();
      try {
        const response = await axios.get(`${baseURL}/api/assessments/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const validStudents = response.data.filter(
          (student) => student.studentId != null
        );
        setStudents(validStudents);
        setResponseTime((performance.now() - startTime).toFixed(2));
      } catch (err) {
        setError("Failed to fetch students");
        console.error("Error fetching students:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const deleteData = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/assessments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(students.filter((student) => student._id !== id));
      setDeleteAlert({ show: false, message: "", id: null });
    } catch (error) {
      console.error("Error deleting data:", error);
      setDeleteAlert({
        show: true,
        message: "Error deleting record. Please try again.",
        id: null,
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteAlert({
      show: true,
      message: "Are you sure you want to delete this record?",
      id,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteAlert.id) {
      deleteData(deleteAlert.id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteAlert({ show: false, message: "", id: null });
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ml-[40px] mt-0 bg-whitesmoke h-[700px] flex flex-col items-center justify-start px-[30px] pb-[30px] pt-10">
      <div className="w-[1250px] bg-theme-white-default">
        <div className="h-[60px] bg-theme-white-default relative flex items-center px-4">
          <div className="text-slate-600 font-inter font-medium text-2xl leading-6 tracking-normal">
            SAP API
          </div>
          <div className="relative">
            <input
              className="rounded-[30px] ml-16 bg-gray-50 w-[301px] h-[38px] border border-black pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search...."
            />
            <img
              className="absolute top-2 left-[75px] h-5"
              src={show}
              alt="Search"
            />
          </div>
          <button
            className="ml-4 rounded-[30px] bg-gray-50 w-[256px] h-10 text-gray-800 border border-gray-800 flex items-center justify-between px-4"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <img className="h-5" src={calendar} alt="Calendar" />
            <span>
              {dateRange[0].startDate && dateRange[0].endDate
                ? `${format(dateRange[0].startDate, "MM/dd/yyyy")} - ${format(
                    dateRange[0].endDate,
                    "MM/dd/yyyy"
                  )}`
                : "Select Date Range"}
            </span>
            <img
              className="h-5"
              src={showDatePicker ? arrow_up : arrow_down}
              alt="Dropdown"
            />
          </button>

          {showDatePicker && (
            <div
              className="absolute top-[60px] left-[500px] z-10"
              ref={datePickerRef}
            >
              <DateRange
                editableDateInputs={true}
                onChange={handleDateRangeChange}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                rangeColors={["#3754db"]}
              />
            </div>
          )}
          <button
            className={`ml-4 rounded-full w-[55px] h-10  flex items-center justify-center ${
              !dateRange[0].startDate && !dateRange[0].endDate
                ? "bg-gray-50 text-text-body-light border border-slate-600"
                : "bg-theme-primary-dark text-theme-white-default"
            }`}
            onClick={handleShowAllDates}
          >
            All
          </button>

          <button
            className="ml-4 rounded-md bg-theme-primary-dark w-[176px] h-10 text-theme-white-default flex items-center justify-center"
            onClick={() => navigate("/add_students")}
          >
            <img src={add_user} alt="Add Student" className="mr-2" /> Add
            Student
          </button>

          <button
            className="ml-4 rounded-md bg-theme-primary-dark w-[182px] h-10 text-theme-white-default flex items-center justify-center"
            onClick={() => navigate("/add_recordings")}
          >
            <img src={Plus} alt="Add Recording" className="mr-2" /> Add
            Recording
          </button>
        </div>

        <TableContainer ref={targetRef}>
          <Table>
            <TableHead className="bg-indigo-100">
              <TableRow>
                <TableCell align="center">Sr. No</TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleSort("studentId")}
                >
                  Student ID{" "}
                  {sortColumn === "studentId" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell align="center" onClick={() => handleSort("name")}>
                  Student Name{" "}
                  {sortColumn === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell align="center">Uploaded Recording</TableCell>
                <TableCell align="center">Topic</TableCell>
                <TableCell align="center">API Time</TableCell>
                <TableCell align="center">API Call Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                .filter((item) => {
                  const toSearch = search.toLowerCase();
                  return (
                    !search ||
                    item.studentId?.name?.toLowerCase().includes(toSearch) ||
                    String(item.studentId?.studentId).includes(toSearch)
                  );
                })
                .map((user, index) => (
                  <TableRow key={`${user.studentId.studentId}-${index}`}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      {user.studentId.studentId}
                    </TableCell>
                    <TableCell align="center">{user.studentId.name}</TableCell>
                    <TableCell align="center">
                      <audio
                        controls
                        key={`${user.studentId.studentId}-${index}`}
                      >
                        <source src={user.s3Url} type="audio/mp4" />
                        <source
                          src={user.s3Url.replace(".m4a", ".mp3")}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </TableCell>
                    <TableCell align="center">Dams</TableCell>
                    <TableCell align="center">{responseTime}</TableCell>
                    <TableCell align="center">
                      {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm a")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          className="rounded border border-royalblue px-4 py-2"
                          to={`/reports/${user.studentId.studentId}`}
                        >
                          View
                        </Link>
                        <button
                          className="rounded border border-royalblue px-4 py-2"
                          onClick={() => handleDeleteClick(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            count={filteredData.length}
            page={page}
            rowsPerPage={rowPerPage}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </div>

      {deleteAlert.show && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">{deleteAlert.message}</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#E74A51] text-white rounded-lg"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
