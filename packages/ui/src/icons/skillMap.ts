import type { ComponentType, SVGProps } from 'react';
import {
  JavascriptIcon, TypescriptIcon, JavaIcon, ReactIcon, NextIcon, ZustandIcon,
  ReduxIcon, TanstackQueryIcon, RecoilIcon, TailwindIcon, SassIcon,
  StyledComponentsIcon, JestIcon, StorybookIcon, ViteIcon, DockerIcon,
  GithubIcon, GitlabIcon, JiraIcon, FigmaIcon, NotionIcon, LinuxIcon,
  OracleIcon, SolidityIcon, ElectronIcon, SpringbootIcon, NginxIcon,
  PostgresqlIcon,
} from './logos';

export type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

// 키는 정규화된 형태(소문자, 구분자 제거). 일부 이름은 같은 아이콘을 가리키는 별칭.
export const SKILL_ICONS = {
  javascript: JavascriptIcon,
  typescript: TypescriptIcon,
  java: JavaIcon,
  react: ReactIcon,
  reactnative: ReactIcon,
  nextjs: NextIcon,
  next: NextIcon,
  zustand: ZustandIcon,
  redux: ReduxIcon,
  tanstackquery: TanstackQueryIcon,
  recoil: RecoilIcon,
  tailwind: TailwindIcon,
  tailwindcss: TailwindIcon,
  sass: SassIcon,
  styledcomponents: StyledComponentsIcon,
  jest: JestIcon,
  storybook: StorybookIcon,
  vite: ViteIcon,
  docker: DockerIcon,
  github: GithubIcon,
  gitlab: GitlabIcon,
  jira: JiraIcon,
  figma: FigmaIcon,
  notion: NotionIcon,
  linux: LinuxIcon,
  oracle: OracleIcon,
  solidity: SolidityIcon,
  electron: ElectronIcon,
  springboot: SpringbootIcon,
  nginx: NginxIcon,
  postgresql: PostgresqlIcon,
} satisfies Record<string, SvgIcon>;

export type SkillName = keyof typeof SKILL_ICONS;

export const getSkillIcon = (name: string): SvgIcon | undefined =>
  (SKILL_ICONS as Record<string, SvgIcon>)[name.toLowerCase().replace(/[\s\-_]/g, '')];
