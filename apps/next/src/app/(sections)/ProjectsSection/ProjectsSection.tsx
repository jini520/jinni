import React from "react";
import Section from "../../_components/Section/Section";
import ProjectCards from "./ProjectCards/ProjectCards";
import "./projects-section.scss";

const ProjectsSection = () => {
  return (
    <Section id="projects" className="section__projects">
      <h3 className="section__title">프로젝트 상세</h3>
      <p className="section__description">
        주요 프로젝트의 상세 내용을 확인할 수 있습니다.
      </p>
      <ProjectCards />
    </Section>
  );
};

export default ProjectsSection;
