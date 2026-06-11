package site.jejinni.server.domain.skill.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class SkillDto {

  private UUID id;
  private String name;
  private UUID categoryId;
  private Integer order;
}
