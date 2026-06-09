# admin CDD 전환 — skills 파일럿 설계

- 날짜: 2026-06-04
- 대상: `apps/admin` (Vite + React Router SPA)
- 범위: `skills` feature 1개를 CDD 구조로 전환 (파일럿)
- 상태: 설계 승인 대기

## 1. 배경 / 문제

admin 앱은 feature별 페이지 컴포넌트가 거대한 단일 파일에 로직·프레젠테이션·스타일을 한데 모아두고 있다.

| 파일 | 줄수 | 내용 |
|---|---|---|
| `careers/Careers.tsx` | 927 | 페이지 상태 + 탭 + 인라인 모달 2개 |
| `projects/ProjectDetail.tsx` | 813 | 상세 페이지 + 인라인 모달 |
| `projects/Projects.tsx` | 716 | 페이지 + 인라인 아이콘·카드·소터블 |
| `certifications/Certifications.tsx` | 682 | 페이지 + 탭 + 모달 2개 |
| `skills/Skills.tsx` | 631 | 페이지 + 인라인 SkillCard·Column·모달 2개 |
| `educations/Educations.tsx` | 420 | 페이지 + 인라인 모달 |

공통 조각은 `src/components/*.tsx` 평면 파일(+배럴)에 있어 `(directory)/index.ts` 규칙을 위반하고, `icons.tsx`는 이제 `@jinni/ui`에 존재하는 아이콘과 중복된다.

이 스펙은 전체 전환의 **패턴 확정용 파일럿**으로 `skills` 하나만 다룬다. 승인된 패턴을 이후 나머지 feature에 동일하게 적용한다.

## 2. 목표 / 비목표

### 목표
- `skills` feature를 컨테이너/프레젠테이션 + 커스텀 훅 구조로 분해
- 각 컴포넌트는 `(directory)/index.ts` 형태로 배치
- `@jinni/ui` 디자인 시스템 사용 유지(Button/Modal/Form 등)
- 동작을 **정확히 보존** (드래그·추가·수정·삭제·자동 포커스·검증·confirm)
- 이후 feature에 복제 가능한 패턴 확립

### 비목표 (이번 범위 아님)
- 상태관리 라이브러리 도입 (Zustand/Redux/React Query) — 별도 과제
- 아이콘 통합 (`icons.tsx` → `@jinni/ui`) — 공통 레이어 단계로 연기
- admin Storybook 도입 — `@jinni/ui`로 승격되는 조각에만 스토리(이번 파일럿에는 승격 대상 없음)
- `src/components/` 전체 폴더화 — 공통 레이어 단계
- 나머지 feature 전환 — 파일럿 승인 후

## 3. 결정 사항 (브레인스토밍 합의)

1. **조직 모델**: 하이브리드 — 기본은 기능 로컬 분해, 재사용되는 범용 조각만 추후 `@jinni/ui`(또는 admin 공통)으로 승격
2. **진행 방식**: 파일럿 1개(`skills`) 먼저 → 승인 → 나머지 확장
3. **Storybook**: 승격 조각만 스토리 (파일럿엔 승격 없음 → 스토리 없음)
4. **상태관리 라이브러리**: 도입 안 함. 커스텀 훅으로 캡슐화. React Query는 전환 완료 후 데이터 레이어 별도 트랙으로 검토
5. **파일 길이 규칙**: 소프트 목표 + 허용 밴드 (아래 §4)

## 4. 파일 길이 규칙 (소프트 목표 + 허용 밴드)

"줄 수"가 아니라 "책임이 둘 이상인가"가 1차 기준이다. 200줄은 분할 **리뷰를 트리거하는 신호**이지 절대선이 아니다. → "200을 넘으면 무조건 쪼갠다"가 아니라 **"200을 넘으면 왜 안 쪼개지는지 설명할 수 있어야 한다"**.

