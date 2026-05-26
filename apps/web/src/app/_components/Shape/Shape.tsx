import React from "react";
import Shape1 from "public/shape/variant1.svg";
import Shape2 from "public/shape/variant2.svg";
import Shape3 from "public/shape/variant3.svg";
import Shape4 from "public/shape/variant4.svg";
import Shape5 from "public/shape/variant5.svg";
import Shape6 from "public/shape/variant6.svg";
import Shape7 from "public/shape/variant7.svg";
import classNames from "classnames";
import "./shape.scss";

type ShapeProps = {
  className?: string;
  id: string;
  size?: "sm" | "md" | "lg";
};

const shapeMap: Record<number, React.FC<React.SVGProps<SVGSVGElement>>> = {
  1: Shape1,
  2: Shape2,
  3: Shape3,
  4: Shape4,
  5: Shape5,
  6: Shape6,
  7: Shape7,
};

const Shape = ({ className, id, size = "md" }: ShapeProps) => {
  const shape = (id.charCodeAt(0) % 7) + 1;
  const ShapeComponent = shapeMap[shape];

  return (
    <ShapeComponent
      className={classNames(className, "shape", `shape--${size}`)}
    />
  );
};

export default Shape;
