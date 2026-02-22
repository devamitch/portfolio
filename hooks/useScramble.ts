"use client";
import { useEffect, useState } from "react";

export default function useScramble(target: string, speed = 35) {
  const [text, setText] = useState(target);
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
  useEffect(() => {
    let iter = 0;
    const id = setInterval(() => {
      setText(
        target
          .split("")
          .map((c, i) =>
            i < iter
              ? c
              : c === " "
                ? " "
                : CHARS[Math.floor(Math.random() * CHARS.length)],
          )
          .join(""),
      );
      if (iter >= target.length) clearInterval(id);
      iter += 0.5;
    }, speed);
    return () => clearInterval(id);
  }, [target]);
  return text;
}
