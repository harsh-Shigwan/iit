import React from "react";
export default (props) => {
	return (
		<div className="flex flex-col bg-white w-[996px] h-[1390px]">
  <div className="self-stretch bg-white h-[1390px]">
    <div className="self-stretch mx-[35px] my-[16px]">
      <div className="self-stretch mb-[45px]">
        <div className="self-stretch mb-[45px]">
          {/* Header Section */}
          <div className="flex items-center justify-between p-[15px] mb-[25px]">
            <div className="flex items-center bg-[#F4F4F4] p-[12px] rounded-[6px]">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/4SVskGdjZA/3j1yyqml.png"
                className="w-[19px] h-[15px] mr-[13px] object-fill"
                alt="Back Icon"
              />
              <span className="text-[#16192C] text-[12px] font-bold">Back</span>
            </div>
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center bg-white p-[12px] rounded-[6px]">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/4SVskGdjZA/13wapjid.png"
                  className="w-[12px] h-[12px] object-fill"
                  alt="Print Icon"
                />
                <span className="text-[#16192C] text-[12px] font-bold ml-[20px]">Print</span>
              </div>
              <div className="flex items-center bg-[#4C6FFF] p-[12px] rounded-[6px]">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/4SVskGdjZA/cbdcqchx.png"
                  className="w-[12px] h-[12px] object-fill"
                  alt="Download Icon"
                />
                <span className="text-white text-[12px] font-bold ml-[20px]">Download</span>
              </div>
            </div>
          </div>

          {/* Student Details Section */}
          <div className="flex items-start justify-between p-[22px] mb-[25px]">
            <div className="flex flex-col items-start">
              <div className="mb-[17px]">
                <span className="text-[#16192C] text-[15px] font-bold">Student Name:</span>
                <span className="text-[#16192C] text-[15px] ml-[3px]">Kamal Tripathi</span>
              </div>
              <div className="mb-[17px]">
                <span className="text-[#16192C] text-[15px] font-bold">Student ID:</span>
                <span className="text-[#16192C] text-[15px] ml-[9px]">DVSVSVS4155</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#16192C] text-[15px] font-bold">Date:</span>
              <span className="text-[#16192C] text-[15px]">15/06/2025</span>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="flex items-start gap-[16px] mb-[25px]">
            {[
              { icon: "ske62khf.png", label: "Growth", value: "23%", bg: "#FFECE3" },
              { icon: "6eeasn89.png", label: "Recruitments", value: "57", bg: "#DEFFED" },
              { icon: "cg7eh5nc.png", label: "Applicants", value: "2.300", bg: "#FFEEF0" },
              { icon: "44mqgasi.png", label: "New Jobs", value: "20", bg: "#E1E7FF" },
            ].map((metric, index) => (
              <div
                key={index}
                className="flex-1 bg-white p-[37px] rounded-[16px] shadow-[0px_3px_8px_#3232470D]"
              >
                <div className="flex items-start">
                  <div className={`bg-[${metric.bg}] p-[14px] rounded-[8px]`}>
                    <img
                      src={`https://storage.googleapis.com/tagjs-prod.appspot.com/4SVskGdjZA/${metric.icon}`}
                      className="w-[18px] h-[18px] object-fill"
                      alt={`${metric.label} Icon`}
                    />
                  </div>
                  <div className="ml-[16px]">
                    <span className="text-[#718096] text-[12px] font-bold">{metric.label}</span>
                    <span className="text-[#16192C] text-[20px] font-bold">{metric.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passage Details Section */}
        <div className="flex flex-col items-center mb-[45px]">
          <div className="w-[792px]">
            <span className="text-[#16192C] text-[15px] font-bold mb-[18px]">Passage Details:</span>
            <span className="text-[#000000] text-[15px]">
              A dam is a wall built across a river. When it rains, a lot of water flows down the river and into the sea. The dam stops the water, creating a large lake behind it. Later, this water is released into fields to help crops like rice grow.
            </span>
          </div>
        </div>
      </div>

      {/* Statistics and Storage Section */}
      <div className="self-stretch">
        <div className="flex items-start gap-[16px] mb-[32px]">
          <div className="flex-1 bg-white p-[24px] rounded-[16px] shadow-[0px_3px_8px_#3232470D]">
            <span className="text-[#16192C] text-[16px] font-bold ml-[141px]">Statistics</span>
            <div className="h-[212px] mt-[30px]"></div>
          </div>
          <div className="bg-white p-[22px] rounded-[16px] shadow-[0px_3px_8px_#3232470D]">
            <span className="text-[#000000] text-[18px] font-bold">Storage</span>
          </div>
        </div>

        {/* Profile Views and Viewers Section */}
        <div className="flex items-start gap-[16px]">
          <div className="flex-1 bg-white p-[24px] rounded-[16px] shadow-[0px_3px_8px_#3232470D]">
            <span className="text-[#16192C] text-[16px] font-bold">Profile Views</span>
          </div>
          <div className="bg-white p-[29px] rounded-[16px] shadow-[0px_3px_8px_#3232470D]">
            <span className="text-[#16192C] text-[16px] font-bold mb-[28px]">Viewers</span>
            <div className="w-[205px] h-[132px]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
	)
}