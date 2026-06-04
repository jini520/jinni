import type { SVGProps } from "react";
const SvgVite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <rect width="100%" height="100%" fill="#fff" />
    <path
      fill="url(#vite_svg__a)"
      d="M243.236 46.811 134.723 240.98c-2.24 4.009-7.996 4.033-10.27.043L13.789 46.83c-2.477-4.347 1.238-9.613 6.16-8.733l108.629 19.43a5.9 5.9 0 0 0 2.096-.004L237.03 38.125c4.907-.895 8.64 4.33 6.206 8.686"
    />
    <path
      fill="url(#vite_svg__b)"
      d="m180.687 12.057-80.36 15.808a2.96 2.96 0 0 0-2.378 2.733l-4.944 83.816c-.116 1.974 1.69 3.506 3.61 3.062l22.373-5.184c2.093-.485 3.984 1.366 3.554 3.48l-6.647 32.677c-.447 2.2 1.61 4.08 3.749 3.428l13.819-4.215c2.142-.653 4.201 1.233 3.747 3.434l-10.563 51.329c-.661 3.211 3.593 4.962 5.367 2.209l1.185-1.838 65.482-131.195c1.096-2.196-.795-4.701-3.198-4.236l-23.029 4.463c-2.165.418-4.006-1.605-3.395-3.73l15.031-52.312c.611-2.13-1.236-4.155-3.403-3.729"
    />
    <defs>
      <linearGradient
        id="vite_svg__a"
        x1={11.087}
        x2={146.255}
        y1={31.158}
        y2={214.606}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#41D1FF" />
        <stop offset={1} stopColor="#BD34FE" />
      </linearGradient>
      <linearGradient
        id="vite_svg__b"
        x1={122.665}
        x2={147.301}
        y1={16.349}
        y2={184.69}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFEA83" />
        <stop offset={0.083} stopColor="#FFDD35" />
        <stop offset={1} stopColor="#FFA800" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgVite;
