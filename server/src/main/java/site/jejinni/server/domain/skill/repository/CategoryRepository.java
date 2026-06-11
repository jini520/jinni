package site.jejinni.server.domain.skill.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import site.jejinni.server.domain.skill.entity.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

	List<Category> findAllByOrderByOrderAsc();
}

