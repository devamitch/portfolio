"use client";

import { useEffect, useRef } from "react";

interface VenomExpansionProps {
  isExpanding: boolean;
  position: "bottom-right" | "bottom-left";
  onComplete?: () => void;
}

export function VenomExpansion({
  isExpanding,
  position,
  onComplete,
}: VenomExpansionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    // Starting position based on prop
    const startX = position === "bottom-right" ? w - 70 : 70;
    const startY = h - 70;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      life: number;
      angle: number;
      speed: number;
    }

    const particles: Particle[] = [];

    // Create explosive burst pattern
    const particleCount = isExpanding ? 50 : 35;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 12 + 6;
      const spread = isExpanding ? 1 : 0.5;

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed * spread * (isExpanding ? 1 : -1),
        vy: Math.sin(angle) * speed * spread * (isExpanding ? 1 : -1),
        r: Math.random() * 40 + 20,
        life: 1,
        angle,
        speed,
      });
    }

    // Add secondary wave for more organic feel
    if (isExpanding) {
      setTimeout(() => {
        for (let i = 0; i < 25; i++) {
          const angle = (Math.PI * 2 * i) / 25 + 0.3;
          const speed = Math.random() * 8 + 4;

          particles.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 30 + 15,
            life: 1,
            angle,
            speed,
          });
        }
      }, 150);
    }

    let frame = 0;
    const maxFrames = isExpanding ? 60 : 40;
    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;

      // Clear with slight trail effect
      ctx.fillStyle = "rgba(3, 3, 3, 0.2)";
      ctx.fillRect(0, 0, w, h);

      // Apply metaball shader effect
      ctx.filter = "blur(25px) contrast(4) brightness(1.2)";

      particles.forEach((p, i) => {
        // Update physics
        p.x += p.vx;
        p.y += p.vy;

        // Organic slowdown
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Gravity for expansion, anti-gravity for contraction
        if (isExpanding) {
          p.vy += 0.5; // Stronger gravity
          p.r += 2; // Expand faster
        } else {
          p.vy -= 0.3;
          p.r -= 1.2;
        }

        // Fade out
        p.life -= isExpanding ? 0.015 : 0.022;

        // Remove dead particles
        if (p.life <= 0 || p.r <= 0) {
          particles.splice(i, 1);
          return;
        }

        // Draw particle with radial gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);

        // Gold liquid colors
        gradient.addColorStop(0, `rgba(251, 246, 186, ${p.life * 0.9})`); // Bright gold center
        gradient.addColorStop(0.3, `rgba(212, 175, 55, ${p.life * 0.7})`); // Mid gold
        gradient.addColorStop(0.6, `rgba(191, 149, 63, ${p.life * 0.4})`); // Dark gold
        gradient.addColorStop(1, "rgba(140, 98, 24, 0)"); // Fade to transparent

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Add connecting tendrils between nearby particles
        particles.forEach((p2, j) => {
          if (j <= i) return;

          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150 && dist > 20) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 150) * p.life * 0.3})`;
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        });
      });

      // Reset filter for next frame
      ctx.filter = "none";

      frame++;

      if (frame < maxFrames && particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        console.log("[Venom] Animation complete");
        onComplete?.();
      }
    }

    console.log(
      `[Venom] Starting ${isExpanding ? "EXPANSION" : "CONTRACTION"} animation`,
    );
    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isExpanding, position, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8999,
        pointerEvents: "none",
        background: "rgba(3, 3, 3, 0.3)", // Subtle dark overlay
        opacity: 1,
        animation: "venomFade 0.3s ease-in-out",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <style>{`
        @keyframes venomFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
