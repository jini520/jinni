package site.jejinni.server.dto.project;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProjectListDto {

	private List<ProjectListItemDto> items;
	private int totalPages;
	private long totalElements;
	private int size;
	private int number;
	private boolean first;
	private boolean last;
}

