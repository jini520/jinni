package site.jejinni.server.domain.project.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProjectStatus {
    IN_PROGRESS("진행 중"),
    LIVE("운영 중"),
    COMPLETED("완료");

    private final String label;
}
