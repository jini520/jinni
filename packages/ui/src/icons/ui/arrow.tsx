import type { SVGProps } from "react";
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16 22 6 12 16 2l1.775 1.775L9.55 12l8.225 8.225z"
    />
  </svg>
);
export default SvgArrow;
