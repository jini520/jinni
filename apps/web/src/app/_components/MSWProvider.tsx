"use client";

import { Suspense, use } from "react";
import { handlers } from "@/mocks/handlers";

declare global {
  interface ImportMeta {
    hot?: { dispose(cb: () => void): void };
  }
}

const MSW_INIT_KEY = "__msw_init_promise__";
const MSW_STARTED_KEY = "__msw_started__";

const initMocking = (): Promise<void> =>
  import("@/mocks/browser").then(async ({ default: worker }) => {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.NEXT_PUBLIC_USE_MSW === "false"
    )
      return;

    const isAlreadyStarted = (globalThis as unknown as Record<string, boolean>)[
      MSW_STARTED_KEY
    ];

    if (!isAlreadyStarted) {
      await worker.start({
        onUnhandledRequest(request, print) {
          if (!request.url.includes("/api")) return;
          print.warning();
        },
      });
      (globalThis as unknown as Record<string, boolean>)[MSW_STARTED_KEY] =
        true;
    }

    worker.use(...handlers);

    import.meta.hot?.dispose(() => worker.stop());
  });

const mockingEnabledPromise: Promise<void> =
  typeof window !== "undefined"
    ? ((globalThis as unknown as Record<string, Promise<void>>)[
        MSW_INIT_KEY
      ] ??= initMocking())
    : Promise.resolve();

interface MSWProviderProps {
  children: React.ReactNode;
}

export const MSWProvider = ({ children }: MSWProviderProps) => {
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
};

const MSWProviderWrapper = ({ children }: MSWProviderProps) => {
  use(mockingEnabledPromise);
  return children;
};

// const shouldUseMSW =
//   process.env.NODE_ENV === "development" &&
//   process.env.NEXT_PUBLIC_USE_MSW === "true";

// export default function MSWProvider({ children }: MSWProviderProps) {
//   // MSW 미사용 시 바로 children 렌더 (prod에서 스피너 방지)
//   const [isReady, setIsReady] = useState(!shouldUseMSW);

//   useEffect(() => {
//     if (!shouldUseMSW) return;

//     const init = async () => {
//       const { worker } = await import("../../mocks/browser");
//       await worker.start({
//         onUnhandledRequest: "bypass",
//       });
//       setIsReady(true);
//     };
//     init();
//   }, []);

//   if (!isReady) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">초기화 중...</p>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
