import type { SVGProps } from "react";
const SvgMieum = (props: SVGProps<SVGSVGElement>) => (
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
      d="M150 57H50v86M50 143h100V57"
    />
  </svg>
);
export default SvgMieum;
