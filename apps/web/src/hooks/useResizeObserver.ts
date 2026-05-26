import { RefObject, useEffect, useRef, useState } from "react";
import _ from "lodash";

interface UseResizeObserverOptions {
  debounceMs?: number;
}

interface UseResizeObserverReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  width: number;
  height: number;
}

export const useResizeObserver = <T extends HTMLElement>(
  options: UseResizeObserverOptions = {}
): UseResizeObserverReturn<T> => {
  const { debounceMs = 100 } = options;
  const ref = useRef<T>(null);
  const [dismension, setDismension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateDismensions = _.debounce((width: number, height: number) => {
      setDismension({ width, height });
    }, debounceMs);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateDismensions(width, height);
      }
    });

    resizeObserver.observe(element);

    const rect = element.getBoundingClientRect();
    setDismension({ width: rect.width, height: rect.height });

    return () => {
      resizeObserver.disconnect();
      updateDismensions.cancel();
    };
  }, [debounceMs]);

  return { ref, ...dismension };
};
