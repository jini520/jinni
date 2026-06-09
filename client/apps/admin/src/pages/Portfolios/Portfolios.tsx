import { useRef } from "react";
import { portfoliosApi } from "@/api/portfolios";
import type { FileDto } from "@/types";
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
  ImageIcon,
  type UploadAreaHandle,
} from "@/components/common";
import { useFileManager } from "@/hooks/useFileManager";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatDateTime } from "@/utils/formatDateTime";

// 이미지 파일이면 ImageIcon, 그 외에는 FileTextIcon
const isImage = (file: FileDto): boolean => {
  if (file.contentType?.startsWith("image/")) return true;
  const name = file.originalFileName || "";
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex === -1 ? "" : name.slice(dotIndex).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(ext);
};

const Portfolios = () => {
  const fm = useFileManager(
    {
      list: (page) => portfoliosApi.getPortfolioList(page),
      upload: (formData) => portfoliosApi.uploadPortfolio(formData),
      remove: (id) => portfoliosApi.deletePortfolio(id),
      downloadUrl: (id) => portfoliosApi.getDownloadUrl(id),
    },
    "포트폴리오"
  );

  const uploadRef = useRef<UploadAreaHandle>(null);

  return (
    <Page>
      <PageHeader
        title="포트폴리오 관리"
        subtitle="포트폴리오 파일을 관리합니다"
      />

      <ErrorBanner message={fm.error} />

      <UploadArea
        ref={uploadRef}
        text="포트폴리오 파일을 드래그하여 여기에 놓거나 클릭하여 선택하세요"
        buttonLabel="포트폴리오 선택"
        uploading={fm.uploading}
        uploadProgress={fm.uploadProgress}
        onUpload={fm.upload}
      />

      {fm.loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar title={`포트폴리오 목록 (${fm.totalElements})`}>
            <Button
              onClick={() => uploadRef.current?.open()}
              disabled={fm.uploading}
            >
              + 포트폴리오 업로드
            </Button>
          </Toolbar>

          {fm.files.length === 0 ? (
            <EmptyState message="등록된 포트폴리오가 없습니다. 위의 업로드 영역을 사용하여 포트폴리오를 추가하세요." />
          ) : (
            <>
              <FileList>
                {fm.files.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={isImage(file) ? <ImageIcon /> : <FileTextIcon />}
                    name={fm.fileName(file)}
                    meta={[
                      file.fileSize && formatFileSize(file.fileSize),
                      file.updatedAt && formatDateTime(file.updatedAt),
                      file.contentType,
                    ]}
                    onDownload={() => fm.download(file)}
                    onDelete={() => fm.deleteFile(file)}
                    downloadDisabled={!file.exists}
                  />
                ))}
              </FileList>

              <Pagination
                page={fm.page}
                totalPages={fm.totalPages}
                onChange={fm.changePage}
              />
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default Portfolios;
