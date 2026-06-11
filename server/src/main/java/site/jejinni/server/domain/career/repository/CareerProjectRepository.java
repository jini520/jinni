package site.jejinni.server.domain.career.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.jejinni.server.domain.career.entity.CareerProject;

import java.util.List;
import java.util.UUID;

@Repository
public interface CareerProjectRepository extends JpaRepository<CareerProject, UUID> {
	List<CareerProject> findAllByOrderByOrderIndexAsc();
}

