# admin CDD skills 파일럿 전환 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** admin `skills` feature(단일 631줄 파일)를 컨테이너 + 커스텀 훅 + 컴포넌트 폴더 구조로 분해해 동작을 그대로 유지하면서 CDD 패턴을 확립한다.

**Architecture:** 접근법 B — 프레젠테이션 조각(SkillCard/SkillColumn/SkillBoard/모달 2개)을 각자 `(directory)/index.ts` 폴더로 추출하고, 데이터 로딩·DnD·CRUD 로직을 `useSkillBoard` 훅으로 캡슐화한다. 모달은 자체 폼 상태를 가진 독립 컴포넌트로 만든다. 컨테이너 `Skills.tsx`는 훅과 모달 열림 상태만 조립하는 얇은 오케스트레이터가 된다.

**Tech Stack:** React 19, TypeScript, Vite, @dnd-kit, CSS Modules(SCSS), @jinni/ui(Button/Modal/Form via admin `../components` 배럴).

**검증 전략:** admin에는 테스트 러너가 없다. 각 태스크는 `pnpm --filter @jinni/admin exec tsc -b`(타입체크) 통과로 검증하고, 마지막 태스크에서 `pnpm build:admin` + 수동 스모크를 수행한다. 빌드는 매 태스크 후 green을 유지한다(중간 단계에서 scss 클래스 일시 중복은 허용 — CSS Modules는 파일 스코프).

**파일 길이 규칙(소프트):** `.tsx`/`.ts`는 목표 200줄, 자연 이음새 없으면 ~250까지 허용. `useSkillBoard.ts`는 데이터+DnD 응집 단위로 200 근처가 될 수 있으며 밴드 내로 허용한다.

---

## File Structure

생성:
- `src/skills/useSkillBoard.ts` — 데이터 로드 + items/skillMap 상태 + DnD + CRUD
- `src/skills/index.ts` — 페이지 배럴
- `src/skills/components/SkillCard/{SkillCard.tsx,skill-card.module.scss,index.ts}`
- `src/skills/components/SkillColumn/{SkillColumn.tsx,skill-column.module.scss,index.ts}`
- `src/skills/components/SkillBoard/{SkillBoard.tsx,skill-board.module.scss,index.ts}`
- `src/skills/components/SkillFormModal/{SkillFormModal.tsx,index.ts}`
- `src/skills/components/CategoryFormModal/{CategoryFormModal.tsx,index.ts}`

수정:
- `src/skills/Skills.tsx` — 얇은 컨테이너로 재작성
- `src/App.tsx:4` — import 경로 `./skills/Skills` → `./skills`

삭제:
- `src/skills/skills.module.scss` — 클래스가 컴포넌트별 모듈로 이동, `.hint`는 미사용 데드

> 모든 경로 기준 디렉터리: `apps/admin/`. 명령은 저장소 루트(`/Users/jinni/Developments/jejinni-client`)에서 실행.

---

### Task 1: SkillCard (+ SkillCardOverlay)

드래그 카드와 DragOverlay용 오버레이 카드를 추출한다. 카드 스타일을 한 모듈에 모은다.

**Files:**
- Create: `apps/admin/src/skills/components/SkillCard/SkillCard.tsx`
- Create: `apps/admin/src/skills/components/SkillCard/skill-card.module.scss`
- Create: `apps/admin/src/skills/components/SkillCard/index.ts`
- Modify: `apps/admin/src/skills/Skills.tsx` (인라인 SkillCard 제거 후 import)

- [ ] **Step 1: SkillCard.tsx 작성**

```tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SkillDto } from "../../../@types";
import { GripIcon, EditIcon, CloseIcon } from "../../../components";
import styles from "./skill-card.module.scss";

export const SkillCard = ({
  skill,
  onEdit,
  onDelete,
}: {
  skill: SkillDto;
  onEdit: (skill: SkillDto) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stop = (e: React.PointerEvent | React.MouseEvent) =>
    e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""}`}
    >
      <button
        type="button"
        className={styles.cardGrip}
        aria-label="드래그하여 순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <span className={styles.skillName}>{skill.name}</span>
      <div className={styles.cardActions}>
        <button
          className={styles.cardBtn}
          onPointerDown={stop}
          onClick={(e) => {
            stop(e);
            onEdit(skill);
          }}
          title="수정"
          aria-label="수정"
        >
          <EditIcon />
        </button>
        <button
          className={`${styles.cardBtn} ${styles.cardBtnDanger}`}
          onPointerDown={stop}
          onClick={(e) => {
            stop(e);
            onDelete(skill.id);
          }}
          title="삭제"
          aria-label="삭제"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export const SkillCardOverlay = ({ name }: { name: string }) => (
  <div className={`${styles.card} ${styles.cardOverlay}`}>
    <span className={styles.skillName}>{name}</span>
  </div>
);
```

- [ ] **Step 2: skill-card.module.scss 작성**

```scss
@use 'tokens/spacing' as sp;
@use 'tokens/typography' as t;
@use 'tokens/shadows' as sh;

.card {
  display: flex;
  align-items: center;
  gap: sp.$space-2;
  padding: sp.$space-2 sp.$space-3;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: var(--color-border-strong);
  }
}

.cardDragging {
  opacity: 0.4;
}

.cardOverlay {
  box-shadow: sh.$shadow-lg;
  border-color: var(--color-accent);
  cursor: grabbing;
}