| 항목 | 처리 |
|---|---|
| `.tsx` / `.ts` 로직 파일 | 200줄 = 목표. 자연스러운 이음새가 없으면 ~250까지 허용. 그 이상이면 분할 필수 |
| `.module.scss` | 별도 판단(스타일은 길어질 수 있음). 컴포넌트 분리 시 자연 분할되면 충분 |
| 타입 정의 / 생성 파일 | 라인 규칙 제외 |

`skills` 파일럿은 모든 파일이 여유 있게 200 밑으로 들어가므로 이 규칙이 억지 분할을 강요하지 않는다.

## 5. 목표 구조

```
src/skills/
  index.ts                       ← export { default } from "./Skills"
  Skills.tsx                     ← 얇은 컨테이너 (~90)  페이지 + 훅 연결 + 모달
  useSkillBoard.ts               ← 데이터 로드 + items/skillMap + DnD + persist (~150)
  skills.module.scss             ← 페이지 레벨 레이아웃만 (~20)
  components/
    SkillBoard/
      SkillBoard.tsx             ← DndContext + 컬럼 + DragOverlay (~90)
      skill-board.module.scss
      index.ts
    SkillColumn/
      SkillColumn.tsx            ← (기존 Column) (~95)
      skill-column.module.scss
      index.ts
    SkillCard/
      SkillCard.tsx              ← 드래그 카드 (~75)
      skill-card.module.scss
      index.ts
    SkillFormModal/
      SkillFormModal.tsx         ← 자체 폼 상태 (~70)
      index.ts
    CategoryFormModal/
      CategoryFormModal.tsx      ← 자체 폼 상태 (~55)
      index.ts
```

- 각 컴포넌트 폴더는 `(directory)/index.ts` 규칙을 따른다.
- 라우트 **페이지**(`Skills.tsx`)는 feature 루트에 자체 `index.ts`와 함께 유지한다.
- `skills.module.scss`는 기존 섹션 주석(board / card / inline-add / add-column)을 따라 컴포넌트별 모듈로 분리한다.
- `App.tsx`의 라우트 import 경로는 `./skills/Skills` → `./skills`(배럴)로 정리하되 동작은 동일.

## 6. 단위별 책임

### `useSkillBoard.ts` (커스텀 훅 — 데이터 + DnD)
- **무엇을**: skills/categories 로딩, `skillMap`/`items`(보드) 상태, `loading`/`error`, DnD 핸들러(`findContainer`, `handleDragStart/Over/End`), 낙관적 `persist`(실패 시 재로드), 인라인 추가(`submitAdd`)
- **사용법**: `const board = useSkillBoard()` → `{ skillMap, items, categories, columns, loading, error, sensors, activeSkill, addInputs, setAddInput, dndHandlers, submitAdd, reload }`
- **의존**: `skillsApi`, `categoriesApi`, `@dnd-kit/*`
- 기존 `Skills` 내부 로직을 그대로 이전(동작 동일). DnD 좌표/센서/`itemsRef` 패턴 보존.

### `SkillBoard/` (조직 — 보드 렌더)
- **무엇을**: `DndContext` + `closestCorners` + 컬럼 매핑 + "+ 카테고리 추가" 버튼 + `DragOverlay`
- **props**: `columns`, `items`, `skillMap`, `sensors`, `activeSkill`, `addInputs`, `dndHandlers`, `onAddChange`, `onAddSubmit`, `onAddCategory`, 스킬/카테고리 편집·삭제 콜백
- **의존**: `SkillColumn`, `@dnd-kit/*`

### `SkillColumn/` (기존 `Column`)
- **무엇을**: 컬럼 헤더(이름·카운트·편집/삭제) + 드롭 영역 + `SortableContext` + 인라인 추가 입력
- **props**: 기존 `Column`과 동일 시그니처
- **의존**: `SkillCard`, `@dnd-kit/*`, 아이콘(EditIcon/CloseIcon — 기존 배럴 경로 유지)

