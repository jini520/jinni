import React from "react";
import classNames from "classnames";
import "./tag.scss";

interface TagProps {
  label: string;
  color: string;
}
const Tag = ({ label, color }: TagProps) => {
  return (
    <div className={classNames("tag", `tag--${color}`)}>
      <span className="tag__label">{label}</span>
    </div>
  );
};

export default Tag;
