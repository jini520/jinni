import { useState, useEffect } from "react";
import type { ApiResponse, FileDto, FileListDto } from "@/types";

// 파일 관리(업로드·목록·페이지네이션·다운로드·삭제) 공통 로직.
// API 어댑터와 라벨(이력서/포트폴리오)만 주입받아 상태와 핸들러를 제공한다.
interface FileManagerApi {
  list: (page: number) => Promise<{ data: ApiResponse<FileListDto> }>;
  upload: (formData: FormData) => Promise<{ data: ApiResponse<FileDto> }>;
  remove: (id: string) => Promise<unknown>;
  downloadUrl: (id: string) => string;
}

export const useFileManager = (api: FileManagerApi, label: string) => {
  const [files, setFiles] = useState<FileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadFiles = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = (await api.list(pageNum)).data.data;
      setFiles(data.items || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError(`${label} 목록을 불러오는데 실패했습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(0);
    // 마운트 시 1회만 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileName = (file: FileDto): string => file.originalFileName || label;

  const upload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", fileList[0]);
      const response = await api.upload(formData);
      if (response.data.data) {
        await loadFiles(page);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || `${label} 업로드에 실패했습니다.`;
      setError(message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (file: FileDto) => {
    if (!confirm(`정말 "${fileName(file)}" ${label}를 삭제하시겠습니까?`)) return;
    if (!file.id) {
      setError("파일 정보가 올바르지 않습니다.");
      return;
    }
    try {
      await api.remove(file.id);
      await loadFiles(page);
    } catch (err) {
      setError(`${label} 삭제에 실패했습니다.`);
      console.error(err);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) loadFiles(newPage);
  };

  const download = (file: FileDto) => {
    if (!file.id) {
      setError("파일 정보가 올바르지 않습니다.");
      return;
    }
    window.open(api.downloadUrl(file.id), "_blank");
  };

  return {
    files,
    loading,
    error,
    uploading,
    uploadProgress,
    page,
    totalPages,
    totalElements,
    fileName,
    upload,
    deleteFile,
    changePage,
    download,
  };
};
