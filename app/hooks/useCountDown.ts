// useCountDown.ts
// Animates a number counting DOWN from ~multiplier× the target to the target.
// Returns the current display string, or null if value is null.
// Re-animates whenever animationKey increments.
// Integer values display as integers; non-integer values display to 1dp.

import { useEffect, useRef, useState } from "react";

export function useCountDown(
  value: number | null,
  animationKey: number,
  options: { multiplier?: number; duration?: number } = {},
): string | null {
  const { multiplier = 3, duration = 1.5 } = options;
  const isInt = value !== null && Number.isInteger(value);
  const finalDisplay =
    value === null ? null : isInt ? String(value) : value.toFixed(1);
  const [display, setDisplay] = useState(finalDisplay);
  const tweenRef = useRef<{ kill(): void } | null>(null);

  useEffect(() => {
    if (value === null) return;
    let isMounted = true;
    const run = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      const startValue = Math.ceil(value * multiplier);
      const counter = { value: startValue };
      setDisplay(isInt ? String(startValue) : startValue.toFixed(1));
      tweenRef.current = gsap.to(counter, {
        value,
        duration,
        ease: "power2.out",
        onUpdate() {
          if (!isMounted) return;
          setDisplay(
            isInt
              ? String(Math.round(counter.value))
              : counter.value.toFixed(1),
          );
        },
        onComplete() {
          if (!isMounted) return;
          setDisplay(finalDisplay);
        },
      });
    };
    run();
    return () => {
      isMounted = false;
      tweenRef.current?.kill();
    };
  }, [value, animationKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}
