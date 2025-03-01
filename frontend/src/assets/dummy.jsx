import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TableContainer, TablePagination } from "@mui/material";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Plus from "../../assets/Plus.svg";
import show from "../../assets/carbon_search.svg";
import baseURL from "../../assets/API_URL";
import arrow_down from "../../assets/down-arrow.svg";
import arrow_up from "../../assets/up-arrow.svg";
import calendar from "../../assets/calendar.svg";
import add_user from "../../assets/add-user.svg";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const Assessment = () => {
  const navigate = useNavigate();
  const targetRef = useRef();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseTime, setResponseTime] = useState(null);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        header: "Sr. No",
        accessorFn: (row, index) => index + 1,
        enableSorting: false,
      },
      {
        header: "Student ID",
        accessorKey: "studentId.studentId",
      },
      {
        header: "Student Name",
        accessorKey: "studentId.name",
      },
      {
        header: "Uploaded Recording",
        accessorKey: "s3Url",
        cell: ({ getValue }) => (
          <audio controls>
            <source src={getValue()} type="audio/mp4" />
            <source src={getValue().replace(".m4a", ".mp3")} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ),
        enableSorting: false,
      },
      {
        header: "Topic",
        cell: () => "Dams", // Static value for now
        enableSorting: false,
      },
      {
        header: "API Time",
        cell: () => responseTime,
        enableSorting: false,
      },
      {
        header: "API Call Time",
        accessorKey: "createdAt",
        cell: ({ getValue }) => format(new Date(getValue()), "dd/MM/yyyy HH:mm a"),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Link
              className="rounded border border-royalblue px-4 py-2"
              to={`/reports/${row.original.studentId.studentId}`}
            >
              View
            </Link>
            <button
              className="rounded border border-royalblue px-4 py-2"
              onClick={() => deleteData(row.original._id)}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [responseTime]
  );

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleDateRangeChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const filteredData = students.filter((item) => {
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
        const response = await axios.get(`${baseURL}/api/assessments/all`);
        const validStudents = response.data.filter((student) => student.studentId != null);
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
        },
      });
      // Update the state immediately after deletion
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
      console.log("Error response data:", error.response?.data);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ml-[40px] mt-0 bg-whitesmoke h-[700px] flex flex-col items-center justify-start px-[30px] pb-[30px] pt-10">
      <div className="w-[1250px] bg-theme-white-default">
        <div className="h-[60px] bg-theme-white-default relative flex items-center px-4">
          <div className="text-slate-600 font-inter font-medium text-2xl leading-6 tracking-normal">SAP API DATA</div>
          <div className="relative">
            <input
              className="rounded-[30px] ml-16 bg-gray-50 w-[301px] h-[38px] border border-black pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search...."
            />
            <img className="absolute top-2 left-[75px] h-5" src={show} alt="Search" />
          </div>
          <button
            className="ml-4 rounded-[30px] bg-gray-50 w-[256px] h-10 text-gray-800 border border-gray-800 flex items-center justify-between px-4"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <img className="h-5" src={calendar} alt="Calendar" />
            <span>
              {dateRange[0].startDate && dateRange[0].endDate
                ? `${format(dateRange[0].startDate, "MM/dd/yyyy")} - ${format(dateRange[0].endDate, "MM/dd/yyyy")}`
                : "Select Date Range"}
            </span>
            <img className="h-5" src={showDatePicker ? arrow_up : arrow_down} alt="Dropdown" />
          </button>

          {showDatePicker && (
            <div className="absolute top-[60px] left-[500px] z-10">
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
            className="ml-4 rounded-md bg-theme-primary-dark w-[176px] h-10 text-theme-white-default flex items-center justify-center"
            onClick={() => navigate("/add_students")}
          >
            <img src={add_user} alt="Add Student" className="mr-2" /> Add Student
          </button>

          <button
            className="ml-4 rounded-md bg-theme-primary-dark w-[182px] h-10 text-theme-white-default flex items-center justify-center"
            onClick={() => navigate("/add_recordings")}
          >
            <img src={Plus} alt="Add Recording" className="mr-2" /> Add Recording
          </button>
        </div>

        <TableContainer ref={targetRef}>
          <table className="w-full">
            <thead className="bg-indigo-100 h-20 mb-5  text-text-body-light font-medium  ">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-center"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted()] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.filter((row) => {
                  const toSearch = search.toLowerCase();
                  return (
                    !search ||
                    row.original.studentId?.name?.toLowerCase().includes(toSearch) ||
                    String(row.original.studentId?.studentId).includes(toSearch)
                  );
                })
                .map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 text-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <TablePagination
            count={filteredData.length}
            page={table.getState().pagination.pageIndex}
            rowsPerPage={table.getState().pagination.pageSize}
            onPageChange={(e, newPage) => table.setPageIndex(newPage)}
            onRowsPerPageChange={(e) => {
              table.setPageSize(Number(e.target.value));
              table.setPageIndex(0);
            }}
          />
        </TableContainer>
      </div>
    </div>
  );
};

export default Assessment;