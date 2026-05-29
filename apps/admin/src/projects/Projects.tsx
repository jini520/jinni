import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MDEditor from "@uiw/react-md-editor";
import { projectsApi } from "../api/projects";
import type {
  ProjectListItemDto,
  ProjectRequestDto,
  ProjectFeature,
  ProjectLink,
  ProjectStatus,
} from "../@types";
import { Button } from "@jinni/ui";
import "./Projects.css";
import "@uiw/react-md-editor/markdown-editor.css";

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "진행 중",
  LIVE: "운영 중",
  COMPLETED: "완료",
};

const STATUS_CLASS: Record<string, string> = {
  IN_PROGRESS: "in-progress",
  LIVE: "live",
  COMPLETED: "completed",
};

const formatDate = (d?: string) => (d ? d.slice(0, 7).replace("-", ".") : null);

interface SortableSkillTagProps {
  id: number;
  skill: string;
  onRemove: () => void;
}

const SortableSkillTag = ({ id, skill, onRemove }: SortableSkillTagProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className={`skill-tag-edit ${isDragging ? "dragging" : ""}`}
    >
      <span className="drag-handle-small" {...attributes} {...listeners}>
        ⋮⋮
      </span>
      {skill}
      <button type="button" className="skill-remove" onClick={onRemove}>
        ×
      </button>
    </span>
  );
};

interface SortableProjectItemProps {
  project: ProjectListItemDto;
  onClick: () => void;
}

