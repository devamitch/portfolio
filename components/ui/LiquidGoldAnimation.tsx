"use client";

import React, { useEffect, useRef } from "react";

interface LiquidGoldAnimationProps {
  width?: number;
  height?: number;
  speed?: number; // animation speed (default 0.02)
  intensity?: number; // deformation intensity (default 4)
  particleCount?: number; // number of floating particles (default 40)
  baseColor?: string; // base gold color (default "#D4AF37")
  highlightColor?: string; // highlight gold (default "#FBF5B7")
  shadowColor?: string; // dark gold (default "#8C6218")
  isActive?: boolean; // start/stop animation (default true)
}

export const LiquidGoldAnimation: React.FC<LiquidGoldAnimationProps> = ({
  width = 300,
  height = 300,
  speed = 0.02,
  intensity = 4,
  particleCount = 40,
  baseColor = "#D4AF37",
  highlightColor = "#FBF5B7",
  shadowColor = "#8C6218",
  isActive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Initialize floating particles
    const initParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      }));
    };
    initParticles();

    const draw = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update time for animation
      timeRef.current += speed;

      // --- Main Liquid Blob ---
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
      const points = 12; // number of vertices for blob

      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Deform radius with multiple harmonics
        const deform =
          Math.sin(angle * 3 + timeRef.current * 1.5) * intensity * 1.2 +
          Math.cos(angle * 5 - timeRef.current * 1.8) * intensity * 0.8 +
          Math.sin(angle * 7 + timeRef.current * 2.2) * intensity * 0.5;
        const r = baseRadius + deform;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Gold gradient
      const gradient = ctx.createRadialGradient(
        cx - 15,
        cy - 15,
        10,
        cx,
        cy,
        baseRadius * 1.5,
      );
      gradient.addColorStop(0, highlightColor);
      gradient.addColorStop(0.4, baseColor);
      gradient.addColorStop(0.8, shadowColor);
      gradient.addColorStop(1, "#5A3E0E");

      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // --- Inner glow (extra layer for depth) ---
      ctx.save();
      ctx.shadowColor = "rgba(255, 245, 190, 0.5)";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // --- Floating gold particles (liquid sparks) ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 150, ${0.6 + Math.sin(timeRef.current + i) * 0.2})`;
        ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      // Connect nearby particles with faint lines (like liquid streams)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 - dist / 600})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Handle resize
    const handleResize = () => {
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    width,
    height,
    speed,
    intensity,
    particleCount,
    baseColor,
    highlightColor,
    shadowColor,
    isActive,
  ]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
