package site.jejinni.server.domain.file.dto;

import lombok.Builder;
import lombok.Getter;
import site.jejinni.server.domain.file.service.FileType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class FileDto {

  private UUID id;
  private String originalFileName;
  private Long fileSize;
  private String contentType;
  private FileType fileType;
  private String downloadUrl;
  private Boolean exists;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
