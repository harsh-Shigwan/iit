import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import baseURL from '../../assets/API_URL';
import back from '../../assets/back.svg';
import print from '../../assets/print.svg';
import download from '../../assets/download.svg';
import generatePDF from 'react-to-pdf';
import DoughnutChart from '../../components/graphs/DoughnutChart';
import BarChart from '../../components/graphs/BarChart';
import { useReactToPrint } from 'react-to-print';

const Reports = () => {
  const { studentId } = useParams();
  const reportAPI = `${baseURL}/api/assessments/${studentId}`;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [speechRate, setSpeechRate] = useState(null);
  const [pronScore, setPronScore] = useState(null);
  const [wcpm, setWcpm] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [incorrect, setIncorrect] = useState(null);

  // Ref for printing and downloading
  const contentToPrint = useRef(null);

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: 'Student Report',
    removeAfterPrint: true,
  });

  const handle = () => {
    navigate('/home');
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(reportAPI);
        setReports(response.data);
      } catch (err) {
        console.log(err);
        console.log('Error response data:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportAPI]);

  useEffect(() => {
    if (reports.assessments?.[0]?.reportData) {
      setSpeechRate(reports.assessments[0].reportData.speech_rate || 'N/A');
      setPronScore(reports.assessments[0].reportData.pron_score || 'N/A');
      setWcpm(reports.assessments[0].reportData.wcpm || 'N/A');
      setAttempt(reports.assessments[0].reportData.percent_attempt || 'N/A');
      setCorrect(reports.assessments[0].reportData.no_corr || 'N/A');
      setIncorrect(reports.assessments[0].reportData.no_miscue || 'N/A');
    }
  }, [reports]);

  const getHighlightColor = (score) => {
    if (score === 1) return 'green';
    if (score >= 0.5 && score < 1) return '#FFC33D';
    if (score >= 0 && score < 0.5) return '#FF4437';
    return 'black'; // default color
  };

  const renderHighlightedText = () => {
    const wordScores = reports.assessments?.[0]?.reportData?.word_scores || [];
    return wordScores.map(([word, score], index) => (
      <span key={index} style={{ color: getHighlightColor(score) }}>
        {word}{' '}
      </span>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-whitesmoke">
      {/* Assign contentToPrint to the outermost container */}
      <div ref={contentToPrint} className="mt-10 mb-10 w-[1000px] rounded-xl shadow-md">
        <div className="flex flex-col bg-white w-[996px] h-[1180px] rounded-xl">
          {/* Header Section */}
          <div className="flex items-center justify-between p-[15px] mb-[25px] mx-[35px] mt-[16px]">
            <button className="flex items-center bg-[#F4F4F4] p-[12px] rounded-[6px]" onClick={handle}>
              <img src={back} className="w-[19px] h-[15px] mr-[13px] object-fill" alt="Back Icon" />
              <span className="text-[#16192C] text-[12px] font-bold">Back</span>
            </button>
            <div className="flex items-center gap-[24px]">
              <button className="flex items-center bg-white border p-[12px] rounded-[6px]" onClick={handlePrint}>
                <img src={print} className="w-[12px] h-[12px] object-fill" alt="Print Icon" />
                <span className="text-[#16192C] text-[12px] font-bold ml-[20px]">Print</span>
              </button>
              <button
                className="flex items-center bg-[#4C6FFF] p-[12px] rounded-[6px]"
                onClick={() => generatePDF(contentToPrint, { filename: 'report.pdf' })}
              >
                <img src={download} className="w-[12px] h-[12px] object-fill" alt="Download Icon" />
                <span className="text-white text-[12px] font-bold ml-[20px]">Download</span>
              </button>
            </div>
          </div>

          {/* Student Details Section */}
          <div className="flex items-start justify-between p-[22px] mb-[25px] mx-[35px]">
            <div className="flex flex-col items-start">
              <div className="mb-[17px]">
                <span className="text-[#16192C] text-[15px] font-bold">Student Name :</span>
                <span className="text-[#16192C] text-[15px] ml-[12px]">{reports.student}</span>
              </div>
              <div className="mb-[17px]">
                <span className="text-[#16192C] text-[15px] font-bold">Student ID :</span>
                <span className="text-[#16192C] text-[15px] ml-[12px]">{studentId}</span>
              </div>

              <div className="mb-[17px] flex">
                <span className="text-[#16192C] text-[15px] mt-4 font-bold">Recording :</span>
                <span className="text-[#16192C] text-[15px] ml-[12px]">
                  <audio controls style={{ background: 'white', padding: '12px', borderRadius: '18px' }}>
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

          {/* Metrics Section */}
          <div className="flex items-start gap-4 mb-6 mx-7">
            <div className="flex w-full gap-4 ml-5 justify-between whitespace-nowrap max-md:flex-wrap">
              {[
                {
                  icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/99202057085f6f91af2056bc6d19d1a40ad9473cdb467d174061ab4e51150410?apiKey=8cd55a55d3fd4759ad0a38ee8bf55a48&',
                  label: 'Speech Rate',
                  value: speechRate !== null ? speechRate : 'N/A',
                },
                {
                  icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2b0d4a25ded797bf0cd0de5ce2cc280a1b3050c300deb67e46af3f5e3179fa1c?apiKey=8cd55a55d3fd4759ad0a38ee8bf55a48&',
                  label: 'PRON Score',
                  value: pronScore !== null ? pronScore : 'N/A',
                },
                {
                  icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b7aadeb46d60ef7147ca9e984f588045ad1cb3b24949c7200303f1adf7875caa?apiKey=8cd55a55d3fd4759ad0a38ee8bf55a48&',
                  label: 'WCPM',
                  value: wcpm !== null ? wcpm : 'N/A',
                },
                {
                  icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ecbfb9469c216331a1f2af47ee338c1c0da4d53c207edb23ea2e32cd0cca7df4?apiKey=8cd55a55d3fd4759ad0a38ee8bf55a48&',
                  label: 'Percent attempt',
                  value: attempt !== null ? `${attempt} %` : 'N/A',
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col flex-1 justify-center p-6 bg-white rounded-2xl shadow-md max-md:px-5">
                  <div className="flex gap-4 justify-between">
                    <img loading="lazy" src={item.icon} className="aspect-square w-[46px]" alt={item.label} />
                    <div className="flex flex-col flex-1 self-start">
                      <div className="text-sm font-medium text-slate-500">{item.label}</div>
                      <div className="text-lg font-semibold leading-7 text-gray-900">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passage Details Section */}
          <div className="flex flex-col items-center mt-10 mb-[45px] border p-[22px] rounded-[16px] shadow-sm mx-[35px]">
            <div className="w-[792px]">
              <span className="text-[#16192C] text-[15px] font-semibold mb-[18px]">Passage Details:</span>
              <div className="text-[#000000] mt-5 mb-5 text-[23px] font-table-body-heading">
                {renderHighlightedText()}
              </div>
            </div>
          </div>

          {/* Statistics and Storage Section */}
          <div className="flex items-start bg-zinc-00 mb-[32px] mx-[35px]">
            <div className="p-[24px] rounded-[16px] bg-orage-700 shadow-md">
              <BarChart wcpm={wcpm} speechRate={speechRate} pronScore={pronScore} percentAttempt={attempt} />
            </div>
            <div className="p-[29px] ml-4 mb-5 rounded-[16px] h-[312px] w-[405px] shadow-md">
              <DoughnutChart correct={correct} incorrect={incorrect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;