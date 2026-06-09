# admin CDD careers 전환 Implementation Plan

**Goal:** admin `careers` feature(단일 927줄 `Careers.tsx`)를 skills 파일럿에서 확립한 CDD 패턴으로 분해. 동작 보존.

**Architecture:** 컨테이너 + `useCareers` 훅 + 컴포넌트 폴더(`(directory)/index.ts`). 두 엔티티(업무경력 `Business` / 프로젝트경력 `CareerProject`)가 거의 동일 구조라 제네릭 `CareerList<T>`·`CareerCard`·`SkillTagsInput`·`CareerFields`로 공통화(DRY). 모달은 자체 폼 상태 보유. 변수명 의미화, SCSS 컴포넌트별 분리.

**Tech Stack:** React 19, TS, Vite, @dnd-kit, CSS Modules. 검증: `tsc -b` + `pnpm build:admin` + 읽기전용 브라우저 스모크.

## 구현 방식
skills 파일럿이 검증된 패턴이므로 컨트롤러가 직접 단위별 커밋으로 구현. Careers 모놀리스는 인라인 하위 컴포넌트가 없는 단일 컴포넌트라, **신규 파일을 모두 먼저 추가(각 커밋 tsc green)한 뒤 마지막에 컨테이너를 한 번에 교체**한다.

## 목표 구조
```
src/careers/
  index.ts                      ← export { default } from "./Careers"
  Careers.tsx                   ← 컨테이너: 탭 + CareerList×2 + 모달×2 (~110)
  useCareers.ts                 ← 데이터 + business/project CRUD + 순서변경 영속 (~190)
  careerForm.ts                 ← formatPeriod, formatDateInput (순수) (~30)
  components/
    CareerCard/                 ← SortableCard + MetaRow + details? + 스킬칩 (~90)
    CareerList/                 ← Toolbar + EmptyState + DnD 리스트, CareerDto 제네릭 (~85)
    CareerFields/               ← 회사/부서/시작·종료일/직책, company는 forwardRef (~85)
    SkillTagsInput/             ← 정렬가능 스킬 태그 + 입력, 자체 상태 (~95)
    DetailsInput/               ← 업무내용 리스트 + 입력, 자체 상태 (~70)
    BusinessFormModal/          ← CareerFields + SkillTagsInput + DetailsInput (~95)
    CareerProjectFormModal/     ← CareerFields + SkillTagsInput (~75)
```

## 단위별 책임 / 인터페이스

### careerForm.ts
- `formatPeriod(startDate?, endDate?): string` — `"-"` 또는 `"{start} ~ {end|현재}"`.
- `formatDateInput(value: string, maxLength=6): string` — 숫자만 추출해 `YY.MM.` 자동 포맷.

### CareerCard/
- props: `{ title, startDate?, endDate?, department?, position?, skills?, details?, onEdit, onDelete }` (프레젠테이션, DTO 비의존).
- SortableCard(id는 부모가) → 부모에서 `id`도 받아야 함. props에 `id: string` 포함.
- MetaRow(기간/부서/직책) + details(있으면 `업무 내용` ul) + 스킬칩.

### CareerList/ (제네릭 `<T extends CareerDto>`)
- props: `{ items: T[], sensors, onAdd, onEdit: (item: T)=>void, onDelete: (id)=>void, onDragEnd, toolbarTitle, emptyMessage, addLabel }`.
- Toolbar + (빈 목록 → EmptyState) / (DndContext+SortableContext+CareerCard 매핑). `details`는 `(item as BusinessDto).details`로 전달하되, CareerDto엔 없으므로 `item.details`가 타입상 없음 → CareerCard에 details는 옵셔널, CareerList는 `details={(item as { details?: string[] }).details}`로 전달.

### SkillTagsInput/ (자체 상태)
- props: `{ skills: string[], onChange: (next: string[]) => void }`.
- 내부 `input` 상태 + 자체 sensors. 추가(Enter/버튼)·삭제·DnD 재정렬(SortableTag) 캡슐화. 원본 `renderSkillTags`+`handleAddSkill`/`handleRemoveSkill`/`handleSkillsDragEnd` 이전.

