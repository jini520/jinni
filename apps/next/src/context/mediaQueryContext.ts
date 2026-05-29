import { createContext, useContext } from "react";

export interface MediaQueryContextValue {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWideDesktop: boolean;
  width: number;
  height: number;
  matches: (query: string) => boolean;
}

export const MediaQueryContext = createContext<
  MediaQueryContextValue | undefined
>(undefined);

export const useMediaQueryContext = () => {
  const context = useContext(MediaQueryContext);
  if (context === undefined) {
    throw new Error(
      "useMediaQueryContext must be used within a MediaQueryProvider",
    );
  }
  return context;
};
