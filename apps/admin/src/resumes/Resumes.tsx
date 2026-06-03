import { useState, useEffect, useRef } from "react";
import { resumesApi } from "../api/resumes";
import type { FileDto } from "../@types";
import {
  Page,
  PageHeader,
  Toolbar,
  ErrorBanner,
  Spinner,
  EmptyState,
  UploadArea,
  FileRow,
  FileList,
  Pagination,
  Button,
  FileTextIcon,
  DownloadIcon,
  type UploadAreaHandle,
} from "../components";
import styles from "./resumes.module.scss";

const Resumes = () => {
  const [files, setFiles] = useState<FileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const uploadRef = useRef<UploadAreaHandle>(null);

  // 파일 목록 로드
  const loadFiles = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resumesApi.getResumeList(pageNum);
      const data = res.data.data;
      setFiles(data.items || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError("이력서 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(0);
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // 날짜 포맷팅
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 파일명 가져오기
  const getFileName = (file: FileDto): string => {
    return file.originalFileName || "이력서";
  };

  // 파일 업로드
  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await resumesApi.uploadResume(formData);

      if (res.data.data) {
        await loadFiles(page);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "이력서 업로드에 실패했습니다.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 파일 삭제
  const handleDeleteFile = async (file: FileDto) => {
    const fileName = getFileName(file);
    if (!confirm(`정말 "${fileName}" 이력서를 삭제하시겠습니까?`)) return;

    if (!file.id) {
      setError("파일 정보가 올바르지 않습니다.");
      return;
    }

    try {
      await resumesApi.deleteResume(file.id);
      await loadFiles(page);
    } catch (err) {
      setError("이력서 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadFiles(newPage);
    }
  };

  // 파일 다운로드
  const handleDownload = (file: FileDto) => {
    if (!file.id) {
      setError("파일 정보가 올바르지 않습니다.");
      return;
    }

    const downloadUrl = resumesApi.getDownloadUrl(file.id);
    window.open(downloadUrl, "_blank");
  };

  // 최신 이력서 다운로드
  const handleDownloadLatest = () => {
    const downloadUrl = resumesApi.getLatestDownloadUrl();
    window.open(downloadUrl, "_blank");
  };

  return (
    <Page>
      <PageHeader title="이력서 관리" subtitle="이력서 파일을 관리합니다" />

      <ErrorBanner message={error} />

      <UploadArea
        ref={uploadRef}
        text="이력서 파일을 드래그하여 여기에 놓거나 클릭하여 선택하세요"
        buttonLabel="이력서 선택"
        uploading={uploading}
        uploadProgress={uploadProgress}
        onUpload={handleFileUpload}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar title={`이력서 목록 (${totalElements})`}>
            <div className={styles.headerActions}>
              {totalElements > 0 && (
                <Button variant="outline" onClick={handleDownloadLatest}>
                  <DownloadIcon />
                  최신 이력서 다운로드
                </Button>
              )}
              <Button onClick={() => uploadRef.current?.open()} disabled={uploading}>
                + 이력서 업로드
              </Button>
            </div>
          </Toolbar>

          {files.length === 0 ? (
            <EmptyState message="등록된 이력서가 없습니다. 위의 업로드 영역을 사용하여 이력서를 추가하세요." />
          ) : (
            <>
              <FileList>
                {files.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={<FileTextIcon />}
                    name={getFileName(file)}
                    meta={[
                      file.fileSize && formatFileSize(file.fileSize),
                      file.updatedAt && formatDate(file.updatedAt),
                      file.contentType,
                    ]}
                    onDownload={() => handleDownload(file)}
                    onDelete={() => handleDeleteFile(file)}
                    downloadDisabled={!file.exists}
                  />
                ))}
              </FileList>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default Resumes;
