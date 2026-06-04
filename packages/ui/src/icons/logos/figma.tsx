import type { SVGProps } from "react";
const SvgFigma = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <rect width="100%" height="100%" fill="#fff" />
    <path
      fill="#0ACF83"
      d="M89.5 244c21.252 0 38.5-17.248 38.5-38.5V167H89.5C68.248 167 51 184.248 51 205.5S68.248 244 89.5 244"
    />
    <path
      fill="#A259FF"
      d="M51 128c0-21.528 17.248-39 38.5-39H128v78H89.5C68.248 167 51 149.528 51 128"
    />
    <path
      fill="#F24E1E"
      d="M51 50.5C51 29.248 68.248 12 89.5 12H128v77H89.5C68.248 89 51 71.752 51 50.5"
    />
    <path
      fill="#FF7262"
      d="M128 12h39c21.528 0 39 17.248 39 38.5S188.528 89 167 89h-39z"
    />
    <path
      fill="#1ABCFE"
      d="M206 128c0 21.528-17.472 39-39 39s-39-17.472-39-39 17.472-39 39-39 39 17.472 39 39"
    />
  </svg>
);
export default SvgFigma;
