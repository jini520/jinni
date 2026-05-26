"use client";

import React from "react";
import DownloadButton from "../DownloadButton";

const ResumeDownloadButton = () => {
  const handleDownload = () => {
    // nginx가 /api/*를 백엔드로 프록시하므로 직접 호출
    window.open("/api/resumes/latest", "_blank");
  };

  return (
    <DownloadButton onClick={handleDownload}>이력서 다운로드</DownloadButton>
  );
};

export default ResumeDownloadButton;
