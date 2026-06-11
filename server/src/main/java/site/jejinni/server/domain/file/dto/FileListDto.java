package site.jejinni.server.domain.file.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FileListDto {

  private List<FileDto> items;
  private int totalPages;
  private long totalElements;
  private int size;
  private int number;
  private boolean first;
  private boolean last;
}
