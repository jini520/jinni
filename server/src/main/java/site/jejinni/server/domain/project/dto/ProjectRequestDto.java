package site.jejinni.server.domain.project.dto;

import lombok.Getter;
import site.jejinni.server.domain.project.entity.ProjectFeature;
import site.jejinni.server.domain.project.entity.ProjectLink;
import site.jejinni.server.domain.project.entity.ProjectStatus;

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