### DetailsInput/ (자체 상태, 업무경력 전용)
- props: `{ details: string[], onChange: (next: string[]) => void }`.
- 내부 `input` 상태 + 추가(Enter/버튼)·삭제. DnD 없음. 원본 details 위젯+`handleAddDetail`/`handleRemoveDetail` 이전.

### CareerFields/ (forwardRef<HTMLInputElement>)
- props: `{ company, department?, startDate, endDate?, position?, onChange: (patch) => void }`, ref는 회사 input.
- FormRow(회사[ref]+부서) / FormRow(시작일+종료일, formatDateInput 적용) / FormField(직책).

### BusinessFormModal/ (자체 폼 상태)
- props: `{ open, business: BusinessDto|null, defaultOrderIndex: number, onSubmit: (data: BusinessRequestDto)=>void, onClose }`.
- `useState<BusinessRequestDto>` 시드(open&&business edit, 아니면 빈 폼+orderIndex=defaultOrderIndex), open 시 회사 input 자동포커스. CareerFields + SkillTagsInput(skills) + DetailsInput(details). 저장 시 `onSubmit(form)`.

### CareerProjectFormModal/ (자체 폼 상태)
- props: `{ open, project: CareerProjectDto|null, defaultOrderIndex, onSubmit: (data: CareerProjectRequestDto)=>void, onClose }`.
- BusinessFormModal과 동일 패턴, details 없음.

### useCareers.ts (훅)
- 상태: businessList, projectList, loading, error, sensors.
- `loadData`: `careersApi.getAllCareers()` → businesses/projects orderIndex 정렬.
- `reorder<T extends CareerDto>(list, setList, event, update)`: 원본 두 DragEnd 핸들러의 "범위 내 재정렬 + 변경분만 PATCH + 낙관적 setList + 실패 시 reload" 로직을 제네릭 1개로 통합. `update(item, newOrderIndex)` 콜백으로 엔티티별 API 호출.
- `onBusinessDragEnd`/`onProjectDragEnd`: reorder 래퍼.
- `saveBusiness(editing, data): Promise<boolean>`, `deleteBusiness(id)`, `saveProject(editing, data): Promise<boolean>`, `deleteProject(id)` — 성공 boolean/낙관적 reload, 원본 메시지 유지.
- 반환: 리스트들, loading, error, sensors, onBusinessDragEnd, onProjectDragEnd, save/delete×4, reload.

### Careers.tsx (컨테이너)
- `useCareers()` + 탭 상태(activeTab) + 모달 상태(modalType, editingBusiness, editingProject) + open/close.
- 렌더: Page/PageHeader/ErrorBanner/Tabs → 탭별 `<CareerList>` → `<BusinessFormModal>`/`<CareerProjectFormModal>`.
- `handleSaveBusiness`/`handleSaveProject`: `if (await save(...)) closeModal()`.

## SCSS 분리
`careers.module.scss` 클래스 이동: `.list`→CareerList; `.skills/.skillTag/.details`→CareerCard; `.tagInput/.tagsDisplay/.tagInputRow`→SkillTagsInput; `.detailsDisplay/.detailItem/.detailRemove`(+`.tagInput/.tagInputRow`)→DetailsInput. 마지막에 `careers.module.scss` 삭제.

## 검증
1. 각 신규 파일 추가 커밋 후 `tsc -b` green.
2. 컨테이너 교체 후 `tsc -b` + `pnpm build:admin`.
3. 모든 `.tsx`/`.ts` 200줄 미만(useCareers만 밴드 내 허용).
4. 읽기전용 브라우저 스모크: 두 탭 렌더, 카드 메타/스킬/details, 두 모달 열림+자동포커스+프리필(편집)/빈값(추가). 데이터 변경 흐름은 프로덕션 보호로 제외.
