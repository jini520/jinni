"use client";

import { useEffect, useState } from "react";
import {
  MediaQueryContext,
  MediaQueryContextValue,
} from "@/context/mediaQueryContext";
import _ from "lodash";

interface MediaQueryProviderProps {
  children: React.ReactNode;
}

const MediaQueryProvider = ({ children }: MediaQueryProviderProps) => {
  const [dismension, setDismension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDismension = _.debounce(() => {
      setDismension({ width: window.innerWidth, height: window.innerHeight });
    }, 100);

    updateDismension();
    window.addEventListener("resize", updateDismension);

    return () => {
      window.removeEventListener("resize", updateDismension);
    };
  }, []);

  const matches = (query: string) => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const isMobile = dismension.width < 640;
  const isTablet = dismension.width >= 640 && dismension.width < 1024;
  const isDesktop = dismension.width >= 1024 && dismension.width < 1280;
  const isWideDesktop = dismension.width >= 1280;

  const value: MediaQueryContextValue = {
    isMobile,
    isTablet,
    isDesktop,
    isWideDesktop,
    width: dismension.width,
    height: dismension.height,
    matches,
  };

  return (
    <MediaQueryContext.Provider value={value}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export default MediaQueryProvider;
