package site.jejinni.server.controller.project;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import site.jejinni.server.dto.common.ApiResponse;
import site.jejinni.server.dto.project.ProjectDetailDto;
import site.jejinni.server.dto.project.ProjectListDto;
import site.jejinni.server.dto.project.ProjectRequestDto;
import site.jejinni.server.service.project.ProjectService;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

	private final ProjectService projectService;

	@GetMapping
	public ResponseEntity<ApiResponse<ProjectListDto>> getProjectList(
			@PageableDefault(size = 10, sort = "order") Pageable pageable) {
		ApiResponse<ProjectListDto> projects = projectService.getProjectList(pageable);
		return ResponseEntity.ok(projects);
	}

	@PostMapping
	public ResponseEntity<ApiResponse<ProjectDetailDto>> createProject(
			@RequestBody ProjectRequestDto request) {
		ApiResponse<ProjectDetailDto> project = projectService.createProject(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(project);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProjectDetailDto>> getProjectDetail(@PathVariable UUID id) {
		ApiResponse<ProjectDetailDto> project = projectService.getProjectDetail(id);
		return ResponseEntity.ok(project);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<ProjectDetailDto>> updateProject(
			@PathVariable UUID id,
			@RequestBody ProjectRequestDto request) {
		ApiResponse<ProjectDetailDto> project = projectService.updateProject(id, request);
		return ResponseEntity.ok(project);
	}
}
