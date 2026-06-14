import type { Metadata } from "next";
import { fetchProjectDetail } from "@/lib/portfolio";
import { ProjectModalClient } from "@/app/_components/ProjectModalClient";

interface Props {
  params: Promise<{ id: string }>;
}

// 프로젝트별 메타데이터 — 서버에서 생성. 제목은 layout의 template로 "제목 | 제진명"이 된다.
// og:image는 같은 폴더의 opengraph-image.tsx가 자동 주입.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProjectDetail(id);

  if (!project) return { title: "프로젝트를 찾을 수 없습니다" };

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${id}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      url: `/projects/${id}`,
    },
  };
}

const ProjectPage = async ({ params }: Props) => {
  const { id } = await params;
  const project = await fetchProjectDetail(id);

  if (!project) return <div>Project not found</div>;

  return <ProjectModalClient project={project} />;
};

export default ProjectPage;
