import { fetchProjectDetail } from "@/lib/portfolio";
import { ProjectModalClient } from "@/app/_components/ProjectModalClient";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { id } = await params;
  const project = await fetchProjectDetail(id);

  if (!project) return <div>Project not found</div>;

  return <ProjectModalClient project={project} />;
};

export default ProjectPage;
