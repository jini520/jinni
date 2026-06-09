import type { SVGProps } from "react";
const SvgSolidity = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <rect width="100%" height="100%" fill="#fff" />
    <path fill="#000" d="m166 12-37.352 66H54l37.324-66z" opacity={0.45} />
    <path fill="#000" d="M128.324 78H203l-37.324-66H91z" opacity={0.6} />
    <path
      fill="#000"
      d="M91.5 144 129 78.014 91.5 12 54 78.014z"
      opacity={0.8}
    />
    <path fill="#000" d="m91 244 37.343-67H203l-37.343 67z" opacity={0.45} />
    <path fill="#000" d="M128.676 177H54l37.324 67H166z" opacity={0.6} />
    <path
      fill="#000"
      d="M165.986 111 129 177.486 165.986 244 203 177.486z"
      opacity={0.8}
    />
  </svg>
);
export default SvgSolidity;
