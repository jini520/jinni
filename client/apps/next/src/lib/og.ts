// OG 이미지(ImageResponse)용 한글 폰트 로더.
// Satori(ImageResponse 엔진)의 기본 폰트는 라틴 전용이라 한글이 깨진다(tofu).
// 정적 Pretendard woff를 받아 폰트로 넘겨야 한글이 렌더된다.
// woff(1.1MB)를 쓰는 이유: OTF(2.1MB)는 Next 데이터 캐시 한도(2MB)를 초과해 캐시 불가.
// 모듈 레벨에 캐시해 프로세스당 한 번만 받는다.
const FONT_URL =
  'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff/Pretendard-SemiBold.woff';

let fontPromise: Promise<ArrayBuffer> | null = null;

export function loadPretendard(): Promise<ArrayBuffer> {
  if (!fontPromise) {
    fontPromise = fetch(FONT_URL, { cache: 'force-cache' }).then((res) => {
      if (!res.ok) throw new Error(`font fetch failed: ${res.status}`);
      return res.arrayBuffer();
    });
  }
  return fontPromise;
}
