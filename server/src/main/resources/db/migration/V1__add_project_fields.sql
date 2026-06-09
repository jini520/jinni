-- V1: project 테이블 구조 변경 및 신규 필드 추가
-- 변경 내용:
--   - period(VARCHAR) → started_at(DATE) + ended_at(DATE nullable)
--   - participants(INTEGER) → participants(VARCHAR): 예) "1명", "Frontend (3명)"
--   - status 추가 (VARCHAR: IN_PROGRESS | LIVE | COMPLETED)
--   - company, overview, highlights, responsibilities, features, links 추가

-- ────────────────────────────────────────────────────────
-- 1. started_at / ended_at 추가 및 기존 period 데이터 이관
-- ────────────────────────────────────────────────────────
ALTER TABLE projects ADD COLUMN started_at DATE;
ALTER TABLE projects ADD COLUMN ended_at   DATE;

-- period 형식 예: "2025.11. -"  또는  "2024.03. - 2024.06."
-- SPLIT_PART(period, ' -', 1) = "2025.11."  →  '2025.11.01' 으로 변환
UPDATE projects
SET started_at = TO_DATE(
        SUBSTRING(TRIM(SPLIT_PART(period, ' -', 1)), 1, 7) || '.01',
        'YYYY.MM.DD'
    )
WHERE period IS NOT NULL
  AND LENGTH(TRIM(SPLIT_PART(period, ' -', 1))) >= 7;

-- ended_at: ' -' 이후 부분이 비어있으면(진행 중) NULL 유지
UPDATE projects
SET ended_at = TO_DATE(
        SUBSTRING(TRIM(SPLIT_PART(period, ' -', 2)), 1, 7) || '.01',
        'YYYY.MM.DD'
    )
WHERE period IS NOT NULL
  AND LENGTH(TRIM(SPLIT_PART(period, ' -', 2))) >= 7;

ALTER TABLE projects DROP COLUMN period;

-- ────────────────────────────────────────────────────────
-- 2. participants: INTEGER → VARCHAR(200)
--    기존 값 1 → "1명" 으로 변환
-- ────────────────────────────────────────────────────────
ALTER TABLE projects ADD COLUMN participants_new VARCHAR(200);

UPDATE projects
SET participants_new = participants::TEXT || '명'
WHERE participants IS NOT NULL;

ALTER TABLE projects DROP COLUMN participants;
ALTER TABLE projects RENAME COLUMN participants_new TO participants;

-- ────────────────────────────────────────────────────────
-- 3. 신규 필드 추가
-- ────────────────────────────────────────────────────────
ALTER TABLE projects ADD COLUMN status           VARCHAR(30);
ALTER TABLE projects ADD COLUMN company          VARCHAR(200);
ALTER TABLE projects ADD COLUMN overview         TEXT;
ALTER TABLE projects ADD COLUMN highlights       TEXT[];
ALTER TABLE projects ADD COLUMN responsibilities TEXT[];
ALTER TABLE projects ADD COLUMN features         JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN links            JSONB NOT NULL DEFAULT '[]'::jsonb;
