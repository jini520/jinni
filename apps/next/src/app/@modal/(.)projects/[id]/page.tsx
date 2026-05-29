import React from "react";
import ProjectDetail from "@/app/(sections)/ProjectsSection/ProjectDetail/ProjectDetail";
import ScrollLock from "@/app/_components/ScrollLock/ScrollLock";
import CloseModalButton from "@/app/_components/CloseModalButton/CloseModalButton";
import "./page.scss";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectModal = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div className="project__modal-container">
      <ScrollLock />
      <div className="project__modal-background"></div>
      <div className="project__modal">
        <CloseModalButton className="project__modal-close" />
        <div className="project__modal-content">
          <ProjectDetail id={id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
