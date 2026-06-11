# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

서버(Spring Boot 3.5.5 / Java 17 / Gradle) 전용 가이드. 모노레포 공통 내용(레포 구조, 프로파일 개요, 배포)은 루트 `CLAUDE.md` 참고.

## 명령어

```bash
./gradlew bootRun        # 로컬 실행 — 아래 '실행 전제' 필수
./gradlew test           # 전체 테스트
./gradlew test --tests "site.jejinni.server.ServerApplicationTests"  # 단일 테스트
./gradlew build          # 빌드(테스트 포함)
```

## 실행/테스트 전제 (중요)

**기본 프로파일에는 datasource 설정이 없다.** JPA starter가 있으므로 DB 연결 정보 없이 `bootRun`·`test`·`build`를 실행하면 `DataSourceBeanCreationException`으로 즉시 실패한다(2026-06 검증). 실행하려면 둘 중 하나:

- 로컬 PostgreSQL을 띄우고 `spring.datasource.url/username/password`를 환경변수나 `--args`로 주입.
- 추가로 `FILE_UPLOAD_DIR_*` 4개도 쓰기 가능한 경로로 지정 필요 — `FileStorageService`가 **생성자에서 디렉토리를 즉시 생성**하므로 기본값(`/app/uploads/...`)이 쓰기 불가면 기동 자체가 실패한다(macOS에서 확인).
- `prod` 프로파일 + `JASYPT_ENCRYPTOR_PASSWORD` 환경변수(설정값이 `ENC(...)`로 암호화됨). 운영 compose가 쓰는 방식.

테스트는 현재 `ServerApplicationTests.contextLoads()` 1개뿐이며, 같은 이유로 DB 없이는 실패한다. **"테스트가 깨졌다" ≠ 코드 문제일 수 있음** — datasource 미설정부터 의심할 것.

## 아키텍처 컨벤션

도메인 우선 구조(루트 CLAUDE.md 참고). 그 위의 컨벤션:

- **응답 포맷**: 성공은 `ApiResponse<T>`로 감싸 `{"data": ...}` 반환. 에러는 `ErrorResponse`(`{status, message}`).
- **예외 → HTTP 매핑** (`global/exception/GlobalExceptionHandler`): `NotFoundException`→404, `BadRequestException`→400, `IllegalStateException`→409(충돌 용도로 사용), `@Valid` 실패→400(필드별 메시지 조인). 그 외 Spring MVC 예외도 전부 `ErrorResponse` 포맷으로 통일됨. 새 엔드포인트는 이 예외들을 던지면 되고 컨트롤러에서 try-catch 불필요.
- **엔티티**: 모두 `global/entity/BaseEntity` 상속 — `created_at`/`updated_at`이 JPA Auditing(`global/config/JpaAuditingConfig`)으로 자동 관리. 새 테이블에 두 컬럼 필수.

## 도메인 특이사항

- **`resume`·`portfolio`는 컨트롤러만 가진 얇은 도메인** — 자체 service/repository/entity 없이 `domain/file/service/`(FileService·FileStorageService)를 `FileType.RESUME`/`PORTFOLIO`로 재사용. 파일 관련 변경은 `file` 도메인을 수정하면 네 타입(IMAGE/DOCUMENT/RESUME/PORTFOLIO) 모두에 적용됨. 저장 경로는 `file.upload-dir.*` 프로퍼티(prod에서 ENC, compose에서 볼륨 마운트).
- **`post`** (구 velog): DB·캐시 없이 요청마다 velog RSS를 실시간 fetch(최대 4건). 실패 시 예외가 아니라 **빈 리스트로 200 응답**(`PostService`에서 catch) — 외부 장애가 포트폴리오 페이지를 깨뜨리지 않기 위함.

## Flyway 주의

**초기 스키마가 마이그레이션에 없다.** `V1__`부터가 기존 테이블에 대한 `ALTER`이고 베이스 스키마는 `baseline-on-migrate=true`로 건너뜀 — 빈 DB를 마이그레이션만으로 재구성할 수 없다. prod는 `ddl-auto=validate`이므로 **엔티티 변경 시 반드시 새 `Vn__` 마이그레이션을 함께 작성**할 것(누락 시 기동 실패).
