import JavaScriptIcon from "public/logos/javascript.svg";
import TypeScriptIcon from "public/logos/typescript.svg";
import JavaIcon from "public/logos/java.svg";
import ReactIcon from "public/logos/react.svg";
import NextIcon from "public/logos/next.svg";
import ZustandIcon from "public/logos/zustand.svg";
import RecoilIcon from "public/logos/recoil.svg";
import TailwindIcon from "public/logos/tailwind.svg";
import JestIcon from "public/logos/jest.svg";
import ReduxIcon from "public/logos/redux.svg";
import StorybookIcon from "public/logos/storybook.svg";
import SassIcon from "public/logos/sass.svg";
import StyledComponentsIcon from "public/logos/styled-components.svg";
import TanStackQueryIcon from "public/logos/tanstack-query.svg";
import ViteIcon from "public/logos/vite.svg";
import DockerIcon from "public/logos/docker.svg";
import FigmaIcon from "public/logos/figma.svg";
import GitHubIcon from "public/logos/github.svg";
import GitLabIcon from "public/logos/gitlab.svg";
import JiraIcon from "public/logos/jira.svg";
import NotionIcon from "public/logos/notion.svg";
import LinuxIcon from "public/logos/linux.svg";
import ElectronIcon from "public/logos/electron.svg";
import SolidityIcon from "public/logos/solidity.svg";
import SpringBootIcon from "public/logos/springboot.svg";
import PostgreSQLIcon from "public/logos/postgresql.svg";
import OracleIcon from "public/logos/oracle.svg";
import NginxIcon from "public/logos/nginx.svg";

export const iconRegistry = {
  javascript: JavaScriptIcon,
  typescript: TypeScriptIcon,
  java: JavaIcon,
  react: ReactIcon,
  reactnative: ReactIcon,
  nextjs: NextIcon,
  zustand: ZustandIcon,
  recoil: RecoilIcon,
  tailwind: TailwindIcon,
  jest: JestIcon,
  redux: ReduxIcon,
  storybook: StorybookIcon,
  sass: SassIcon,
  "styled-components": StyledComponentsIcon,
  "tanstack-query": TanStackQueryIcon,
  vite: ViteIcon,
  docker: DockerIcon,
  figma: FigmaIcon,
  github: GitHubIcon,
  gitlab: GitLabIcon,
  jira: JiraIcon,
  notion: NotionIcon,
  linux: LinuxIcon,
  electron: ElectronIcon,
  solidity: SolidityIcon,
  springboot: SpringBootIcon,
  postgresql: PostgreSQLIcon,
  oracle: OracleIcon,
  nginx: NginxIcon,
} as const;

export type IconNames = keyof typeof iconRegistry;
