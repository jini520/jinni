package site.jejinni.server.domain.career.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.jejinni.server.domain.career.entity.Business;

import java.util.List;
import java.util.UUID;

@Repository
public interface BusinessRepository extends JpaRepository<Business, UUID> {
	List<Business> findAllByOrderByOrderIndexAsc();
}

