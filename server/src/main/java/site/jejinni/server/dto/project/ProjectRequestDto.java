package site.jejinni.server.dto.project;

import lombok.Getter;
import site.jejinni.server.domain.entity.project.ProjectFeature;
import site.jejinni.server.domain.entity.project.ProjectLink;
import site.jejinni.server.domain.entity.project.ProjectStatus;

import java.time.LocalDate;
import java.util.List;

@Getter
public class ProjectRequestDto {

	private String title;
	private String description;
	private String[] skills;
	private String participants;
	private LocalDate startedAt;
	private LocalDate endedAt;
	private ProjectStatus status;
	private String company;
	private String overview;
	private String[] highlights;
	private String[] responsibilities;
	private List<ProjectFeature> features;
	private List<ProjectLink> links;
	private String[] contentImageUrls;
	private String contents;
	private Integer order;
}
