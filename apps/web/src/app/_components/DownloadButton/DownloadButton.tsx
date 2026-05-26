import React from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import DownloadIcon from "public/icons/download.svg";
import "./download-button.scss";

interface DownloadButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const DownloadButton = ({ children, onClick }: DownloadButtonProps) => {
  return (
    <button className="download-button" onClick={onClick}>
      <LiquidGlass className="download-button__wrapper">
        <div className="download-button__content">
          <DownloadIcon className="download-button__icon" />
          {children}
        </div>
      </LiquidGlass>
    </button>
  );
};

export default DownloadButton;