.cardGrip {
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--color-text-faint);
  cursor: grab;
  touch-action: none;
  transition: color 0.15s ease, background 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: var(--color-accent);
    background: var(--color-bg-secondary);
  }

  &:active {
    cursor: grabbing;
  }
}

.skillName {
  flex: 1;
  min-width: 0;
  font-size: t.$text-base;
  font-weight: t.$weight-medium;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cardActions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s ease;

  .card:hover & {
    opacity: 1;
  }
}

.cardBtn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-faint);
  font-size: t.$text-xs;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text);
  }

  svg {
    width: 14px;
    height: 14px;
  }
}

.cardBtnDanger:hover {
  color: var(--color-red);
}
```

- [ ] **Step 3: index.ts 작성**

```ts
export { SkillCard, SkillCardOverlay } from "./SkillCard";
```

- [ ] **Step 4: Skills.tsx에서 인라인 SkillCard 제거 + import 추가**

`Skills.tsx` 상단 import 블록 끝(`import styles from "./skills.module.scss";` 다음 줄)에 추가:

```tsx
import { SkillCard } from "./components/SkillCard";
```

그리고 `// ── 스킬 카드 (드래그) ───` 주석부터 `const SkillCard = (...) => { ... };` 전체(원본 49–120행)를 삭제한다. `Column`은 그대로 둔다(Task 2에서 처리). DragOverlay 인라인 카드(원본 536–540행)도 그대로 둔다(Task 6에서 처리).

- [ ] **Step 5: 타입체크**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS (에러 0). `skills.module.scss`와 `skill-card.module.scss`에 `.card` 등이 중복 존재하지만 CSS Modules는 파일 스코프라 충돌 없음.

- [ ] **Step 6: 커밋**

```bash
git add apps/admin/src/skills/components/SkillCard apps/admin/src/skills/Skills.tsx
git commit -m "refactor(admin): skills SkillCard 컴포넌트 폴더로 추출

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: SkillColumn

원본 `Column`을 추출한다. `id === UNCAT` 검사는 `isUncategorized` prop으로 대체해 상수 의존을 제거한다.

**Files:**
- Create: `apps/admin/src/skills/components/SkillColumn/SkillColumn.tsx`
- Create: `apps/admin/src/skills/components/SkillColumn/skill-column.module.scss`
- Create: `apps/admin/src/skills/components/SkillColumn/index.ts`
- Modify: `apps/admin/src/skills/Skills.tsx`

- [ ] **Step 1: SkillColumn.tsx 작성**

```tsx
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CategoryDto, SkillDto } from "../../../@types";
import { EditIcon, CloseIcon } from "../../../components";
import { SkillCard } from "../SkillCard";
import styles from "./skill-column.module.scss";

