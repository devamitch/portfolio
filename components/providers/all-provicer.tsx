"use client";
import { useEffect, useState } from "react";
import { LiquidGoldAnimation } from "../ui/LiquidGoldAnimation";

const AllProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#030303",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Mono', 'Courier New', monospace",
        }}
      >
        <LiquidGoldAnimation
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          speed={0.03}
          intensity={6}
          particleCount={60}
        />
      </div>
    );
  }
  return (
    <div
      role="application"
      aria-label="Amit Chakraborty Portfolio — Principal Mobile Architect"
    >
      {children}
    </div>
  );
};

export default AllProvider;
