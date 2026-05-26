// Shared content + utility data
// Hero/tech copy mirrors the existing portfolio screenshot.
// Project/career/post specifics are placeholders the user can fill in.

const PROFILE = {
  nameKo: "제진명",
  nameEn: "Je Jinmyeong",
  role: "Frontend Developer",
  greeting: "안녕하세요,",
  intro: "프론트엔드 개발자",
  tagline: "사용자 경험을 코드로 설계하는 프론트엔드 개발자",
  site: "jejinni.site",
  location: "Seoul, KR",
};

// Tech: groups + ordering match the screenshot.
const TECH = [
  // 언어
  { name: "JavaScript",        slug: "JS", hue: 48,  group: "Language" },
  { name: "TypeScript",        slug: "TS", hue: 215, group: "Language" },
  { name: "Java",              slug: "Jv", hue: 18,  group: "Language" },
  // 프론트엔드
  { name: "React",             slug: "Re", hue: 195, group: "Frontend" },
  { name: "Next.js",           slug: "Nx", hue: 0,   group: "Frontend", mono: true },
  { name: "React Native",      slug: "RN", hue: 185, group: "Frontend" },
  // 라이브러리
  { name: "Zustand",           slug: "Zu", hue: 28,  group: "Library" },
  { name: "Redux",             slug: "Rx", hue: 275, group: "Library" },
  { name: "TanStack Query",    slug: "TQ", hue: 5,   group: "Library" },
  { name: "Recoil",            slug: "Rc", hue: 220, group: "Library" },
  { name: "Tailwind CSS",      slug: "Tw", hue: 188, group: "Library" },
  { name: "Sass",              slug: "Sa", hue: 330, group: "Library" },
  { name: "styled-components", slug: "Sc", hue: 320, group: "Library" },
  { name: "Jest",              slug: "Je", hue: 350, group: "Library" },
  { name: "Storybook",         slug: "Sb", hue: 335, group: "Library" },
  // 빌드
  { name: "Vite",              slug: "Vi", hue: 268, group: "Build" },
  { name: "Docker",            slug: "Dk", hue: 205, group: "Build" },
  // 도구
  { name: "GitHub",            slug: "Gh", hue: 0,   group: "Tool", mono: true },
  { name: "GitLab",            slug: "Gl", hue: 18,  group: "Tool" },
  { name: "Jira",              slug: "Ji", hue: 215, group: "Tool" },
  { name: "Figma",             slug: "Fi", hue: 290, group: "Tool" },
  { name: "Notion",            slug: "No", hue: 0,   group: "Tool", mono: true },
  { name: "Claude Code",       slug: "CC", hue: 24,  group: "Tool" },
  { name: "Cursor",            slug: "Cu", hue: 0,   group: "Tool", mono: true },
];

const TECH_GROUPS = ["Language", "Frontend", "Library", "Build", "Tool"];
const TECH_GROUPS_KO = {
  Language: "언어",
  Frontend: "프론트엔드",
  Library:  "라이브러리",
  Build:    "빌드",
  Tool:     "도구",
};

// Placeholders — the user fills these in with real projects
const PROJECTS = [
  { idx: "01", title: "프로젝트 이름", sub: "한 줄 요약", desc: "프로젝트 설명을 여기에 작성하세요. 어떤 문제를 해결했는지, 어떤 기술을 썼는지, 어떤 임팩트가 있었는지.", role: "Role · Year", stack: ["React", "TypeScript"] },
  { idx: "02", title: "프로젝트 이름", sub: "한 줄 요약", desc: "프로젝트 설명을 여기에 작성하세요.", role: "Role · Year", stack: ["Next.js", "Tailwind"] },
  { idx: "03", title: "프로젝트 이름", sub: "한 줄 요약", desc: "프로젝트 설명을 여기에 작성하세요.", role: "Role · Year", stack: ["React Native", "Zustand"] },
  { idx: "04", title: "프로젝트 이름", sub: "한 줄 요약", desc: "프로젝트 설명을 여기에 작성하세요.", role: "Role · Year", stack: ["React", "Storybook"] },
];

const CAREER = [
  { year: "현재",      company: "회사 이름",   role: "직책",          note: "한 줄 설명" },
  { year: "2022 — 24", company: "이전 회사",   role: "직책",          note: "한 줄 설명" },
  { year: "2020 — 22", company: "이전 회사",   role: "직책",          note: "한 줄 설명" },
  { year: "2019 — 20", company: "이전 회사",   role: "직책",          note: "한 줄 설명" },
];

const POSTS = [
  { title: "글 제목을 작성하세요",  date: "2025.04", read: "8 min",  tag: "Tag" },
  { title: "글 제목을 작성하세요",  date: "2025.02", read: "12 min", tag: "Tag" },
  { title: "글 제목을 작성하세요",  date: "2024.11", read: "10 min", tag: "Tag" },
  { title: "글 제목을 작성하세요",  date: "2024.08", read: "15 min", tag: "Tag" },
];

const LINKS = [
  { label: "GitHub",   href: "#", handle: "@jejinni" },
  { label: "Email",    href: "#", handle: "hello@jejinni.site" },
  { label: "LinkedIn", href: "#", handle: "/in/jejinni" },
  { label: "Velog",    href: "#", handle: "@jejinni" },
];

// Reveal hook
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.setAttribute("data-in", "1");
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useMouse() {
  const [m, setM] = React.useState({ x: 0.5, y: 0.5 });
  React.useEffect(() => {
    const fn = (e) => setM({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return m;
}

function useScrollProgress() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

Object.assign(window, {
  PROFILE, TECH, TECH_GROUPS, TECH_GROUPS_KO, PROJECTS, CAREER, POSTS, LINKS,
  useReveal, useMouse, useScrollProgress,
});
