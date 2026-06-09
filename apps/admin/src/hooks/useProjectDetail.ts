import { useState, useEffect } from "react";
import { projectsApi } from "@/api/projects";
import axiosInstance from "@/api/axios-instance";
import type { ProjectDetailDto, ProjectRequestDto } from "@/types";

export const useProjectDetail = (id: string | undefined) => {
  const [project, setProject] = useState<ProjectDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [copiedUrlIndex, setCopiedUrlIndex] = useState<number | null>(null);

  const loadProjectDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.getProjectDetail(id);
      setProject(res.data.data);
    } catch (err) {
      setError("프로젝트 상세를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveProject = async (form: ProjectRequestDto): Promise<boolean> => {
    if (!project) return false;
    try {
      await projectsApi.updateProject(project.id, form);
      await loadProjectDetail();
      return true;
    } catch (err) {
      setError("프로젝트 저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteProject = async (): Promise<boolean> => {
    if (!project) return false;
    if (
      !confirm(
        `"${project.title}" 프로젝트를 삭제하시겠습니까?\n삭제된 프로젝트와 관련 이미지는 복구할 수 없습니다.`
      )
    )
      return false;
    setError(null);
    try {
      await projectsApi.deleteProject(project.id);
      return true;
    } catch (err) {
      setError("프로젝트 삭제에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const getFullImageUrl = (url: string): string => {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = axiosInstance.defaults.baseURL || "";
    return base.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
  };

  const getFileIdFromImageUrl = (url: string): string | null => {
    if (!url) return null;
    const parts = url.split("/");
    const imagesIndex = parts.indexOf("images");
    if (imagesIndex === -1 || imagesIndex === parts.length - 1) return null;
    return parts[imagesIndex + 1] || null;
  };

  const uploadImage = async (file: File): Promise<string[] | null> => {
    if (!project?.id) return null;
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return null;
    }
    setImageUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await projectsApi.uploadProjectImage(project.id, formData);
      setProject(res.data.data);
      return res.data.data.contentImageUrls || [];
    } catch (err) {
      setError("이미지 업로드에 실패했습니다.");
      console.error(err);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = async (url: string): Promise<string[] | null> => {
    const fileId = getFileIdFromImageUrl(url);
    if (!project?.id || !fileId) {
      setError("이미지 정보를 확인할 수 없습니다.");
      return null;
    }
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return null;
    setError(null);
    try {
      const res = await projectsApi.deleteProjectImage(project.id, fileId);
      setProject(res.data.data);
      return res.data.data.contentImageUrls || [];
    } catch (err) {
      setError("이미지 삭제에 실패했습니다.");
      console.error(err);
      return null;
    }
  };

  const copyImageUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(getFullImageUrl(url));
      setCopiedUrlIndex(index);
      setTimeout(() => setCopiedUrlIndex(null), 1500);
    } catch {
      setError("URL 복사에 실패했습니다.");
    }
  };

  return {
    project,
    loading,
    error,
    reload: loadProjectDetail,
    saveProject,
    deleteProject,
    imageHandlers: {
      uploading: imageUploading,
      copiedIndex: copiedUrlIndex,
      fullUrl: getFullImageUrl,
      upload: uploadImage,
      remove: removeImage,
      copy: copyImageUrl,
    },
  };
};
