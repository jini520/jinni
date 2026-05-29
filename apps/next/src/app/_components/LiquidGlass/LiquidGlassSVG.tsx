import React from "react";

export interface LiquidGlassSVGProps {
  baseFrequency?: string;
  numOctaves?: string;
  seed?: string;
  stdDeviation?: string;
  scale?: string;
}

const LiquidGlassSVG = ({
  baseFrequency = "0.008 0.008",
  numOctaves = "2",
  seed = "92",
  stdDeviation = "2",
  scale = "70",
}: LiquidGlassSVGProps) => {
  return (
    <svg style={{ display: "none" }}>
      <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          seed={seed}
          result="noise"
        />
        <feGaussianBlur
          in="noise"
          stdDeviation={stdDeviation}
          result="blurred"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="blurred"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
};

export default LiquidGlassSVG;
