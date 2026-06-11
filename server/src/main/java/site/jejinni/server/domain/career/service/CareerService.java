package site.jejinni.server.domain.career.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import site.jejinni.server.global.exception.NotFoundException;
import org.springframework.transaction.annotation.Transactional;
import site.jejinni.server.domain.career.entity.Business;
import site.jejinni.server.domain.career.entity.CareerProject;
import site.jejinni.server.domain.career.dto.*;
import site.jejinni.server.global.response.ApiResponse;
import site.jejinni.server.domain.career.repository.BusinessRepository;
import site.jejinni.server.domain.career.repository.CareerProjectRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CareerService {

	private final BusinessRepository businessRepository;
	private final CareerProjectRepository careerProjectRepository;

	// ===== 전체 조회 =====
	public ApiResponse<CareersDto> getAllCareers() {
		List<BusinessDto> businesses = businessRepository.findAllByOrderByOrderIndexAsc()
				.stream()
				.map(BusinessDto::from)
				.collect(Collectors.toList());

		List<CareerProjectDto> projects = careerProjectRepository.findAllByOrderByOrderIndexAsc()
				.stream()
				.map(CareerProjectDto::from)
				.collect(Collectors.toList());

		CareersDto careersDto = CareersDto.builder()
				.businesses(businesses)
				.projects(projects)
				.build();

		return new ApiResponse<>(careersDto);
	}

	// ===== Business CRUD =====
	@Transactional
	public ApiResponse<BusinessDto> createBusiness(BusinessRequestDto dto) {
		Business business = Business.builder()
				.startDate(dto.getStartDate())
				.endDate(dto.getEndDate())
				.company(dto.getCompany())
				.department(dto.getDepartment())
				.position(dto.getPosition())
				.skills(dto.getSkills())
				.orderIndex(dto.getOrderIndex())
				.details(dto.getDetails())
				.build();

		Business saved = businessRepository.save(business);
		return new ApiResponse<>(BusinessDto.from(saved));
	}

	public ApiResponse<BusinessDto> getBusinessById(UUID id) {
		Business business = businessRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Business not found: " + id));
		return new ApiResponse<>(BusinessDto.from(business));
	}

	@Transactional
	public ApiResponse<BusinessDto> updateBusiness(UUID id, BusinessRequestDto dto) {
		Business business = businessRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Business not found: " + id));

		business.updateDates(dto.getStartDate(), dto.getEndDate());
		business.updateCompanyInfo(dto.getCompany(), dto.getDepartment(), dto.getPosition());
		business.updateSkills(dto.getSkills());
		business.updateOrderIndex(dto.getOrderIndex());
		business.updateDetails(dto.getDetails());

		return new ApiResponse<>(BusinessDto.from(business));
	}

	@Transactional
	public void deleteBusiness(UUID id) {
		businessRepository.deleteById(id);
	}

	// ===== Career Project CRUD =====
	@Transactional
	public ApiResponse<CareerProjectDto> createCareerProject(CareerProjectRequestDto dto) {
		CareerProject project = CareerProject.builder()
				.startDate(dto.getStartDate())
				.endDate(dto.getEndDate())
				.company(dto.getCompany())
				.department(dto.getDepartment())
				.position(dto.getPosition())
				.skills(dto.getSkills())
				.orderIndex(dto.getOrderIndex())
				.build();

		CareerProject saved = careerProjectRepository.save(project);
		return new ApiResponse<>(CareerProjectDto.from(saved));
	}

	public ApiResponse<CareerProjectDto> getCareerProjectById(UUID id) {
		CareerProject project = careerProjectRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Career project not found: " + id));
		return new ApiResponse<>(CareerProjectDto.from(project));
	}

	@Transactional
	public ApiResponse<CareerProjectDto> updateCareerProject(UUID id, CareerProjectRequestDto dto) {
		CareerProject project = careerProjectRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Career project not found: " + id));

		project.updateDates(dto.getStartDate(), dto.getEndDate());
		project.updateCompanyInfo(dto.getCompany(), dto.getDepartment(), dto.getPosition());
		project.updateSkills(dto.getSkills());
		project.updateOrderIndex(dto.getOrderIndex());

		return new ApiResponse<>(CareerProjectDto.from(project));
	}

	@Transactional
	public void deleteCareerProject(UUID id) {
		careerProjectRepository.deleteById(id);
	}
}

