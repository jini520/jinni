import type { SVGProps } from "react";
const SvgTailwind = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <rect width="100%" height="100%" fill="#fff" />
    <path
      fill="#44A8B3"
      d="M70 101.333Q81.6 48 128 48c46.4 0 52.2 40 75.4 46.667q23.2 6.666 40.6-20Q232.4 128 186 128c-46.4 0-52.2-40-75.4-46.667q-23.2-6.666-40.6 20m-58 80Q23.6 128 70 128c46.4 0 52.2 40 75.4 46.667q23.2 6.666 40.6-20Q174.4 208 128 208c-46.4 0-52.2-40-75.4-46.667q-23.2-6.666-40.6 20"
    />
  </svg>
);
export default SvgTailwind;
