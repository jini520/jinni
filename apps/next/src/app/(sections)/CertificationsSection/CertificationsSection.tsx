import React from "react";
import Section from "../../_components/Section/Section";
import { getCertifications } from "@/api/certifications.api";
import CertificationIcon from "public/icons/certifications.svg";
import AwardIcon from "public/icons/award.svg";
import LiquidGlass from "../../_components/LiquidGlass/LiquidGlass";
import "./certifications-section.scss";

const CertificationsSection = async () => {
  const data = await getCertifications();

  return (
    <Section id="certifications" className="section section__certifications">
      <h3 className="section__title">자격 및 수상</h3>
      <div className="certifications__list">
        {data.certifications.map((certification) => (
          <div className="certification__item" key={certification.id}>
            <LiquidGlass className="certification__icon">
              <CertificationIcon width="1.5rem" height="1.5rem" />
            </LiquidGlass>
            <div className="certification__content-wrapper">
              <span className="certification__date">{certification.date}</span>
              <div className="certification__content">
                <div>{certification.name}</div>
                <div className="certification__description">
                  <span>{certification.organization}, </span>
                  <span>{certification.tier}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data.awards.map((award) => (
          <div className="certification__item" key={award.id}>
            <LiquidGlass className="certification__icon">
              <AwardIcon width="1.5rem" height="1.5rem" />
            </LiquidGlass>
            <div className="certification__content-wrapper">
              <span className="certification__date">{award.date}</span>
              <div className="certification__content">
                <div>{award.name}</div>
                <div className="certification__description">
                  <span>{award.organization}, </span>
                  <span>{award.tier}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default CertificationsSection;