### `SkillCard/` (원자 — 드래그 카드)
- **무엇을**: 그립 핸들 + 스킬명 + 수정/삭제 버튼, `useSortable`
- **props**: `skill`, `onEdit`, `onDelete`
- **의존**: `@dnd-kit/*`, GripIcon/EditIcon/CloseIcon(기존 배럴 경로 유지)

### `SkillFormModal/` (독립형 모달)
- **무엇을**: 스킬 수정 폼. `@jinni/ui` Modal/Form/FormField/FormActions/Button 사용. **자체 폼 상태 보유**(초기값으로 시드), 열릴 때 이름 입력 자동 포커스
- **props**: `open`, `skill`(편집 대상), `categories`(셀렉트 옵션), `onSubmit(SkillRequestDto)`, `onClose`

### `CategoryFormModal/` (독립형 모달)
- **무엇을**: 카테고리 추가/수정 폼. 자체 폼 상태, 자동 포커스
- **props**: `open`, `category`(null이면 추가), `defaultOrder`, `onSubmit(CategoryRequestDto)`, `onClose`

### `Skills.tsx` (컨테이너)
- **무엇을**: `useSkillBoard()` 호출, 모달 열림/대상 상태(`modalType`, `editingSkill`, `editingCategory`)만 보유, `Page`+`PageHeader`+`ErrorBanner`+`SkillBoard`+모달 2개 조립
- 폼 상태 churn(`skillForm`/`categoryForm`)은 모달 컴포넌트로 이전되어 사라짐

## 7. 데이터 흐름

```
useSkillBoard ──(state/handlers)──▶ Skills (컨테이너)
                                      │
                 ┌────────────────────┼─────────────────────┐
                 ▼                    ▼                     ▼
            SkillBoard          SkillFormModal        CategoryFormModal
                 │              (onSubmit→api)         (onSubmit→api)
            SkillColumn × N           │                     │
                 │                    └────── reload() ◀─────┘
            SkillCard × N
```

- 뮤테이션(추가/수정/삭제/순서변경)은 api 호출 후 `reload()`로 재동기화 — 기존 패턴 유지.
- 모달 `onSubmit`은 컨테이너에서 api 호출 + `reload()` + 모달 닫기를 수행.

## 8. 에러 처리
- 기존과 동일: api 실패 시 `error` 상태 세팅 + `console.error`, `ErrorBanner`로 표시.
- 삭제는 `confirm()` 다이얼로그 유지(스킬/카테고리 문구 동일).
- 순서변경 persist 실패 시 `reload()`로 롤백.

## 9. 검증 (테스트 없음 → 빌드 + 수동 스모크)
admin에는 테스트 인프라가 없다. 성공 기준:
1. `pnpm build:admin` 통과 (`tsc -b` 타입체크 + vite 빌드) — **변경 전후 모두**
2. `pnpm dev:admin` 수동 스모크:
   - 카드 드래그로 같은/다른 컬럼 간 순서·카테고리 변경 → 새로고침 후 유지
   - 인라인 "+ 스킬 추가"
   - 스킬 수정 모달(이름/카테고리 변경) 저장
   - 스킬 삭제(confirm)
   - 카테고리 추가/수정/삭제
   - 모달 열릴 때 이름 입력 자동 포커스
3. 모든 신규 `.tsx`/`.ts` 파일이 §4 규칙 충족(목표 200, 밴드 내)

## 10. 위험 / 주의
- **DnD 로직 이전**이 가장 민감. `itemsRef`/센서/좌표 게터/낙관적 persist를 1:1로 옮기고 동작 스모크로 확인.
- 모달 폼 상태를 컴포넌트로 옮길 때 **자동 포커스 타이밍**(open 후 setTimeout 100ms) 보존.
- scss 분리 시 클래스명 충돌 없이 컴포넌트별 모듈로 정확히 이동(미사용 클래스 잔존 금지).
- 아이콘은 이번 범위에서 **경로 변경 금지**(기존 `../components` 배럴 유지) — 다른 feature 영향 차단.
