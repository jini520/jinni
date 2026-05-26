import React from "react";
import Section from "../../_components/Section/Section";
import Astar from "public/icons/astar.svg";
import { getEdu } from "@/api/edu.api";
import "./educations-section.scss";

const EducationsSection = async () => {
  const data = await getEdu();

  return (
    <Section id="education" className="section section__educations">
      <h3 className="section__title">교육</h3>
      <ul className="timeline__list">
        {data?.map((education) => (
          <li className="timeline__item" key={education.education}>
            <span className="timeline__header">
              <Astar />
              <span className="timeline__date">
                {education.startDate} - {education.endDate}
              </span>
            </span>
            <div className="timeline__content">
              <div className="timeline__title">
                {education.education}
                <span className="timeline__status">{education.status}</span>
              </div>
              <span className="timeline__description">
                {education.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default EducationsSection;
