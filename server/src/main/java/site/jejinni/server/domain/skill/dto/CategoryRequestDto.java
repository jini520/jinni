package site.jejinni.server.domain.skill.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CategoryRequestDto {

  @NotBlank
  private String name;

  @NotBlank
  private String nameEn;

  private Integer order;
}
