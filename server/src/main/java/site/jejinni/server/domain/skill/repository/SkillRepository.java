package site.jejinni.server.domain.skill.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import site.jejinni.server.domain.skill.entity.Category;
import site.jejinni.server.domain.skill.entity.Skill;

import java.util.List;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

	List<Skill> findByCategoryOrderByOrderAsc(Category category);

	List<Skill> findAllByOrderByOrderAsc();

	boolean existsByCategory(Category category);
}

