package site.jejinni.server.domain.skill.dto;

import lombok.Getter;

import java.util.UUID;

@Getter
public class SkillRequestDto {

	private String name;
	private UUID categoryId;
	private Integer order;
}

