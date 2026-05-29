import React from "react";
import ProjectDetail from "@/app/(sections)/ProjectsSection/ProjectDetail/ProjectDetail";
import BackButton from "@/app/_components/BackButton/BackButton";
import "./page.scss";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div className="project__page-container">
      <ProjectDetail id={id} />
      <div className="flex items-center justify-center mt-12">
        <BackButton>홈으로 돌아가기</BackButton>
      </div>
    </div>
  );
};

export default ProjectPage;
