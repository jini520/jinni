import React from "react";
import Section from "../../_components/Section/Section";
import "./hero-section.scss";
import ResumeDownloadButton from "../../_components/DownloadButton/Resume/ResumeDownloadButton";

const HeroSection = () => {
  return (
    <Section className="section__hero">
      <h1 className="section__title">
        <p>
          안녕하세요, <br />
          프론트엔드 개발자 <br />
          <span className="flicker-text">제진명</span>
          입니다.
        </p>
      </h1>
      <p className="section__description">
        <br />
      </p>
      <div className="section__download-area">
        <ResumeDownloadButton />
      </div>
    </Section>
  );
};

export default HeroSection;
