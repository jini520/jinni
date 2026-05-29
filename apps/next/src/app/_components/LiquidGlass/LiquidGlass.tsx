import React from "react";
import LiquidGlassSVG from "./LiquidGlassSVG";
import "./liquid-glass.scss";
import classNames from "classnames";
import { LiquidGlassSVGProps } from "./LiquidGlassSVG";

interface LiquidGlassProps {
  className?: string;
  children: React.ReactNode;
  svgProps?: LiquidGlassSVGProps;
}

const LiquidGlass = ({ className, children }: LiquidGlassProps) => {
  return (
    <div className={classNames("glass-container", className)}>
      <div className="glass-filter"></div>
      <div className="glass-overlay"></div>
      <div className="glass-specular"></div>
      <div className="glass-content">{children}</div>
      <LiquidGlassSVG />
    </div>
  );
};

export default LiquidGlass;
