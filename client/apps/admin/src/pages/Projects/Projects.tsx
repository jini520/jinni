import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProjectRequestDto } from "@/types";
import {
  Page,
  PageHeader,
  Toolbar,
  ErrorBanner,
  Spinner,
  EmptyState,
  Pagination,
  Button,
} from "@/components/common";
import { useProjects } from "@/hooks/useProjects";
import { ProjectList } from "@/components/projects/ProjectList";
import {
  ProjectFormModal,
  emptyProjectForm,
} from "@/components/projects/ProjectFormModal";

const Projects = () => {
  const navigate = useNavigate();
  const projects = useProjects();
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (form: ProjectRequestDto) => {
    const id = await projects.createProject(form);
    if (id) {
      setShowModal(false);
      navigate(`/projects/${id}`);
    }
  };

  return (
    <Page>
      <PageHeader title="Projects 관리" subtitle="프로젝트 상세 내용을 관리합니다" />

      <ErrorBanner message={projects.error} />

      {projects.loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar title={`프로젝트 목록 (${projects.totalElements})`}>
            <Button onClick={() => setShowModal(true)}>+ 프로젝트 추가</Button>
          </Toolbar>

          {projects.projects.length === 0 ? (
            <EmptyState
              message="등록된 프로젝트가 없습니다."
              action={
                <Button onClick={() => setShowModal(true)}>
                  첫 프로젝트 추가하기
                </Button>
              }
            />
          ) : (
            <>
              <ProjectList
                projects={projects.projects}
                sensors={projects.sensors}
                activeId={projects.activeId}
                onOpen={(id) => navigate(`/projects/${id}`)}
                onDragStart={projects.handleDragStart}
                onDragEnd={projects.handleDragEnd}
              />
              <Pagination
                page={projects.page}
                totalPages={projects.totalPages}
                onChange={projects.handlePageChange}
              />
            </>
          )}
        </>
      )}

      <ProjectFormModal
        open={showModal}
        title="프로젝트 추가"
        initial={{ ...emptyProjectForm(), order: projects.totalElements }}
        onSubmit={handleCreate}
        onClose={() => setShowModal(false)}
      />
    </Page>
  );
};

export default Projects;