export const SkillColumn = ({
  id,
  name,
  count,
  category,
  skills,
  isUncategorized,
  addValue,
  onAddChange,
  onAddSubmit,
  onEditCategory,
  onDeleteCategory,
  onEditSkill,
  onDeleteSkill,
}: {
  id: string;
  name: string;
  count: number;
  category: CategoryDto | null;
  skills: SkillDto[];
  isUncategorized: boolean;
  addValue: string;
  onAddChange: (v: string) => void;
  onAddSubmit: () => void;
  onEditCategory: (c: CategoryDto) => void;
  onDeleteCategory: (id: string) => void;
  onEditSkill: (s: SkillDto) => void;
  onDeleteSkill: (id: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`${styles.column} ${isUncategorized ? styles.uncategorized : ""}`}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span className={styles.columnName}>{name}</span>
          <span className={styles.columnCount}>{count}</span>
        </div>
        {category && (
          <div className={styles.columnActions}>
            <button
              className={styles.iconBtn}
              onClick={() => onEditCategory(category)}
              title="카테고리 수정"
              aria-label="카테고리 수정"
            >
              <EditIcon />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              onClick={() => onDeleteCategory(category.id)}
              title="카테고리 삭제"
              aria-label="카테고리 삭제"
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.columnBody} ${isOver ? styles.columnBodyOver : ""}`}
      >
        <SortableContext
          items={skills.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {skills.length === 0 ? (
            <div className={styles.empty}>여기로 드래그</div>
          ) : (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={onEditSkill}
                onDelete={onDeleteSkill}
              />
            ))
          )}
        </SortableContext>
      </div>

      <div className={styles.footer}>
        <input
          className={styles.addInput}
          value={addValue}
          onChange={(e) => onAddChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddSubmit();
            }
          }}
          placeholder="+ 스킬 추가"
        />
      </div>
    </div>
  );
};
```

- [ ] **Step 2: skill-column.module.scss 작성**

```scss
@use 'tokens/spacing' as sp;
@use 'tokens/typography' as t;

.column {
  flex: 0 0 290px;
  width: 290px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-bg-secondary);
}

.uncategorized {
  background: transparent;
  border-style: dashed;
}

.columnHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: sp.$space-2;
  padding: sp.$space-3 sp.$space-4;
  border-bottom: 1px solid var(--color-border);
}

.columnTitle {
  display: flex;
  align-items: center;
  gap: sp.$space-2;
  min-width: 0;
}

.columnName {
  font-size: t.$text-md;
  font-weight: t.$weight-semibold;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.columnCount {
  flex-shrink: 0;
  font-size: t.$text-xs;
  color: var(--color-text-subtle);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 1px sp.$space-2;
}

.columnActions {
  display: flex;
  gap: sp.$space-1;
  flex-shrink: 0;
}

.iconBtn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--color-text-faint);
  font-size: t.$text-sm;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: var(--color-border);
    color: var(--color-text);
    background: var(--color-bg);
  }

  svg {
    width: 15px;
    height: 15px;
  }
}

.iconBtnDanger:hover {
  border-color: var(--color-red);
  color: var(--color-red);
}

.columnBody {
  display: flex;
  flex-direction: column;
  gap: sp.$space-2;
  padding: sp.$space-3;
  min-height: 56px;
  overflow-y: auto;
  flex: 1;
  transition: background 0.15s ease;
}

.columnBodyOver {
  background: color-mix(in srgb, var(--color-accent) 7%, transparent);
}

.empty {
  padding: sp.$space-4 0;
  text-align: center;
  font-size: t.$text-xs;
  color: var(--color-text-faint);
}

.footer {
  padding: 0 sp.$space-3 sp.$space-3;
}

.addInput {
  width: 100%;
  padding: sp.$space-2 sp.$space-3;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: t.$text-sm;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: var(--color-text-faint);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
}
```

- [ ] **Step 3: index.ts 작성**

```ts
export { SkillColumn } from "./SkillColumn";
```

- [ ] **Step 4: Skills.tsx에서 인라인 Column 제거 + 사용처 교체**

import 추가(SkillCard import 아래):

```tsx
import { SkillColumn } from "./components/SkillColumn";
```

원본 `// ── 카테고리 컬럼 ───` 주석부터 `const Column = (...) => { ... };` 전체(원본 122–220행)를 삭제한다.

board 렌더링에서 `<Column ... />`를 `<SkillColumn ... />`로 바꾸고 `isUncategorized` prop을 추가한다. 해당 JSX(원본 512–528행 영역)를 다음으로 교체:

```tsx
            {columns.map((col) => (
              <SkillColumn
                key={col.id}
                id={col.id}
                name={col.name}
                category={col.category}
                isUncategorized={col.id === UNCAT}
                count={(items[col.id] || []).length}
                skills={(items[col.id] || []).map((sid) => skillMap[sid]).filter(Boolean)}
                addValue={addInputs[col.id] || ""}
                onAddChange={(v) => setAddInputs((p) => ({ ...p, [col.id]: v }))}
                onAddSubmit={() => submitAdd(col.id)}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditSkill={handleEditSkill}
                onDeleteSkill={handleDeleteSkill}
              />
            ))}
```

- [ ] **Step 5: 타입체크**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS. (`UNCAT`는 아직 Skills.tsx에 존재하므로 `isUncategorized={col.id === UNCAT}` 유효.)

- [ ] **Step 6: 커밋**

```bash
git add apps/admin/src/skills/components/SkillColumn apps/admin/src/skills/Skills.tsx
git commit -m "refactor(admin): skills SkillColumn 컴포넌트 폴더로 추출

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: SkillFormModal (자체 폼 상태)

스킬 수정 모달을 자체 폼 상태·자동 포커스를 가진 독립 컴포넌트로 추출하고, 컨테이너에서 `skillForm` 상태를 제거한다.

**Files:**
- Create: `apps/admin/src/skills/components/SkillFormModal/SkillFormModal.tsx`
- Create: `apps/admin/src/skills/components/SkillFormModal/index.ts`
- Modify: `apps/admin/src/skills/Skills.tsx`

- [ ] **Step 1: SkillFormModal.tsx 작성**

```tsx
import { useEffect, useRef, useState } from "react";
import type { CategoryDto, SkillDto, SkillRequestDto } from "../../../@types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "../../../components";

export const SkillFormModal = ({
  open,
  skill,
  categories,
  onSubmit,
  onClose,
}: {
  open: boolean;
  skill: SkillDto | null;
  categories: CategoryDto[];
  onSubmit: (data: SkillRequestDto) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<SkillRequestDto>({
    name: "",
    order: 0,
    categoryId: "",
  });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && skill) {
      setForm({
        name: skill.name,
        order: skill.order || 0,
        categoryId: skill.categoryId || "",
      });
    }
  }, [open, skill]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => nameRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="스킬 수정">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <FormField label="스킬 이름" required>
          <input
            ref={nameRef}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="React, TypeScript 등"
            required
          />
        </FormField>
        <FormField label="카테고리">
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">미분류</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormActions>
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </FormActions>
      </Form>
    </Modal>
  );
};
```

- [ ] **Step 2: index.ts 작성**

```ts
export { SkillFormModal } from "./SkillFormModal";
```

- [ ] **Step 3: Skills.tsx 갱신 — 인라인 스킬 모달 교체 + skillForm 상태 제거**

import 추가:

```tsx
import { SkillFormModal } from "./components/SkillFormModal";
```

상태 선언에서 `skillForm` 줄 삭제(원본 236행):

```tsx
  const [skillForm, setSkillForm] = useState<SkillRequestDto>({ name: "", order: 0, categoryId: "" });
```

`handleEditSkill`을 폼 시드 없이 변경(원본 398–406행):

```tsx
  const handleEditSkill = (skill: SkillDto) => {
    setEditingSkill(skill);
    setModalType("skill");
  };
```

`handleSaveSkill`을 인자 기반으로 변경(원본 408–418행):

```tsx
  const handleSaveSkill = async (data: SkillRequestDto) => {
    if (!editingSkill) return;
    try {
      await skillsApi.updateSkill(editingSkill.id, data);
      closeModal();
      loadData();
    } catch (err) {
      setError("스킬 저장에 실패했습니다.");
      console.error(err);
    }
  };
```

인라인 스킬 모달 JSX(원본 545–587행, `{/* 스킬 수정 모달 */}` `<Modal>...</Modal>` 전체)를 다음으로 교체:

```tsx
      <SkillFormModal
        open={modalType === "skill"}
        skill={editingSkill}
        categories={sortedCategories}
        onSubmit={handleSaveSkill}
        onClose={closeModal}
      />
```

> 주: `nameInputRef`/`modalType` 기반 자동 포커스 `useEffect`(원본 250–255행)는 카테고리 모달이 아직 인라인이라 그대로 둔다(Task 4에서 정리).

- [ ] **Step 4: 타입체크**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS. `SkillRequestDto`는 `../@types`에서 이미 import됨. `skillForm`/`setSkillForm` 미사용 잔존 없음.

- [ ] **Step 5: 커밋**

```bash
git add apps/admin/src/skills/components/SkillFormModal apps/admin/src/skills/Skills.tsx
git commit -m "refactor(admin): skills 스킬 모달을 독립 SkillFormModal로 추출

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: CategoryFormModal (자체 폼 상태)

카테고리 추가/수정 모달을 독립 컴포넌트로 추출하고, 컨테이너에서 `categoryForm`·`nameInputRef`·자동 포커스 `useEffect`를 제거한다.

**Files:**
- Create: `apps/admin/src/skills/components/CategoryFormModal/CategoryFormModal.tsx`
- Create: `apps/admin/src/skills/components/CategoryFormModal/index.ts`
- Modify: `apps/admin/src/skills/Skills.tsx`

- [ ] **Step 1: CategoryFormModal.tsx 작성**

```tsx
import { useEffect, useRef, useState } from "react";
import type { CategoryDto, CategoryRequestDto } from "../../../@types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "../../../components";

export const CategoryFormModal = ({
  open,
  category,
  defaultOrder,
  onSubmit,
  onClose,
}: {
  open: boolean;
  category: CategoryDto | null;
  defaultOrder: number;
  onSubmit: (data: CategoryRequestDto) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<CategoryRequestDto>({ name: "", order: 0 });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        category
          ? { name: category.name, order: category.order || 0 }
          : { name: "", order: defaultOrder }
      );
    }
  }, [open, category, defaultOrder]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => nameRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? "카테고리 수정" : "카테고리 추가"}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <FormField label="카테고리 이름" required>
          <input
            ref={nameRef}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Frontend, Backend 등"
            required
          />
        </FormField>
        <FormField label="표시 순서">
          <input
            type="number"
            min="0"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: parseInt(e.target.value) || 0 })
            }
          />
        </FormField>
        <FormActions>
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </FormActions>
      </Form>
    </Modal>
  );
};
```

- [ ] **Step 2: index.ts 작성**

```ts
export { CategoryFormModal } from "./CategoryFormModal";
```

- [ ] **Step 3: Skills.tsx 갱신 — 인라인 카테고리 모달 교체 + 상태/ref 제거**

import 추가:

```tsx
import { CategoryFormModal } from "./components/CategoryFormModal";
```

다음 항목을 삭제:
- `categoryForm` 상태 선언(원본 237행): `const [categoryForm, setCategoryForm] = useState<CategoryRequestDto>({ name: "", order: 0 });`
- `nameInputRef` 선언(원본 238행): `const nameInputRef = useRef<HTMLInputElement>(null);`
- 자동 포커스 `useEffect`(원본 250–255행) 전체:
```tsx
  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);
```

`handleAddCategory`를 폼 시드 없이 변경(원본 432–436행):

```tsx
  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalType("category");
  };
```

`handleEditCategory`를 폼 시드 없이 변경(원본 438–442행):

```tsx
  const handleEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setModalType("category");
  };
```

`handleSaveCategory`를 인자 기반으로 변경(원본 444–457행):

```tsx
  const handleSaveCategory = async (data: CategoryRequestDto) => {
    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, data);
      } else {
        await categoriesApi.createCategory(data);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("카테고리 저장에 실패했습니다.");
      console.error(err);
    }
  };
```

인라인 카테고리 모달 JSX(원본 589–626행, `{/* 카테고리 모달 */}` `<Modal>...</Modal>` 전체)를 다음으로 교체:

```tsx
      <CategoryFormModal
        open={modalType === "category"}
        category={editingCategory}
        defaultOrder={categories.length}
        onSubmit={handleSaveCategory}
        onClose={closeModal}
      />
```

> 주: `react` import는 변경하지 않는다. 이 시점 컨테이너는 아직 `itemsRef = useRef(items)`(Task 5에서 훅으로 이동)와 loadData/itemsRef용 `useEffect`를 보유하므로 `import { useState, useEffect, useRef } from "react";`를 그대로 유지한다. `nameInputRef`만 제거되며 `useRef`는 `itemsRef`가 계속 사용한다.

- [ ] **Step 4: 타입체크**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS. `categoryForm`/`setCategoryForm`/`nameInputRef` 미사용 잔존 없음(`useRef`는 `itemsRef`가 계속 사용하므로 import 유지).

- [ ] **Step 5: 커밋**

```bash
git add apps/admin/src/skills/components/CategoryFormModal apps/admin/src/skills/Skills.tsx
git commit -m "refactor(admin): skills 카테고리 모달을 독립 CategoryFormModal로 추출

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: useSkillBoard 훅

데이터 로드 + 보드 상태 + DnD + CRUD를 훅으로 캡슐화하고, 컨테이너는 훅을 소비하도록 바꾼다. 모달 저장은 boolean 반환으로 성공 시에만 닫는다.

**Files:**
- Create: `apps/admin/src/skills/useSkillBoard.ts`
- Modify: `apps/admin/src/skills/Skills.tsx`

- [ ] **Step 1: useSkillBoard.ts 작성**

```ts
import { useState, useEffect, useRef } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { skillsApi, categoriesApi } from "../api/skills";
import type {
  SkillDto,
  CategoryDto,
  SkillRequestDto,
  CategoryRequestDto,
} from "../@types";

export const UNCAT = "__uncategorized__";

export interface SkillBoardColumn {
  id: string;
  name: string;
  category: CategoryDto | null;
}

export const useSkillBoard = () => {
  const [skillMap, setSkillMap] = useState<Record<string, SkillDto>>({});
  const [items, setItems] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addInputs, setAddInputs] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, cRes] = await Promise.all([
        skillsApi.getAllSkills(),
        categoriesApi.getCategories(),
      ]);
      const sk: SkillDto[] = sRes.data.data.skills || [];
      const cats: CategoryDto[] = cRes.data.data || [];

      const map: Record<string, SkillDto> = {};
      sk.forEach((s) => (map[s.id] = s));
      setSkillMap(map);
      setCategories(cats);

      const it: Record<string, string[]> = {};
      cats.forEach((c) => (it[c.id] = []));
      it[UNCAT] = [];
      [...sk]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach((s) => {
          const cid = s.categoryId && it[s.categoryId] ? s.categoryId : UNCAT;
          it[cid].push(s.id);
        });
      setItems(it);
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const findContainer = (id: string): string | undefined => {
    const cur = itemsRef.current;
    if (id in cur) return id;
    return Object.keys(cur).find((k) => cur[k].includes(id));
  };

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(String(e.active.id));

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const a = String(active.id);
    const o = String(over.id);
    const ac = findContainer(a);
    const oc = findContainer(o);
    if (!ac || !oc || ac === oc) return;

    setItems((prev) => {
      const aItems = prev[ac];
      const oItems = prev[oc];
      const overIndex = o in prev ? oItems.length : oItems.indexOf(o);
      const newIndex = overIndex === -1 ? oItems.length : overIndex;
      return {
        ...prev,
        [ac]: aItems.filter((x) => x !== a),
        [oc]: [...oItems.slice(0, newIndex), a, ...oItems.slice(newIndex)],
      };
    });
  };

  const persist = async (board: Record<string, string[]>) => {
    const updates: Promise<unknown>[] = [];
    const nextMap = { ...skillMap };
    Object.keys(board).forEach((cId) => {
      const desiredCat = cId === UNCAT ? "" : cId;
      board[cId].forEach((sid, index) => {
        const s = skillMap[sid];
        if (!s) return;
        const curCat = s.categoryId || "";
        if (curCat !== desiredCat || (s.order ?? 0) !== index) {
          updates.push(
            skillsApi.updateSkill(sid, {
              name: s.name,
              categoryId: desiredCat,
              order: index,
            })
          );
          nextMap[sid] = { ...s, categoryId: desiredCat, order: index };
        }
      });
    });
    if (!updates.length) return;
    setSkillMap(nextMap);
    try {
      await Promise.all(updates);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData();
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const a = String(active.id);
    const o = String(over.id);
    const oc = findContainer(o);
    if (!oc) return;

    const cur = itemsRef.current;
    let next = cur;
    const arr = cur[oc];
    const oldIndex = arr.indexOf(a);
    const newIndex = o in cur ? arr.length - 1 : arr.indexOf(o);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      next = { ...cur, [oc]: arrayMove(arr, oldIndex, newIndex) };
      setItems(next);
    }
    persist(next);
  };

  const setAddInput = (id: string, value: string) =>
    setAddInputs((p) => ({ ...p, [id]: value }));

  const submitAdd = async (containerId: string) => {
    const name = (addInputs[containerId] || "").trim();
    if (!name) return;
    try {
      await skillsApi.createSkill({
        name,
        order: (items[containerId] || []).length,
        categoryId: containerId === UNCAT ? "" : containerId,
      });
      setAddInputs((p) => ({ ...p, [containerId]: "" }));
      loadData();
    } catch (err) {
      setError("스킬 추가에 실패했습니다.");
      console.error(err);
    }
  };

  const saveSkill = async (
    id: string,
    data: SkillRequestDto
  ): Promise<boolean> => {
    try {
      await skillsApi.updateSkill(id, data);
      loadData();
      return true;
    } catch (err) {
      setError("스킬 저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await skillsApi.deleteSkill(id);
      loadData();
    } catch (err) {
      setError("스킬 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const saveCategory = async (
    category: CategoryDto | null,
    data: CategoryRequestDto
  ): Promise<boolean> => {
    try {
      if (category) {
        await categoriesApi.updateCategory(category.id, data);
      } else {
        await categoriesApi.createCategory(data);
      }
      loadData();
      return true;
    } catch (err) {
      setError("카테고리 저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    if (
      !confirm(
        "정말 삭제하시겠습니까? 해당 카테고리의 스킬은 미분류로 이동됩니다."
      )
    )
      return;
    try {
      await categoriesApi.deleteCategory(id);
      loadData();
    } catch (err) {
      setError("카테고리 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const sortedCategories = [...categories].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  const totalSkills = Object.keys(skillMap).length;

  const columns: SkillBoardColumn[] = [
    ...sortedCategories.map((c) => ({ id: c.id, name: c.name, category: c })),
  ];
  if ((items[UNCAT]?.length ?? 0) > 0) {
    columns.push({ id: UNCAT, name: "미분류", category: null });
  }

  const activeSkill = activeId ? skillMap[activeId] : null;

  return {
    skillMap,
    items,
    categories,
    sortedCategories,
    columns,
    totalSkills,
    loading,
    error,
    sensors,
    activeSkill,
    addInputs,
    setAddInput,
    submitAdd,
    saveSkill,
    deleteSkill,
    saveCategory,
    deleteCategory,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  };
};
```

- [ ] **Step 2: Skills.tsx를 훅 소비로 전환 (board JSX는 유지)**

이 단계는 컨테이너의 모든 로직/상태를 훅으로 위임하되, board JSX(DndContext)는 아직 인라인이다. Skills.tsx를 다음으로 교체한다(여전히 DndContext 인라인, Task 6에서 SkillBoard로 추출):

```tsx
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import type {
  SkillDto,
  CategoryDto,
  SkillRequestDto,
  CategoryRequestDto,
} from "../@types";
import {
  Page,
  PageHeader,
  ErrorBanner,
  Spinner,
  Button,
} from "../components";
import { useSkillBoard, UNCAT } from "./useSkillBoard";
import { SkillColumn } from "./components/SkillColumn";
import { SkillCardOverlay } from "./components/SkillCard";
import { SkillFormModal } from "./components/SkillFormModal";
import { CategoryFormModal } from "./components/CategoryFormModal";
import styles from "./skills.module.scss";

type ModalType = "skill" | "category" | null;

const Skills = () => {
  const board = useSkillBoard();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );

  const openSkillModal = (skill: SkillDto) => {
    setEditingSkill(skill);
    setModalType("skill");
  };
  const openAddCategory = () => {
    setEditingCategory(null);
    setModalType("category");
  };
  const openEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setModalType("category");
  };
  const closeModal = () => {
    setModalType(null);
    setEditingSkill(null);
    setEditingCategory(null);
  };

  const handleSaveSkill = async (data: SkillRequestDto) => {
    if (!editingSkill) return;
    if (await board.saveSkill(editingSkill.id, data)) closeModal();
  };
  const handleSaveCategory = async (data: CategoryRequestDto) => {
    if (await board.saveCategory(editingCategory, data)) closeModal();
  };

  return (
    <Page wide fill>
      <PageHeader
        title="Skills 관리"
        subtitle={`스킬 ${board.totalSkills} · 카테고리 ${board.categories.length}개 — 카드를 드래그해 순서·카테고리를 바꿀 수 있습니다`}
        actions={<Button onClick={openAddCategory}>+ 카테고리</Button>}
      />

      <ErrorBanner message={board.error} />

      {board.loading ? (
        <Spinner />
      ) : (
        <DndContext
          sensors={board.sensors}
          collisionDetection={closestCorners}
          onDragStart={board.onDragStart}
          onDragOver={board.onDragOver}
          onDragEnd={board.onDragEnd}
        >
          <div className={styles.board}>
            {board.columns.map((col) => (
              <SkillColumn
                key={col.id}
                id={col.id}
                name={col.name}
                category={col.category}
                isUncategorized={col.id === UNCAT}
                count={(board.items[col.id] || []).length}
                skills={(board.items[col.id] || [])
                  .map((sid) => board.skillMap[sid])
                  .filter(Boolean)}
                addValue={board.addInputs[col.id] || ""}
                onAddChange={(v) => board.setAddInput(col.id, v)}
                onAddSubmit={() => board.submitAdd(col.id)}
                onEditCategory={openEditCategory}
                onDeleteCategory={board.deleteCategory}
                onEditSkill={openSkillModal}
                onDeleteSkill={board.deleteSkill}
              />
            ))}

            <button className={styles.addColumn} onClick={openAddCategory}>
              + 카테고리 추가
            </button>
          </div>

          <DragOverlay>
            {board.activeSkill ? (
              <SkillCardOverlay name={board.activeSkill.name} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <SkillFormModal
        open={modalType === "skill"}
        skill={editingSkill}
        categories={board.sortedCategories}
        onSubmit={handleSaveSkill}
        onClose={closeModal}
      />

      <CategoryFormModal
        open={modalType === "category"}
        category={editingCategory}
        defaultOrder={board.categories.length}
        onSubmit={handleSaveCategory}
        onClose={closeModal}
      />
    </Page>
  );
};

export default Skills;
```

> 이 단계에서 `skills.module.scss`는 아직 `.board`/`.addColumn`만 실제 사용된다(나머지 클래스는 컴포넌트 모듈로 이미 이동, 원본 파일엔 남아있지만 미사용). 정리는 Task 6에서.

- [ ] **Step 3: 타입체크**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS. 컨테이너에서 `skillsApi`/`categoriesApi`/`useEffect`/`useRef`/dnd 센서 import가 모두 사라졌고 orphan import 없음.

- [ ] **Step 4: 커밋**

```bash
git add apps/admin/src/skills/useSkillBoard.ts apps/admin/src/skills/Skills.tsx
git commit -m "refactor(admin): skills 데이터·DnD 로직을 useSkillBoard 훅으로 추출

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: SkillBoard 조직 컴포넌트 + scss 정리

DndContext + 컬럼 매핑 + DragOverlay를 SkillBoard로 추출하고, board 레벨 scss를 전용 모듈로 옮긴 뒤 `skills.module.scss`를 삭제한다.

**Files:**
- Create: `apps/admin/src/skills/components/SkillBoard/SkillBoard.tsx`
- Create: `apps/admin/src/skills/components/SkillBoard/skill-board.module.scss`
- Create: `apps/admin/src/skills/components/SkillBoard/index.ts`
- Modify: `apps/admin/src/skills/Skills.tsx`
- Delete: `apps/admin/src/skills/skills.module.scss`

- [ ] **Step 1: SkillBoard.tsx 작성**

```tsx
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import type { CategoryDto, SkillDto } from "../../../@types";
import { UNCAT, type SkillBoardColumn } from "../../useSkillBoard";
import { SkillColumn } from "../SkillColumn";
import { SkillCardOverlay } from "../SkillCard";
import styles from "./skill-board.module.scss";

export const SkillBoard = ({
  columns,
  items,
  skillMap,
  sensors,
  activeSkill,
  addInputs,
  onDragStart,
  onDragOver,
  onDragEnd,
  onAddChange,
  onAddSubmit,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onEditSkill,
  onDeleteSkill,
}: {
  columns: SkillBoardColumn[];
  items: Record<string, string[]>;
  skillMap: Record<string, SkillDto>;
  sensors: SensorDescriptor<SensorOptions>[];
  activeSkill: SkillDto | null;
  addInputs: Record<string, string>;
  onDragStart: (e: DragStartEvent) => void;
  onDragOver: (e: DragOverEvent) => void;
  onDragEnd: (e: DragEndEvent) => void;
  onAddChange: (id: string, value: string) => void;
  onAddSubmit: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (c: CategoryDto) => void;
  onDeleteCategory: (id: string) => void;
  onEditSkill: (s: SkillDto) => void;
  onDeleteSkill: (id: string) => void;
}) => {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className={styles.board}>
        {columns.map((col) => (
          <SkillColumn
            key={col.id}
            id={col.id}
            name={col.name}
            category={col.category}
            isUncategorized={col.id === UNCAT}
            count={(items[col.id] || []).length}
            skills={(items[col.id] || [])
              .map((sid) => skillMap[sid])
              .filter(Boolean)}
            addValue={addInputs[col.id] || ""}
            onAddChange={(v) => onAddChange(col.id, v)}
            onAddSubmit={() => onAddSubmit(col.id)}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onEditSkill={onEditSkill}
            onDeleteSkill={onDeleteSkill}
          />
        ))}

        <button className={styles.addColumn} onClick={onAddCategory}>
          + 카테고리 추가
        </button>
      </div>

      <DragOverlay>
        {activeSkill ? <SkillCardOverlay name={activeSkill.name} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
```

- [ ] **Step 2: skill-board.module.scss 작성**

```scss
@use 'tokens/spacing' as sp;
@use 'tokens/typography' as t;

.board {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  gap: sp.$space-4;
  overflow-x: auto;
  padding-bottom: sp.$space-3;
}

.addColumn {
  flex: 0 0 200px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: sp.$space-2;
  min-height: 56px;
  padding: sp.$space-4;
  border: 1px dashed var(--color-border);
  border-radius: 16px;
  background: transparent;
  color: var(--color-text-subtle);
  font-size: t.$text-sm;
  font-weight: t.$weight-medium;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}
```

- [ ] **Step 3: index.ts 작성**

```ts
export { SkillBoard } from "./SkillBoard";
```

- [ ] **Step 4: Skills.tsx를 SkillBoard 사용으로 정리**

Skills.tsx를 다음 최종본으로 교체한다(DndContext·SkillColumn·SkillCardOverlay·styles import 제거, SkillBoard 사용):

```tsx
import { useState } from "react";
import type {
  SkillDto,
  CategoryDto,
  SkillRequestDto,
  CategoryRequestDto,
} from "../@types";
import { Page, PageHeader, ErrorBanner, Spinner, Button } from "../components";
import { useSkillBoard } from "./useSkillBoard";
import { SkillBoard } from "./components/SkillBoard";
import { SkillFormModal } from "./components/SkillFormModal";
import { CategoryFormModal } from "./components/CategoryFormModal";

type ModalType = "skill" | "category" | null;

const Skills = () => {
  const board = useSkillBoard();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );

  const openSkillModal = (skill: SkillDto) => {
    setEditingSkill(skill);
    setModalType("skill");
  };
  const openAddCategory = () => {
    setEditingCategory(null);
    setModalType("category");
  };
  const openEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setModalType("category");
  };
  const closeModal = () => {
    setModalType(null);
    setEditingSkill(null);
    setEditingCategory(null);
  };

  const handleSaveSkill = async (data: SkillRequestDto) => {
    if (!editingSkill) return;
    if (await board.saveSkill(editingSkill.id, data)) closeModal();
  };
  const handleSaveCategory = async (data: CategoryRequestDto) => {
    if (await board.saveCategory(editingCategory, data)) closeModal();
  };

  return (
    <Page wide fill>
      <PageHeader
        title="Skills 관리"
        subtitle={`스킬 ${board.totalSkills} · 카테고리 ${board.categories.length}개 — 카드를 드래그해 순서·카테고리를 바꿀 수 있습니다`}
        actions={<Button onClick={openAddCategory}>+ 카테고리</Button>}
      />

      <ErrorBanner message={board.error} />

      {board.loading ? (
        <Spinner />
      ) : (
        <SkillBoard
          columns={board.columns}
          items={board.items}
          skillMap={board.skillMap}
          sensors={board.sensors}
          activeSkill={board.activeSkill}
          addInputs={board.addInputs}
          onDragStart={board.onDragStart}
          onDragOver={board.onDragOver}
          onDragEnd={board.onDragEnd}
          onAddChange={board.setAddInput}
          onAddSubmit={board.submitAdd}
          onAddCategory={openAddCategory}
          onEditCategory={openEditCategory}
          onDeleteCategory={board.deleteCategory}
          onEditSkill={openSkillModal}
          onDeleteSkill={board.deleteSkill}
        />
      )}

      <SkillFormModal
        open={modalType === "skill"}
        skill={editingSkill}
        categories={board.sortedCategories}
        onSubmit={handleSaveSkill}
        onClose={closeModal}
      />

      <CategoryFormModal
        open={modalType === "category"}
        category={editingCategory}
        defaultOrder={board.categories.length}
        onSubmit={handleSaveCategory}
        onClose={closeModal}
      />
    </Page>
  );
};

export default Skills;
```

- [ ] **Step 5: skills.module.scss 삭제**

```bash
git rm apps/admin/src/skills/skills.module.scss
```

- [ ] **Step 6: 타입체크 + 빌드**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS.

Run: `pnpm build:admin`
Expected: vite 빌드 성공, `skills.module.scss` 참조 잔존으로 인한 에러 없음.

- [ ] **Step 7: 커밋**

```bash
git add apps/admin/src/skills
git commit -m "refactor(admin): skills 보드를 SkillBoard로 추출하고 page scss 정리

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: 배럴 + 라우트 정리 + 최종 검증

페이지 배럴을 만들고 라우트 import를 정리한 뒤, 파일 길이 규칙과 수동 스모크로 마무리한다.

**Files:**
- Create: `apps/admin/src/skills/index.ts`
- Modify: `apps/admin/src/App.tsx:4`

- [ ] **Step 1: index.ts 작성**

```ts
export { default } from "./Skills";
```

- [ ] **Step 2: App.tsx import 경로 변경**

`apps/admin/src/App.tsx` 4행을 다음으로 변경:

```tsx
import Skills from "./skills";
```

- [ ] **Step 3: 타입체크 + 빌드**

Run: `pnpm --filter @jinni/admin exec tsc -b`
Expected: PASS.

Run: `pnpm build:admin`
Expected: 빌드 성공.

- [ ] **Step 4: 파일 길이 규칙 확인**

Run: `find apps/admin/src/skills -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn`
Expected: `useSkillBoard.ts`는 200 근처(밴드 내 허용), 그 외 `.tsx`/`.ts`는 모두 200 미만. 200을 넘는 파일이 있으면 책임 분리가 더 필요한지 검토.

- [ ] **Step 5: 수동 스모크 (개발 서버)**

Run: `pnpm dev:admin` 후 브라우저 `http://localhost:5173/skills` 접속하여 확인:
- [ ] 카드 드래그로 같은 컬럼 내 순서 변경 → 새로고침 후 유지
- [ ] 카드 드래그로 다른 카테고리로 이동 → 새로고침 후 유지
- [ ] 컬럼 하단 "+ 스킬 추가" 입력 후 Enter → 카드 추가
- [ ] 카드 수정 버튼 → 모달 열림 + 이름 입력 자동 포커스 → 이름/카테고리 변경 저장 반영
- [ ] 카드 삭제 버튼 → confirm 후 삭제
- [ ] "+ 카테고리" / "+ 카테고리 추가" → 카테고리 추가 모달 자동 포커스 → 저장
- [ ] 카테고리 수정/삭제(삭제 시 스킬 미분류 이동)
- [ ] 빈 컬럼 "여기로 드래그" 표시, 미분류 컬럼은 점선 스타일

- [ ] **Step 6: 커밋**

```bash
git add apps/admin/src/skills/index.ts apps/admin/src/App.tsx
git commit -m "refactor(admin): skills 페이지 배럴 추가 및 라우트 import 정리

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 완료 기준

- [ ] `skills` feature가 컨테이너 + 훅 + 5개 컴포넌트 폴더(`(directory)/index.ts`)로 분해됨
- [ ] 모든 `.tsx`/`.ts` 파일이 길이 규칙 충족(목표 200, `useSkillBoard.ts`만 밴드 내)
- [ ] `pnpm build:admin` 통과
- [ ] 수동 스모크 전 항목 통과(드래그/추가/수정/삭제/모달 포커스)
- [ ] `@jinni/ui` 사용 유지(Button/Modal/Form), 아이콘 경로 미변경(`../components` 배럴)
- [ ] 이후 feature 전환에 복제 가능한 패턴 확립
