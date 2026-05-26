"use client";

import React, { useEffect, useRef, useState } from "react";
import LiquidGlass from "@/app/_components/LiquidGlass/LiquidGlass";
import Shape from "@/app/_components/Shape/Shape";
import SkillIcon from "@/app/_components/SkillIcon/SkillIcon";
import classNames from "classnames";
import { IconNames } from "@/constants/iconRegistry";
import useColor from "@/hooks/useColor";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import ThreeDotsIcon from "public/icons/threedots.svg";
import "./project-card.scss";
import Tag from "@/app/_components/Tag/Tag";
import { useMediaQueryContext } from "@/context/mediaQueryContext";

interface ProjectCardProps {
  id: string;
  title: string;
  discription: string;
  skills: string[];
}

const ProjectCard = ({ id, title, discription, skills }: ProjectCardProps) => {
  const { getColor } = useColor();
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const { isMobile, isTablet, isDesktop } = useMediaQueryContext();

  const [visibleCount, setVisibleCount] = useState(skills.length);
  const [hiddenCount, setHiddenCount] = useState(0);

  useEffect(() => {
    const count = Math.floor(width / (isMobile ? 31 : isTablet ? 33 : 35));
    setVisibleCount(count - 1);
    setHiddenCount(Math.max(0, skills.length - count + 1));
  }, [width, isMobile, skills.length]);

  return (
    <LiquidGlass
      className={classNames("project__card", `project__card--${getColor(id)}`)}
    >
      <div className="project__card-inner">
        <Shape className="project__card-shape" id={id} />
        <div className="project__card-title-wrapper">
          <h4 className="project__card-title">
            <span className="project__card-title-inner">{title}</span>
          </h4>
          <p className="project__card-description">{discription}</p>
        </div>
        <div className="project__card-skills" ref={ref}>
          {skills.map((skill, index) => {
            if (index >= visibleCount) return;
            return (
              <SkillIcon
                className="project__card-skill"
                key={skill}
                skill={skill as IconNames}
                size="sm"
              />
            );
          })}
          {hiddenCount > 0 && (
            <Tag label={`+${hiddenCount}`} color={getColor(id)} />
          )}
        </div>
      </div>
    </LiquidGlass>
  );
};

export default ProjectCard;
