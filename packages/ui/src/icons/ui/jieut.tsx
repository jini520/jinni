import type { SVGProps } from "react";
const SvgJieut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 200 200"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeDasharray="1 1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="inherit"
      d="M50 57h100M50 143l50-50 50 50"
    />
  </svg>
);
export default SvgJieut;
