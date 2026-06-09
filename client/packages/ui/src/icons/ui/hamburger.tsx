import type { SVGProps } from "react";
const SvgHamburger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 48 48"
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
    >
      <path d="M7.95 11.95h32M7.95 23.95h32M7.95 35.95h32" />
    </g>
  </svg>
);
export default SvgHamburger;
