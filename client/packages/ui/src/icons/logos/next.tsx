import type { SVGProps } from "react";
const SvgNext = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <g clipPath="url(#next_svg__a)">
      <path fill="#000" d="M0 0h256v256H0z" />
      <path
        fill="url(#next_svg__b)"
        d="M213 225.494 98.562 77H77v103.238h17.25V99.067L199.46 236A128.5 128.5 0 0 0 213 225.494"
      />
      <path
        fill="url(#next_svg__c)"
        fillRule="evenodd"
        d="M163 77h16v101h-16z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="next_svg__b"
        x1={155.319}
        x2={206.319}
        y1={166.654}
        y2={229.405}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" />
        <stop offset={1} stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="next_svg__c"
        x1={171}
        x2={170.703}
        y1={77.002}
        y2={151.174}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" />
        <stop offset={1} stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <clipPath id="next_svg__a">
        <path fill="#fff" d="M0 0h256v256H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgNext;
