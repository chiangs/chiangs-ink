// useStavTime.ts
// Returns the current Stavanger time as "HH:MM TZ" (e.g. "10:49 CET").
// Updates every second.

import { useEffect, useState } from "react";
import { TIMEZONE_STAVANGER } from "~/lib/constants";

export function useStavTime(): string {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const hhmm = new Date().toLocaleTimeString("en-GB", {
        timeZone: TIMEZONE_STAVANGER,
        hour: "2-digit",
        minute: "2-digit",
      });
      const tz = new Date()
        .toLocaleTimeString("en-GB", {
          timeZone: TIMEZONE_STAVANGER,
          timeZoneName: "short",
        })
        .split(" ")
        .pop();
      setTime(`${hhmm} ${tz}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
