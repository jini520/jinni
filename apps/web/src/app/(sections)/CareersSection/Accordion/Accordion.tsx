"use client";

import classNames from "classnames";
import React, { useState } from "react";
import ArrowIcon from "public/icons/arrow.svg";
import "./accordion.scss";

interface AccordionProps extends React.PropsWithChildren {
  className?: string;
  closedTitle: string;
  openedTitle: string;
}

const Accordion = ({
  closedTitle,
  openedTitle,
  children,
  className,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const classes = classNames("accordion", className, { active: isOpen });

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <div className={classes} onClick={handleClick}>
        <ArrowIcon width={12} height={12} className="accordion__icon" />
        {isOpen ? openedTitle : closedTitle}
      </div>
      <div className={classNames("accordion__content", { active: isOpen })}>
        {children}
      </div>
    </React.Fragment>
  );
};

export default Accordion;
