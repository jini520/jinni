package site.jejinni.server.domain.achievement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.jejinni.server.domain.achievement.entity.Award;

import java.util.List;
import java.util.UUID;

@Repository
public interface AwardRepository extends JpaRepository<Award, UUID> {
	List<Award> findAllByOrderByOrderIndexAsc();
}