const SortableProjectItem = ({
  project,
  onClick,
}: SortableProjectItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const start = formatDate(project.startedAt);
  const end = formatDate(project.endedAt);
  const period = start ? `${start} ~ ${end ?? ""}` : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`project-card ${isDragging ? "dragging" : ""}`}
    >
      <span className="drag-handle" {...attributes} {...listeners}>
        ⋮⋮
      </span>
      <div className="project-content" onClick={onClick}>
        <h3 className="project-title">{project.title}</h3>
        {project.description && (
          <p className="project-description">{project.description}</p>
        )}
        <div className="project-meta">
          {period && (
            <span className="project-period">📅 {period}</span>
          )}
          {project.status && (
            <span className={`status-badge ${STATUS_CLASS[project.status] ?? ""}`}>
              {STATUS_LABELS[project.status]}
            </span>
          )}
          {project.skills && project.skills.length > 0 && (
            <div className="project-skills">
              {project.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="skill-tag more">
                  +{project.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const emptyForm = (): ProjectRequestDto => ({
  title: "",
  description: "",
  skills: [],
  participants: "",
  startedAt: "",
  endedAt: "",
  status: undefined,
  company: "",
  overview: "",
  highlights: [],
  responsibilities: [],
  features: [],
  links: [],
  order: 0,
  contents: "",
});

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectRequestDto>(emptyForm());

  const [skillInput, setSkillInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [featureInput, setFeatureInput] = useState({ name: "", note: "" });
  const [linkInput, setLinkInput] = useState({ label: "", href: "" });

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const loadProjects = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.getProjectList(pageNum);
      const data = res.data.data;
      const items = data.items || [];
      const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setProjects(sorted);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = () => {
    setProjectForm({ ...emptyForm(), order: totalElements });
    setSkillInput("");
    setHighlightInput("");
    setResponsibilityInput("");
    setFeatureInput({ name: "", note: "" });
    setLinkInput({ label: "", href: "" });
    setShowModal(true);
  };

  const handleSaveProject = async () => {
    try {
      const res = await projectsApi.createProject(projectForm);
      setShowModal(false);
      navigate(`/projects/${res.data.data.id}`);
    } catch (err) {
      setError("프로젝트 생성에 실패했습니다.");
      console.error(err);
    }
  };

  // Skills
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !projectForm.skills?.includes(trimmed)) {
      setProjectForm({ ...projectForm, skills: [...(projectForm.skills || []), trimmed] });
      setSkillInput("");
    }
  };
  const removeSkill = (index: number) => {
    setProjectForm({ ...projectForm, skills: projectForm.skills?.filter((_, i) => i !== index) || [] });
  };
  const handleSkillsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const reordered = arrayMove(projectForm.skills || [], Number(active.id), Number(over.id));
    setProjectForm({ ...projectForm, skills: reordered });
  };

  // Highlights
  const addHighlight = () => {
    const trimmed = highlightInput.trim();
    if (trimmed) {
      setProjectForm({ ...projectForm, highlights: [...(projectForm.highlights || []), trimmed] });
      setHighlightInput("");
    }
  };
  const removeHighlight = (idx: number) => {
    setProjectForm({ ...projectForm, highlights: projectForm.highlights?.filter((_, i) => i !== idx) });
  };

  // Responsibilities
  const addResponsibility = () => {
    const trimmed = responsibilityInput.trim();
    if (trimmed) {
      setProjectForm({ ...projectForm, responsibilities: [...(projectForm.responsibilities || []), trimmed] });
      setResponsibilityInput("");
    }
  };
  const removeResponsibility = (idx: number) => {
    setProjectForm({ ...projectForm, responsibilities: projectForm.responsibilities?.filter((_, i) => i !== idx) });
  };

  // Features
  const addFeature = () => {
    if (featureInput.name.trim()) {
      const newFeature: ProjectFeature = {
        name: featureInput.name.trim(),
        note: featureInput.note.trim() || undefined,
      };
      setProjectForm({ ...projectForm, features: [...(projectForm.features || []), newFeature] });
      setFeatureInput({ name: "", note: "" });
    }
  };
  const removeFeature = (idx: number) => {
    setProjectForm({ ...projectForm, features: projectForm.features?.filter((_, i) => i !== idx) });
  };

  // Links
  const addLink = () => {
    if (linkInput.label.trim() && linkInput.href.trim()) {
      const newLink: ProjectLink = { label: linkInput.label.trim(), href: linkInput.href.trim() };
      setProjectForm({ ...projectForm, links: [...(projectForm.links || []), newLink] });
      setLinkInput({ label: "", href: "" });
    }
  };
  const removeLink = (idx: number) => {
    setProjectForm({ ...projectForm, links: projectForm.links?.filter((_, i) => i !== idx) });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadProjects(newPage);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((item) => item.id === active.id);
    const newIndex = projects.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(projects, oldIndex, newIndex);
    const startIdx = Math.min(oldIndex, newIndex);
    const endIdx = Math.max(oldIndex, newIndex);
    const itemsToUpdate = reordered.slice(startIdx, endIdx + 1);

    const updatePromises = itemsToUpdate.map((project, relativeIndex) => {
      const newOrder = startIdx + relativeIndex;
      const oldOrder = projects.findIndex((p) => p.id === project.id);
      if (oldOrder !== newOrder) {
        return projectsApi.updateProject(project.id, {
          title: project.title,
          startedAt: project.startedAt,
          endedAt: project.endedAt,
          status: project.status as ProjectStatus | undefined,
          order: newOrder,
        });
      }
      return Promise.resolve();
    });

    setProjects(reordered.map((p, index) => ({ ...p, order: index })));

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadProjects(page);
    }
  };

  return (
    <div className="projects-container">
      <header className="projects-header">
        <h1>Projects 관리</h1>
        <p className="subtitle">프로젝트 상세 내용을 관리합니다</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>로딩중...</p>
        </div>
      ) : (
        <div className="projects-list-view">
          <div className="section-header">
            <h2>프로젝트 목록 ({totalElements})</h2>
            <Button onClick={handleAddProject}>
              + 프로젝트 추가
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <p>등록된 프로젝트가 없습니다.</p>
              <Button onClick={handleAddProject}>
                첫 프로젝트 추가하기
              </Button>
            </div>
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={projects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="projects-grid">
                    {projects.map((project) => (
                      <SortableProjectItem
                        key={project.id}
                        project={project}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="btn-page" onClick={() => handlePageChange(0)} disabled={page === 0}>««</button>
                  <button className="btn-page" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>«</button>
                  <span className="page-info">{page + 1} / {totalPages}</span>
                  <button className="btn-page" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>»</button>
                  <button className="btn-page" onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1}>»»</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>프로젝트 추가</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }}>
                <div className="form-group">
                  <label>제목</label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="프로젝트 제목"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>설명</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="프로젝트 설명"
                    rows={2}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>시작일</label>
                    <input
                      type="date"
                      value={projectForm.startedAt || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, startedAt: e.target.value || undefined })}
                    />
                  </div>
                  <div className="form-group">
                    <label>종료일</label>
                    <input
                      type="date"
                      value={projectForm.endedAt || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, endedAt: e.target.value || undefined })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>상태</label>
                    <select
                      value={projectForm.status || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, status: (e.target.value as ProjectStatus) || undefined })}
                    >
                      <option value="">선택 안함</option>
                      <option value="IN_PROGRESS">진행 중</option>
                      <option value="LIVE">운영 중</option>
                      <option value="COMPLETED">완료</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>참여 인원</label>
                    <input
                      type="text"
                      value={projectForm.participants || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, participants: e.target.value || undefined })}
                      placeholder="예: 3명, 1인 개인 프로젝트"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>회사 / 소속</label>
                  <input
                    type="text"
                    value={projectForm.company || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, company: e.target.value || undefined })}
                    placeholder="회사 또는 소속 (선택)"
                  />
                </div>
                <div className="form-group">
                  <label>개요</label>
                  <textarea
                    value={projectForm.overview || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, overview: e.target.value || undefined })}
                    placeholder="프로젝트 개요"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>주요 성과 / 하이라이트</label>
                  <div className="skill-input-wrapper">
                    <input
                      type="text"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); }}}
                      placeholder="항목 입력 후 Enter"
                    />
                    <button type="button" className="btn-add-skill" onClick={addHighlight}>추가</button>
                  </div>
                  {(projectForm.highlights?.length ?? 0) > 0 && (
                    <ul className="array-item-list">
                      {projectForm.highlights!.map((item, idx) => (
                        <li key={idx} className="array-item">
                          <span>{item}</span>
                          <button type="button" className="skill-remove" onClick={() => removeHighlight(idx)}>×</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="form-group">
                  <label>담당 역할</label>
                  <div className="skill-input-wrapper">
                    <input
                      type="text"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addResponsibility(); }}}
                      placeholder="항목 입력 후 Enter"
                    />
                    <button type="button" className="btn-add-skill" onClick={addResponsibility}>추가</button>
                  </div>
                  {(projectForm.responsibilities?.length ?? 0) > 0 && (
                    <ul className="array-item-list">
                      {projectForm.responsibilities!.map((item, idx) => (
                        <li key={idx} className="array-item">
                          <span>{item}</span>
                          <button type="button" className="skill-remove" onClick={() => removeResponsibility(idx)}>×</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="form-group">
                  <label>주요 기능</label>
                  <div className="form-row">
                    <input
                      type="text"
                      value={featureInput.name}
                      onChange={(e) => setFeatureInput({ ...featureInput, name: e.target.value })}
                      placeholder="기능명"
                    />
                    <input
                      type="text"
                      value={featureInput.note}
                      onChange={(e) => setFeatureInput({ ...featureInput, note: e.target.value })}
                      placeholder="설명 (선택)"
                    />
                  </div>
                  <button type="button" className="btn-add-skill" style={{ marginTop: "0.5rem" }} onClick={addFeature}>기능 추가</button>
                  {(projectForm.features?.length ?? 0) > 0 && (
                    <ul className="array-item-list" style={{ marginTop: "0.5rem" }}>
                      {projectForm.features!.map((f, idx) => (
                        <li key={idx} className="array-item">
                          <span><strong>{f.name}</strong>{f.note && ` — ${f.note}`}</span>
                          <button type="button" className="skill-remove" onClick={() => removeFeature(idx)}>×</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="form-group">
                  <label>링크</label>
                  <div className="form-row">
                    <input
                      type="text"
                      value={linkInput.label}
                      onChange={(e) => setLinkInput({ ...linkInput, label: e.target.value })}
                      placeholder="링크 라벨 (예: GitHub)"
                    />
                    <input
                      type="text"
                      value={linkInput.href}
                      onChange={(e) => setLinkInput({ ...linkInput, href: e.target.value })}
                      placeholder="URL"
                    />
                  </div>
                  <button type="button" className="btn-add-skill" style={{ marginTop: "0.5rem" }} onClick={addLink}>링크 추가</button>
                  {(projectForm.links?.length ?? 0) > 0 && (
                    <ul className="array-item-list" style={{ marginTop: "0.5rem" }}>
                      {projectForm.links!.map((l, idx) => (
                        <li key={idx} className="array-item">
                          <span>{l.label} — {l.href}</span>
                          <button type="button" className="skill-remove" onClick={() => removeLink(idx)}>×</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="form-group">
                  <label>기술 스택</label>
                  <div className="skill-input-wrapper">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); }}}
                      placeholder="스킬 입력 후 Enter"
                    />
                    <button type="button" className="btn-add-skill" onClick={addSkill}>추가</button>
                  </div>
                  {projectForm.skills && projectForm.skills.length > 0 ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSkillsDragEnd}>
                      <SortableContext items={projectForm.skills.map((_, index) => index)} strategy={verticalListSortingStrategy}>
                        <div className="skill-tags-edit">
                          {projectForm.skills.map((skill, idx) => (
                            <SortableSkillTag key={idx} id={idx} skill={skill} onRemove={() => removeSkill(idx)} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="skill-tags-edit"></div>
                  )}
                </div>
                <div className="form-group">
                  <label>표시 순서</label>
                  <input
                    type="number"
                    min="0"
                    value={projectForm.order ?? 0}
                    onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>내용 (Markdown)</label>
                  <div data-color-mode="dark" className="md-editor-wrapper" style={{ color: "#fff" }}>
                    <style>{`
                      .md-editor-wrapper textarea,
                      .md-editor-wrapper .w-md-editor textarea,
                      .md-editor-wrapper .w-md-editor-text textarea,
                      .md-editor-wrapper .w-md-editor-text-textarea textarea,
                      .md-editor-wrapper textarea[class*="w-md"],
                      .md-editor-wrapper textarea[class*="editor"] {
                        color: #ffffff !important;
                        background-color: #1a1a2e !important;
                        caret-color: #ffffff !important;
                        -webkit-text-fill-color: #ffffff !important;
                      }
                      .md-editor-wrapper textarea::placeholder {
                        color: #888888 !important;
                        opacity: 1 !important;
                      }
                    `}</style>
                    <MDEditor
                      value={projectForm.contents || ""}
                      onChange={(value) => setProjectForm({ ...projectForm, contents: value || "" })}
                      preview="edit"
                      hideToolbar={false}
                      visibleDragbar={false}
                      height={400}
                    />
                  </div>
                  <p className="form-hint">Markdown 문법을 사용하여 작성할 수 있습니다. (예: # 제목, **굵게**, `코드`)</p>
                </div>
                <div className="modal-actions">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>취소</Button>
                  <Button type="submit">저장</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
