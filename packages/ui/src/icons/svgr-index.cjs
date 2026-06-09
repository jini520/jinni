const path = require('path');

// svgr가 생성한 파일 경로 목록을 받아, kebab 파일명을 PascalCase + "Icon" 접미사로
// default export 재노출하는 배럴(index.ts)을 만든다.
// (@svgr/cli 버전에 따라 문자열/객체 배열 모두 올 수 있어 방어적으로 처리)
//
// 파일명 계약: kebab-case(단일 구분자), 선두 숫자 없음. 예) `styled-components` → `StyledComponentsIcon`.
// `3d-x`(선두 숫자), `a--b`(연속 구분자)는 유효하지 않은 식별자를 만들 수 있으니 svg 파일명을 이 규칙에 맞춘다.
module.exports = (filePaths) =>
  filePaths
    .map((entry) => (typeof entry === 'string' ? entry : entry.path))
    .map((fp) => {
      const base = path.basename(fp, path.extname(fp)); // "styled-components"
      const pascal = base.replace(/(^|[-_])(\w)/g, (_m, _s, c) => c.toUpperCase()); // "StyledComponents"
      return `export { default as ${pascal}Icon } from './${base}';`;
    })
    .join('\n') + '\n';
