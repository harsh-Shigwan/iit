import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import baseURL from '../../assets/API/API_URL';
import back from '../../assets/back.svg';
import print from '../../assets/print.svg';
import download from '../../assets/white_download.svg';
import  generatePDF  from 'react-to-pdf';
import DoughnutChart from '../../components/graphs/DoughnutChart';
import BarChart from '../../components/graphs/BarChart';
import blue from "../../assets/g_blue.svg";
import green from "../../assets/g_green.svg";
import red from "../../assets/g_red.svg";
import orange from "../../assets/g_orange.svg";
import Header from '../../components/Header';
import html2canvas from 'html2canvas';

const Reports = () => {
  const { studentId } = useParams();
  const reportAPI = `${baseURL}/api/assessments/${studentId}`;
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const printRef = useRef()
  const token = localStorage.getItem("token");
  const handlePrint = () => {
    const printContent = printRef.current;

    html2canvas(printContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`<img src="${imgData}" onload="window.print()" />`);
      printWindow.document.close();
    });
  };


  const handleDownloadPDF = () => {
    generatePDF( printRef, { filename: 'report.pdf' });
  };

  const handleBack = () => navigate('/home');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(reportAPI , {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(data);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportAPI]);

  const reportData = reports.assessments?.[0]?.reportData || {};
  const { speech_rate, pron_score, wcpm, percent_attempt, no_corr, no_miscue, word_scores = [] } = reportData;

  const getHighlightColor = (score) => {
    if (score === 1) return 'green';
    if (score >= 0.5) return '#FFC33D';
    if (score >= 0) return '#FF4437';
    return 'black';
  };

  const renderHighlightedText = () => word_scores.map(([word, score], index) => (
    <span key={index} style={{ color: getHighlightColor(score) }}>
      {word}{' '}
    </span>
  ));

  if (loading) return <div>Loading...</div>;

  return (
    <div>
    <Header></Header>
    <div className="flex flex-col items-center bg-whitesmoke">
  
      <div ref={printRef} className="mt-10 mb-10 w-[1000px] rounded-xl shadow-md print-content">
        <div className="flex flex-col bg-white w-[996px] h-[1080px] rounded-xl">
          <div className="flex items-center justify-between p-[15px] mb-[5px] mx-[35px] mt-[px]">
            <button className="flex items-center bg-[#F4F4F4] p-[12px] rounded-[6px]" onClick={handleBack}>
              <img src={back} className="w-[19px] h-[15px] mr-[13px] object-fill" alt="Back Icon" />
              <span className="text-[#16192C] text-[12px] font-bold">Back</span>
            </button>
          
          </div>

          <div className="flex items-start justify-between p-[22px] mb-[25px] mx-[35px]" >
            <div className="flex flex-col items-start">
              <div className="mb-[17px]">
                <span className="text-[#16192C] text-[15px] font-bold">Student Name :</span>
                <span className="text-[#16192C] text-[15px] ml-[12px]">{reports.student}</span>
              </div>
              <div className="mb-[7px]">
                <span className="text-[#16192C] text-[15px] font-bold">Student ID :</span>
                <span className="text-[#16192C] text-[15px] ml-[12px]">{studentId}</span>
              </div>
              <div className="mb-[17px] flex">
                <span className="text-[#16192C] text-[15px] mt-4 font-bold">Recording :</span>
                <span className="text-[#16192C] text-[15px] ml-[2px]">
                  <audio controls style={{ background: 'white', padding: '9px', borderRadius: '18px' }}>
                    <source src={reports.assessments?.[0]?.s3Url} type="audio/mp4" />
                    <source src={reports.assessments?.[0]?.s3Url?.replace('.m4a', '.mp3')} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  {!reports.assessments?.[0]?.s3Url && <p>No audio available for this report.</p>}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="items-end">
                <span className="text-[#16192C] text-[15px] font-bold mr-5">Date :</span>
                <span className="text-[#16192C] text-[15px]">
                  {reports.assessments?.[0]?.createdAt
                    ? format(new Date(reports.assessments[0].createdAt), 'dd/MM/yyyy ')
                    : 'No Date Available'}
                </span>
              </div>
              <div className="items-end mt-5">
                <span className="text-[#16192C] text-[15px] font-bold mr-8">Time :</span>
                <span className="text-[#16192C] text-[15px]">
                  {reports.assessments?.[0]?.createdAt
                    ? format(new Date(reports.assessments[0].createdAt), 'HH:mm a')
                    : 'No Date Available'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6 mx-7">
            <div className="flex w-full gap-4 ml-5 justify-between whitespace-nowrap max-md:flex-wrap">
              {[
                { label: 'Speech Rate', value: speech_rate || 'N/A' , img : blue },
                { label: 'PRON Score', value: pron_score || 'N/A' , img : red},
                { label: 'WCPM', value: wcpm || 'N/A' , img : green},
                { label: 'Percent attempt', value: percent_attempt ? `${percent_attempt} %` : 'N/A', img : orange },
              ].map((item, index) => (
                <div key={index} className="flex flex-col flex-1 justify-center p-6 bg-white rounded-2xl shadow-md max-md:px-5">
                  <div className="flex gap-4 justify-between">
                    <img loading="lazy" src={item.img} className="aspect-square w-[46px]" alt="Icon" />
                    <div className="flex flex-col flex-1 self-start">
                      <div className="text-sm font-medium text-slate-500">{item.label}</div>
                      <div className="text-lg font-semibold leading-7 text-gray-900">{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center mt-10 mb-[45px] border p-[22px] rounded-[16px] shadow-sm mx-[35px]">
            <div className="w-[792px]">
              <span className="text-[#16192C] text-[16px] font-bold mb-[18px]">Passage Details:</span>
              <div className="text-[#000000] mt-5 mb-5 text-[23px] font-table-body-heading">
                {renderHighlightedText()}
              </div>
            </div>
          </div>

          <div className="flex items-start bg-zinc-00 mb-[32px] mx-[35px]">
            <div className="p-[12px] rounded-[16px] bg-orage-700 shadow-sm border">
              <BarChart wcpm={wcpm} speechRate={speech_rate} pronScore={pron_score} percentAttempt={percent_attempt} />
            </div>
            <div className="p-[12px] ml-[32px] rounded-[16px] h-[302px] w-[405px] shadow-sm border">
              <DoughnutChart correct={no_corr} incorrect={no_miscue} />
            </div>
          </div>
        </div>
      </div>

      <button
      className="absolute top-[120px] left-[880px] rounded-md h-10 bg-theme-white-default box-border w-[106px] flex flex-col items-start justify-start py-2.5 px-5 text-theme-primary-dark border-[1px] border-solid border-theme-primary-dark"
      onClick={handlePrint}
    >
      <div className="w-24 pb-20 mx-[!important] absolute top-3 left-[calc(50%_-_48px)] flex flex-row items-center justify-start gap-[8px]">
        <img
          className="w-5 relative ml-4 mb-4 overflow-hidden shrink-0"
          alt=""
          src={print}
        />
        <div className="absolute ml-11 mb-5">Print</div>
      </div>
    </button>
    <button
      className="absolute top-[120px] left-[1000px] rounded-md h-10 bg-theme-primary-default box-border w-[136px] flex flex-col items-start justify-start py-2.5 px- text-theme-white-default border-[1px] border-solid border-theme-primary-dark"
      onClick={handleDownloadPDF}
    >
      <div className="w-24 pb-20 mx-[!important] absolute top-[calc(50%_-_12px)] left-[calc(50%_-_53px)] flex flex-row items-center justify-start gap-[8px]" >
        <img
          className="w-4  ml-0 mb-3 mt-0.5 overflow-hidden shrink-0"
          alt=""
          src={download}
        />
        <div className="absolute ml-8 mb-3">Download</div>
      </div>
    </button>

    </div></div>
  );
};

export default Reports;