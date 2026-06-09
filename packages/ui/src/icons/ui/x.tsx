import type { SVGProps } from "react";
const SvgX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={24}
      d="m44 44 168 168m0-168L44 212"
    />
  </svg>
);
export default SvgX;
