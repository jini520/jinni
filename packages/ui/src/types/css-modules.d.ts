declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

// 전역 스타일 진입점 — side-effect import용 (`import '@jinni/ui/styles'`)
declare module '@jinni/ui/styles';
