import React from "react";
import classNames from "classnames";
import "./section.scss";

type SectionProps = React.ComponentProps<"section">;

const Section = ({ children, className, ...props }: SectionProps) => {
  const classes = classNames("section", className);

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
};

export default Section;
