package site.jejinni.server.domain.skill.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class CategoryDto {

  private UUID id;
  private String name;
  private String nameEn;
  private Integer order;
}
