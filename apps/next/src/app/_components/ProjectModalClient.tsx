'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetail } from '@jinni/types';
import { ProjectModal, CARD_ACCENTS } from '@jinni/common';

const subscribe = () => () => {};

function getDark() {
  try {
    return localStorage.getItem('jinni-theme') !== 'light';
  } catch {
    return true;
  }
}

export function ProjectModalClient({ project }: { project: ProjectDetail }) {
  const router = useRouter();
  // 홈페이지 ThemeProvider가 기록한 'jinni-theme'를 읽어 모달 테마를 맞춘다.
  // SSR 스냅샷은 dark(기본값), 클라이언트에서 localStorage 값으로 보정.
  const dark = useSyncExternalStore(subscribe, getDark, () => true);

  const accent = CARD_ACCENTS[project.order % CARD_ACCENTS.length];
  const idx = String(project.order + 1).padStart(2, '0');

  return (
    <ProjectModal
      project={project}
      accent={accent}
      dark={dark}
      idx={idx}
      onClose={() => router.back()}
    />
  );
}
