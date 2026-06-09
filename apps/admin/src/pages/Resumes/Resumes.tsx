import { useRef } from "react";
import { resumesApi } from "@/api/resumes";
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
} from "@/components/common";
import { useFileManager } from "@/hooks/useFileManager";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatDateTime } from "@/utils/formatDateTime";
import styles from "./resumes.module.scss";

const Resumes = () => {
  const fm = useFileManager(
    {
      list: (page) => resumesApi.getResumeList(page),
      upload: (formData) => resumesApi.uploadResume(formData),
      remove: (id) => resumesApi.deleteResume(id),
      downloadUrl: (id) => resumesApi.getDownloadUrl(id),
    },
    "이력서"
  );

  const uploadRef = useRef<UploadAreaHandle>(null);

  const downloadLatest = () =>
    window.open(resumesApi.getLatestDownloadUrl(), "_blank");

  return (
    <Page>
      <PageHeader title="이력서 관리" subtitle="이력서 파일을 관리합니다" />

      <ErrorBanner message={fm.error} />

      <UploadArea
        ref={uploadRef}
        text="이력서 파일을 드래그하여 여기에 놓거나 클릭하여 선택하세요"
        buttonLabel="이력서 선택"
        uploading={fm.uploading}
        uploadProgress={fm.uploadProgress}
        onUpload={fm.upload}
      />

      {fm.loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar title={`이력서 목록 (${fm.totalElements})`}>
            <div className={styles.headerActions}>
              {fm.totalElements > 0 && (
                <Button variant="outline" onClick={downloadLatest}>
                  <DownloadIcon />
                  최신 이력서 다운로드
                </Button>
              )}
              <Button
                onClick={() => uploadRef.current?.open()}
                disabled={fm.uploading}
              >
                + 이력서 업로드
              </Button>
            </div>
          </Toolbar>

          {fm.files.length === 0 ? (
            <EmptyState message="등록된 이력서가 없습니다. 위의 업로드 영역을 사용하여 이력서를 추가하세요." />
          ) : (
            <>
              <FileList>
                {fm.files.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={<FileTextIcon />}
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

export default Resumes;
