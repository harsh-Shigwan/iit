import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
} from "@mui/material";
import generatePDF from "react-to-pdf";
import download from "../../assets/download.svg";
import carbon from "../../assets/carbon_search.svg";
import edit_blue from "../../assets/edit_blue.svg";
import delete_white from "../../assets/delete_white.svg";
import baseURL from "../../assets/API/API_URL";
import LoadingScreen from "../../components/LoadingScreen";

const All_Students = () => {
  const API = `${baseURL}/api/students/all`;
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [deleteAlert, setDeleteAlert] = useState({
    show: false,
    message: "",
    id: null,
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const targetRef = useRef();
  const queryClient = useQueryClient();

  const {
    data: myData = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axios.get(API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.students || [];
    },
    staleTime: 60000,
    onError: (error) => {
      console.error("API Error:", error);
    },
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleRowPerPageChange = (event) => {
    setRowPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/students/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setDeleteAlert({ show: false, message: "", id: null });
    } catch (error) {
      console.error("API Error:", error);
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

  if (isLoading) return <LoadingScreen/>;
  if (isError) return <div>Error fetching data. Please try again later.</div>;

  const filteredData = myData.filter((item) => {
    const searchLowerCase = search.toLowerCase();
    const studentIdString = item.studentId ? String(item.studentId) : "";
    const nameString = item.name ? item.name.toLowerCase() : "";
    return (
      searchLowerCase === "" ||
      nameString.includes(searchLowerCase) ||
      studentIdString.includes(searchLowerCase)
    );
  });

  return (
    <div className="ml-[55px] mt-0 relative flex flex-col items-center justify-start pt-0 px-[30px] pb-[30px] box-border text-left text-xs text-f2d3d font-table-body-heading">
      <div className="flex flex-col items-center justify-start pt-5 px-0 pb-0">
        <div className="h-[692px] flex flex-col items-start justify-start">
          <div className="w-[1110px] relative bg-theme-white-default shrink-0">
            <div className="absolute top-[0px] left-[0px] w-[1110px] flex flex-col items-start justify-start">
              <div className="self-stretch relative h-[60px] overflow-hidden shrink-0">
                <div className="absolute w-full top-[60px] right-[0px] left-[0px] bg-gray-200 box-border h-0 border-t-[1px] border-solid border-border-light" />

                <input
                  className="absolute top-[11px] left-[718px] rounded-[30px] bg-theme-white-default box-border w-[161px] h-[38px] border-[1px] border-solid border-black pl-10"
                  placeholder="Search...."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute top-[18px] left-[620px] h-[23.75px] flex flex-row ml-28 items-start justify-start">
                  <img
                    className="w-5 relative h-5 overflow-hidden shrink-0"
                    alt=""
                    src={carbon}
                  />
                </div>
                <button
                  className="absolute top-[11px] left-[905px] rounded-md h-10 bg-theme-white-default box-border w-[156px] flex flex-col items-start justify-start py-2.5 px-5 text-theme-primary-dark border-[1px] border-solid border-theme-primary-dark"
                  onClick={() =>
                    generatePDF(targetRef, { filename: "Student_List.pdf" })
                  }
                >
                  <div className="w-24 my-0 mx-[!important] absolute top-[calc(50%_-_8px)] left-[calc(50%_-_48px)] flex flex-row items-center justify-start gap-[8px] z-[0]">
                    <img
                      className="w-4 relative h-4 overflow-hidden shrink-0"
                      alt=""
                      src={download}
                    />
                    <div className="relative font-semibold">Download</div>
                  </div>
                </button>
              </div>
              <div className="self-stretch shrink-0 items-start justify-start bg-white text-text-body-light">
                <TableContainer ref={targetRef}>
                  <Table>
                    <TableHead className="bg-indigo-100 w-full">
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Recordings</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        .slice(
                          page * rowPerPage,
                          page * rowPerPage + rowPerPage
                        )
                        .map((student, index) => (
                          <TableRow key={student._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.studentId}</TableCell>
                            <TableCell>
                              {student.recordings
                                ? student.recordings.length
                                : 0}
                            </TableCell>
                            <TableCell>
                              <div className="flex bg-slate-40 w-24">
                                <div className="relative bg-theme-white-default h-[52px]">
                                  <Link
                                    to={`/edit_students/${student.studentId}`}
                                    className="absolute top-[13px] mr-12 rounded-md flex items-center py-2 px-4 border border-theme-primary-default text-theme-primary-default w-20 bg-theme-white-default"
                                  >
                                    <img
                                      className="w-5 h-3 mr-2"
                                      alt=""
                                      src={edit_blue}
                                    />
                                    <div className="leading-[10px] p-0 font-medium">
                                      Edit
                                    </div>
                                  </Link>
                                </div>
                                <div className="relative bg-theme-primary-dark h-[52px]">
                                  <button
                                    className="absolute top-[13px] left-[100px] rounded flex items-center py-2 px-4 border w-24 border-theme-primary-default text-theme-white-default bg-theme-primary-dark"
                                    onClick={() =>
                                      handleDeleteClick(student.studentId)
                                    }
                                  >
                                    <img
                                      className="w-5 h-3 mr-2"
                                      alt=""
                                      src={delete_white}
                                    />
                                    <div className="leading-[10px] font-medium">
                                      Delete
                                    </div>
                                  </button>
                                </div>
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
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleRowPerPageChange}
                  />
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      {deleteAlert.show && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-inter mb-4">{deleteAlert.message}</p>
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

export default All_Students;
