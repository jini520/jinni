package site.jejinni.server.domain.entity.project;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import site.jejinni.server.domain.entity.BaseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "project_id", columnDefinition = "UUID")
	private UUID id;

	@Column(name = "title", nullable = false, length = 200)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@JdbcTypeCode(SqlTypes.ARRAY)
	@Column(name = "skills", columnDefinition = "text[]")
	private String[] skills;

	/** 예) "1명", "Frontend (3명), Backend (2명)" */
	@Column(name = "participants", length = 200)
	private String participants;

	@Column(name = "started_at")
	private LocalDate startedAt;

	/** null = 현재 진행 중 */
	@Column(name = "ended_at")
	private LocalDate endedAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", length = 30)
	private ProjectStatus status;

	@Column(name = "company", length = 200)
	private String company;

	@Column(name = "overview", columnDefinition = "TEXT")
	private String overview;

	@JdbcTypeCode(SqlTypes.ARRAY)
	@Column(name = "highlights", columnDefinition = "text[]")
	private String[] highlights;

	@JdbcTypeCode(SqlTypes.ARRAY)
	@Column(name = "responsibilities", columnDefinition = "text[]")
	private String[] responsibilities;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "features", columnDefinition = "jsonb")
	private List<ProjectFeature> features;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "links", columnDefinition = "jsonb")
	private List<ProjectLink> links;

	@JdbcTypeCode(SqlTypes.ARRAY)
	@Column(name = "content_image_urls", columnDefinition = "text[]")
	private String[] contentImageUrls;

	@Column(name = "contents", columnDefinition = "TEXT")
	private String contents;

	@Column(name = "order_index", nullable = false)
	private Integer order;

	@Builder
	public Project(String title, String description, String[] skills, String participants,
			LocalDate startedAt, LocalDate endedAt, ProjectStatus status,
			String company, String overview, String[] highlights, String[] responsibilities,
			List<ProjectFeature> features, List<ProjectLink> links,
			String[] contentImageUrls, String contents, Integer order) {
		this.title = title;
		this.description = description;
		this.skills = skills != null ? skills : new String[0];
		this.participants = participants;
		this.startedAt = startedAt;
		this.endedAt = endedAt;
		this.status = status;
		this.company = company;
		this.overview = overview;
		this.highlights = highlights != null ? highlights : new String[0];
		this.responsibilities = responsibilities != null ? responsibilities : new String[0];
		this.features = features != null ? features : new ArrayList<>();
		this.links = links != null ? links : new ArrayList<>();
		this.contentImageUrls = contentImageUrls != null ? contentImageUrls : new String[0];
		this.contents = contents;
		this.order = order != null ? order : 0;
	}

	public void updateTitle(String title) { this.title = title; }
	public void updateDescription(String description) { this.description = description; }
	public void updateSkills(String[] skills) { this.skills = skills != null ? skills : new String[0]; }
	public void updateParticipants(String participants) { this.participants = participants; }
	public void updateStartedAt(LocalDate startedAt) { this.startedAt = startedAt; }
	public void updateEndedAt(LocalDate endedAt) { this.endedAt = endedAt; }
	public void updateStatus(ProjectStatus status) { this.status = status; }
	public void updateCompany(String company) { this.company = company; }
	public void updateOverview(String overview) { this.overview = overview; }
	public void updateHighlights(String[] highlights) { this.highlights = highlights != null ? highlights : new String[0]; }
	public void updateResponsibilities(String[] responsibilities) { this.responsibilities = responsibilities != null ? responsibilities : new String[0]; }
	public void updateFeatures(List<ProjectFeature> features) { this.features = features != null ? features : new ArrayList<>(); }
	public void updateLinks(List<ProjectLink> links) { this.links = links != null ? links : new ArrayList<>(); }
	public void updateContentImageUrls(String[] contentImageUrls) { this.contentImageUrls = contentImageUrls != null ? contentImageUrls : new String[0]; }
	public void updateContents(String contents) { this.contents = contents; }
	public void updateOrder(Integer order) { this.order = order != null ? order : 0; }
}
