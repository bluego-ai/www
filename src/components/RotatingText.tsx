"use client";

import { useState, useEffect } from "react";

const phrases = [
  "Sales & Marketing",
  "Operations",
  "Customer Support",
  "Scheduling",
  "Lead Generation",
  "Communications",
];

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setInterval(() => {
      setStage("out");
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setStage("in");
      }, 400);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className="block text-blue-400 transition-all duration-400 ease-in-out"
      style={{
        opacity: stage === "in" ? 1 : 0,
        transform: stage === "in" ? "translateY(0)" : "translateY(-0.3em)",
        filter: stage === "in" ? "blur(0px)" : "blur(4px)",
      }}
    >
      {phrases[index]}
    </span>
  );
}
