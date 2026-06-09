import type { SVGProps } from "react";
const SvgJira = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <rect width="100%" height="100%" fill="#fff" />
    <path
      fill="#2684FF"
      d="M234.266 15H122c0 26.976 22.713 48.933 50.617 48.933h20.765v19.134C193.382 110.042 216.096 132 244 132V24.41c0-5.332-4.218-9.41-9.734-9.41"
    />
    <path
      fill="url(#jira_svg__a)"
      d="M179.266 69H67c0 26.904 22.713 48.802 50.617 48.802h20.766v19.396C138.383 164.101 161.096 186 189 186V78.385c0-5.005-4.219-9.385-9.734-9.385"
    />
    <path
      fill="url(#jira_svg__b)"
      d="M123.346 123H12c0 26.976 22.527 48.933 50.202 48.933h20.596v19.134C82.798 218.043 105.325 240 133 240V132.41c0-5.333-4.505-9.41-9.654-9.41"
    />
    <defs>
      <linearGradient
        id="jira_svg__a"
        x1={186.611}
        x2={140.674}
        y1={69.27}
        y2={118.404}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.176} stopColor="#0052CC" />
        <stop offset={1} stopColor="#2684FF" />
      </linearGradient>
      <linearGradient
        id="jira_svg__b"
        x1={133.726}
        x2={80.354}
        y1={123.36}
        y2={176.637}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.176} stopColor="#0052CC" />
        <stop offset={1} stopColor="#2684FF" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgJira;
