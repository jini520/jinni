package site.jejinni.server.domain.project.dto;

import lombok.Builder;
import lombok.Getter;
import site.jejinni.server.domain.project.entity.ProjectStatus;

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
