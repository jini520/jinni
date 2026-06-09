import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ProjectRequestDto } from "@/types";
import { Page, PageHeader, ErrorBanner, Spinner, Button } from "@/components/common";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import {
  ProjectFormModal,
  projectToForm,
} from "@/components/projects/ProjectFormModal";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const detail = useProjectDetail(id);
  const [editing, setEditing] = useState(false);

  if (detail.loading) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }

  if (!detail.project) {
    return (
      <Page>
        <ErrorBanner message="프로젝트를 찾을 수 없습니다." />
        <div>
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            ← 목록으로
          </Button>
        </div>
      </Page>
    );
  }

  const project = detail.project;

  const handleSave = async (form: ProjectRequestDto) => {
    if (await detail.saveProject(form)) setEditing(false);
  };

  const handleDelete = async () => {
    if (await detail.deleteProject()) navigate("/projects");
  };

  return (
    <Page>
      <div>
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          ← 목록으로
        </Button>
      </div>

      <PageHeader title="Projects 관리" subtitle="프로젝트 상세 내용을 관리합니다" />

      <ErrorBanner message={detail.error} />

      <ProjectDetailView
        project={project}
        onEdit={() => setEditing(true)}
        onDelete={handleDelete}
      />

      <ProjectFormModal
        open={editing}
        title="프로젝트 수정"
        initial={projectToForm(project)}
        images={detail.imageHandlers}
        onSubmit={handleSave}
        onClose={() => setEditing(false)}
      />
    </Page>
  );
};

export default ProjectDetail;
