package site.jejinni.server.dto.project;

import lombok.Builder;
import lombok.Getter;
import site.jejinni.server.domain.entity.project.ProjectStatus;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class ProjectListItemDto {

	private UUID id;
	private String title;
	private String description;
	private String[] skills;
	private LocalDate startedAt;
	private LocalDate endedAt;
	private ProjectStatus status;
	private Integer order;
}
