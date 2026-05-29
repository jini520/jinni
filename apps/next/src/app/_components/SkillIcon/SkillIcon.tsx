"use client";

import React, { useState } from "react";
import classNames from "classnames";
import "./skill-icon.scss";
import { iconRegistry, IconNames } from "@/constants/iconRegistry";
interface SkillIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  skill: IconNames;
}

const SkillIcon = ({
  className,
  size = "md",
  skill,
  selected = true,
}: SkillIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const IconComponent = iconRegistry[skill as IconNames];

  return (
    <div
      className="icon__container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={classNames(className, "icon__icon", `icon__${size}`, {
          selected: selected,
        })}
      >
        {IconComponent ? (
          <IconComponent />
        ) : (
          <div className="icon__placeholder">{skill}</div>
        )}
      </div>
      {isHovered && selected && (
        <div className="icon__tooltip">
          <p className="icon__tooltip--text">{skill}</p>
        </div>
      )}
    </div>
  );
};

export default SkillIcon;
