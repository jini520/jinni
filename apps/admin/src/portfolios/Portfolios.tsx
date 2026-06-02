import { useState, useEffect, useRef } from "react";
import { portfoliosApi } from "../api/portfolios";
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
  type UploadAreaHandle,
} from "../components";

const Portfolios = () => {
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
      const res = await portfoliosApi.getPortfolioList(pageNum);
      const data = res.data.data;
      setFiles(data.items || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError("포트폴리오 목록을 불러오는데 실패했습니다.");
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
    return file.originalFileName || "포트폴리오";
  };

  // 파일명에서 확장자 추출
  const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) return "";
    return fileName.substring(lastDotIndex).toLowerCase();
  };

  // 파일 타입 아이콘
  const getFileIcon = (file: FileDto): string => {
    if (file.contentType) {
      if (file.contentType.startsWith("image/")) return "🖼️";
      if (file.contentType.includes("pdf")) return "📄";
      if (file.contentType.includes("word") || file.contentType.includes("document")) return "📝";
    }
    if (file.originalFileName) {
      const ext = getFileExtension(file.originalFileName);
      if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(ext)) return "🖼️";
      if (ext === ".pdf") return "📄";
      if ([".doc", ".docx"].includes(ext)) return "📝";
    }
    return "📁";
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

      const res = await portfoliosApi.uploadPortfolio(formData);

      if (res.data.data) {
        await loadFiles(page);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "포트폴리오 업로드에 실패했습니다.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 파일 삭제
  const handleDeleteFile = async (file: FileDto) => {
    const fileName = getFileName(file);
    if (!confirm(`정말 "${fileName}" 포트폴리오를 삭제하시겠습니까?`)) return;

    if (!file.id) {
      setError("파일 정보가 올바르지 않습니다.");
      return;
    }

    try {
      await portfoliosApi.deletePortfolio(file.id);
      await loadFiles(page);
    } catch (err) {
      setError("포트폴리오 삭제에 실패했습니다.");
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

    const downloadUrl = portfoliosApi.getDownloadUrl(file.id);
    window.open(downloadUrl, "_blank");
  };

  return (
    <Page>
      <PageHeader title="포트폴리오 관리" subtitle="포트폴리오 파일을 관리합니다" />

      <ErrorBanner message={error} />

      <UploadArea
        ref={uploadRef}
        icon="📁"
        text="포트폴리오 파일을 드래그하여 여기에 놓거나 클릭하여 선택하세요"
        buttonLabel="포트폴리오 선택"
        uploading={uploading}
        uploadProgress={uploadProgress}
        onUpload={handleFileUpload}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar title={`포트폴리오 목록 (${totalElements})`}>
            <Button onClick={() => uploadRef.current?.open()} disabled={uploading}>
              + 포트폴리오 업로드
            </Button>
          </Toolbar>

          {files.length === 0 ? (
            <EmptyState message="등록된 포트폴리오가 없습니다. 위의 업로드 영역을 사용하여 포트폴리오를 추가하세요." />
          ) : (
            <>
              <FileList>
                {files.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={getFileIcon(file)}
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

export default Portfolios;
