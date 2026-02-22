import { useEffect, useRef } from "react";

// ── AURA Living Plasma Orb ──────────────────────────────────────────────────
// Concept: Sentient plasma core - aurora borealis trapped in dark glass
// Colors: Gold + deep crimson + electric teal plasma tendrils
// Physics: Multi-layer fluid simulation, particle consciousness, 3D sphere illusion

export function LiquidGoldAnimation() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030305",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', monospace",
        gap: 40,
        padding: 40,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.4em",
            color: "rgba(201,168,76,0.4)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          AURA — Adaptive Universal Response Agent
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          click to expand · hover to feel
        </div>
      </div>

      {/* THE ORB */}
      <SentientAURAOrb />

      {/* State label */}
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(201,168,76,0.3)",
          textTransform: "uppercase",
        }}
      >
        Principal Mobile Architect · Web3 · AI Systems
      </div>
    </div>
  );
}

// ── Core Orb Component ─────────────────────────────────────────────────────
export function SentientAURAOrb({ hasHistory = false }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const stateRef = useRef({
    t: 0,
    mouseX: 0,
    mouseY: 0,
    hovered: false,
    clicked: false,
    energy: 0, // 0-1 energy level
    pulsePhase: 0,
    particles: [],
    tendrils: [],
    innerBlobs: [],
  });

  const SIZE = 180;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 72;

  // Initialize particles & inner blobs
  useEffect(() => {
    const s = stateRef.current;

    // Orbital consciousness particles
    s.particles = Array.from({ length: 60 }, (_, i) => ({
      angle: (i / 60) * Math.PI * 2,
      orbitR: R * 0.55 + Math.random() * R * 0.45,
      orbitTilt: (Math.random() - 0.5) * 0.8,
      orbitSpeed: 0.003 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.8,
      opacity: 0.3 + Math.random() * 0.7,
      hue: 38 + (Math.random() - 0.5) * 30, // gold to amber
      layer:
        Math.random() < 0.3 ? "front" : Math.random() < 0.5 ? "mid" : "back",
    }));

    // Inner plasma blobs (the "mind")
    s.innerBlobs = Array.from({ length: 5 }, (_, i) => ({
      angle: (i / 5) * Math.PI * 2,
      r: R * (0.15 + Math.random() * 0.3),
      speed: 0.007 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      hue: i % 2 === 0 ? 38 : i % 3 === 0 ? 175 : 320, // gold, teal, crimson
      size: R * (0.25 + Math.random() * 0.35),
    }));

    // Tendrils (living arms)
    s.tendrils = Array.from({ length: 8 }, (_, i) => ({
      baseAngle: (i / 8) * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.012 + Math.random() * 0.008,
      length: R * (0.3 + Math.random() * 0.5),
      width: 0.8 + Math.random() * 1.2,
      hue: Math.random() < 0.5 ? 38 : 175,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = SIZE;
    canvas.height = SIZE;

    const draw = () => {
      const s = stateRef.current;
      s.t++;
      s.pulsePhase += 0.025;

      // Energy auto-breathe
      s.energy =
        0.4 +
        Math.sin(s.pulsePhase * 0.7) * 0.15 +
        (s.hovered ? 0.25 : 0) +
        (s.clicked ? 0.2 : 0);
      s.energy = Math.min(1, s.energy);

      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── 1. DEEP SPACE AMBIENT ────────────────────────────────────────
      const ambient = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.4);
      ambient.addColorStop(0, `rgba(201,140,30,${0.04 * s.energy})`);
      ambient.addColorStop(0.5, `rgba(120,60,20,${0.02 * s.energy})`);
      ambient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // ── 2. BACK-LAYER PARTICLES ──────────────────────────────────────
      s.particles
        .filter((p) => p.layer === "back")
        .forEach((p) => {
          p.angle += p.orbitSpeed;
          const x = CX + Math.cos(p.angle) * p.orbitR * Math.cos(p.orbitTilt);
          const y = CY + Math.sin(p.angle) * p.orbitR;
          const depth = (Math.cos(p.angle) * Math.cos(p.orbitTilt) + 1) / 2;
          if (depth < 0.5) {
            // only back particles
            ctx.beginPath();
            ctx.arc(x, y, p.size * depth * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},80%,65%,${p.opacity * depth * 0.4 * s.energy})`;
            ctx.fill();
          }
        });

      // ── 3. SPHERE GLASS BASE ─────────────────────────────────────────
      // Dark glass exterior
      const glassBg = ctx.createRadialGradient(
        CX - R * 0.2,
        CY - R * 0.25,
        R * 0.05,
        CX,
        CY,
        R,
      );
      glassBg.addColorStop(0, "rgba(18,14,8,0.97)");
      glassBg.addColorStop(0.6, "rgba(8,6,3,0.98)");
      glassBg.addColorStop(1, "rgba(2,1,0,0.99)");

      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = glassBg;
      ctx.fill();

      // ── 4. INNER PLASMA (The Mind) ───────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R - 1, 0, Math.PI * 2);
      ctx.clip();

      s.innerBlobs.forEach((blob, idx) => {
        blob.angle += blob.speed + s.energy * 0.008;
        const bx =
          CX +
          Math.cos(blob.angle + blob.phase) *
            blob.r *
            (1 + Math.sin(s.t * 0.02 + idx) * 0.3);
        const by =
          CY +
          Math.sin(blob.angle * 1.3 + blob.phase) *
            blob.r *
            (1 + Math.cos(s.t * 0.017 + idx) * 0.25);

        const plasmaR =
          blob.size *
          (0.85 + Math.sin(s.t * 0.035 + idx * 1.3) * 0.2) *
          s.energy;

        const plasma = ctx.createRadialGradient(bx, by, 0, bx, by, plasmaR);
        const alpha = 0.18 + s.energy * 0.22;

        if (blob.hue === 38) {
          // gold plasma
          plasma.addColorStop(0, `rgba(255,200,60,${alpha * 1.4})`);
          plasma.addColorStop(0.3, `rgba(201,140,30,${alpha})`);
          plasma.addColorStop(0.7, `rgba(160,80,10,${alpha * 0.4})`);
          plasma.addColorStop(1, "rgba(0,0,0,0)");
        } else if (blob.hue === 175) {
          // teal plasma
          plasma.addColorStop(0, `rgba(60,220,200,${alpha * 0.6})`);
          plasma.addColorStop(0.4, `rgba(20,160,140,${alpha * 0.35})`);
          plasma.addColorStop(1, "rgba(0,0,0,0)");
        } else {
          // crimson plasma
          plasma.addColorStop(0, `rgba(220,60,80,${alpha * 0.5})`);
          plasma.addColorStop(0.4, `rgba(160,30,50,${alpha * 0.25})`);
          plasma.addColorStop(1, "rgba(0,0,0,0)");
        }

        ctx.fillStyle = plasma;
        ctx.beginPath();
        ctx.arc(bx, by, plasmaR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Inner core consciousness glow
      const coreGlow = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 0.5);
      coreGlow.addColorStop(0, `rgba(255,210,80,${0.12 + s.energy * 0.15})`);
      coreGlow.addColorStop(0.5, `rgba(201,140,30,${0.06 + s.energy * 0.06})`);
      coreGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Plasma turbulence lines
      for (let i = 0; i < 3; i++) {
        const lineAngle =
          s.t * 0.008 * (i % 2 === 0 ? 1 : -1) + (i * Math.PI * 2) / 3;
        const x1 = CX + Math.cos(lineAngle) * R * 0.1;
        const y1 = CY + Math.sin(lineAngle) * R * 0.1;
        const x2 = CX + Math.cos(lineAngle + 0.5) * R * 0.6;
        const y2 = CY + Math.sin(lineAngle + 0.5) * R * 0.6;

        const lineGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        lineGrad.addColorStop(0, `rgba(255,200,60,${0.08 * s.energy})`);
        lineGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(
          CX + Math.cos(lineAngle + 0.25) * R * 0.3,
          CY + Math.sin(lineAngle + 0.25) * R * 0.35,
          x2,
          y2,
        );
        ctx.stroke();
      }

      ctx.restore();

      // ── 5. TENDRILS (Living Arms reaching outward) ───────────────────
      s.tendrils.forEach((t) => {
        t.phase += t.speed;
        const angle = t.baseAngle + Math.sin(t.phase) * 0.4;
        const extR =
          R + t.length * s.energy * (0.4 + Math.sin(t.phase * 1.3) * 0.3);

        const tx1 = CX + Math.cos(angle) * R * 0.95;
        const ty1 = CY + Math.sin(angle) * R * 0.95;
        const tx2 = CX + Math.cos(angle + Math.sin(t.phase) * 0.3) * extR;
        const ty2 = CY + Math.sin(angle + Math.sin(t.phase) * 0.3) * extR;

        const tendGrad = ctx.createLinearGradient(tx1, ty1, tx2, ty2);
        if (t.hue === 38) {
          tendGrad.addColorStop(0, `rgba(201,168,76,${0.5 * s.energy})`);
          tendGrad.addColorStop(0.6, `rgba(201,140,30,${0.15 * s.energy})`);
          tendGrad.addColorStop(1, "rgba(201,140,30,0)");
        } else {
          tendGrad.addColorStop(0, `rgba(40,200,180,${0.35 * s.energy})`);
          tendGrad.addColorStop(0.6, `rgba(20,150,130,${0.1 * s.energy})`);
          tendGrad.addColorStop(1, "rgba(0,0,0,0)");
        }

        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.quadraticCurveTo(
          CX + Math.cos(angle + 0.2) * (R + extR) * 0.45,
          CY + Math.sin(angle + 0.2) * (R + extR) * 0.45,
          tx2,
          ty2,
        );
        ctx.strokeStyle = tendGrad;
        ctx.lineWidth = t.width * s.energy;
        ctx.stroke();

        // Tendril tip particle
        ctx.beginPath();
        ctx.arc(tx2, ty2, 1.2 * s.energy, 0, Math.PI * 2);
        ctx.fillStyle =
          t.hue === 38
            ? `rgba(255,220,100,${0.6 * s.energy})`
            : `rgba(60,220,200,${0.5 * s.energy})`;
        ctx.fill();
      });

      // ── 6. GLASS SPHERE RIM (3D illusion) ───────────────────────────
      // Outer chromatic rim
      const rimGrad = ctx.createRadialGradient(CX, CY, R * 0.82, CX, CY, R);
      rimGrad.addColorStop(0, "rgba(0,0,0,0)");
      rimGrad.addColorStop(0.6, `rgba(201,168,76,${0.08 + s.energy * 0.05})`);
      rimGrad.addColorStop(0.85, `rgba(201,168,76,${0.2 + s.energy * 0.1})`);
      rimGrad.addColorStop(1, `rgba(180,140,50,${0.12 + s.energy * 0.08})`);

      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // Sphere stroke
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,168,76,${0.18 + s.energy * 0.2})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(CX, CY, R + 1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,140,30,${0.06 + s.energy * 0.1})`;
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(CX, CY, R + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,140,30,${0.02 + s.energy * 0.04})`;
      ctx.lineWidth = 10;
      ctx.stroke();

      // ── 7. FRONT-LAYER PARTICLES ─────────────────────────────────────
      s.particles
        .filter((p) => p.layer !== "back")
        .forEach((p) => {
          const x = CX + Math.cos(p.angle) * p.orbitR * Math.cos(p.orbitTilt);
          const y = CY + Math.sin(p.angle) * p.orbitR;
          const depth = (Math.cos(p.angle) * Math.cos(p.orbitTilt) + 1) / 2;

          if (depth >= 0.5) {
            const screenSize = p.size * (0.5 + depth * 0.8);
            ctx.beginPath();
            ctx.arc(x, y, screenSize, 0, Math.PI * 2);

            const particleGlow = ctx.createRadialGradient(
              x,
              y,
              0,
              x,
              y,
              screenSize * 2.5,
            );
            particleGlow.addColorStop(
              0,
              `hsla(${p.hue},90%,75%,${p.opacity * depth * s.energy})`,
            );
            particleGlow.addColorStop(1, `hsla(${p.hue},80%,60%,0)`);
            ctx.fillStyle = particleGlow;
            ctx.fill();

            // core bright point
            ctx.beginPath();
            ctx.arc(x, y, screenSize * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},100%,90%,${p.opacity * depth * 0.8 * s.energy})`;
            ctx.fill();
          }
        });

      // ── 8. GLASS SPECULAR HIGHLIGHTS ────────────────────────────────
      // Top highlight (main sphere)
      const hilite = ctx.createRadialGradient(
        CX - R * 0.35,
        CY - R * 0.38,
        0,
        CX - R * 0.25,
        CY - R * 0.28,
        R * 0.55,
      );
      hilite.addColorStop(0, "rgba(255,245,220,0.22)");
      hilite.addColorStop(0.35, "rgba(255,240,200,0.07)");
      hilite.addColorStop(1, "rgba(255,255,255,0)");

      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = hilite;
      ctx.fill();

      // Small secondary caustic
      const caustic = ctx.createRadialGradient(
        CX + R * 0.4,
        CY + R * 0.35,
        0,
        CX + R * 0.4,
        CY + R * 0.35,
        R * 0.22,
      );
      caustic.addColorStop(0, "rgba(201,168,76,0.06)");
      caustic.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = caustic;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // ── 9. AURA TEXT (Bioluminescent emergence) ──────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R - 1, 0, Math.PI * 2);
      ctx.clip();

      // Text glow behind
      const textGlow = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 0.6);
      textGlow.addColorStop(0, `rgba(201,168,76,${0.08 + s.energy * 0.08})`);
      textGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = textGlow;
      ctx.fillRect(CX - R, CY - R, R * 2, R * 2);

      // Main AURA text
      const textPulse =
        0.7 + Math.sin(s.pulsePhase * 1.1) * 0.15 + s.energy * 0.25;
      ctx.font = `800 ${Math.round(13 + s.energy * 2)}px 'Courier New', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.2em";

      // Shadow glow layers
      for (let g = 3; g >= 0; g--) {
        ctx.shadowColor = `rgba(255,200,60,${0.3 * textPulse * (1 - g * 0.2)})`;
        ctx.shadowBlur = 4 + g * 6;
        ctx.fillStyle =
          g === 0
            ? `rgba(255,240,190,${0.9 * textPulse})`
            : `rgba(201,168,76,${0.2 * textPulse * (1 - g * 0.2)})`;
        ctx.fillText("AURA", CX, CY);
      }
      ctx.shadowBlur = 0;

      // Sub-label
      ctx.font = `500 7px 'Courier New', monospace`;
      ctx.fillStyle = `rgba(201,168,76,${0.35 + s.energy * 0.2})`;
      ctx.shadowColor = `rgba(201,168,76,${0.4 * s.energy})`;
      ctx.shadowBlur = 6;
      ctx.fillText("AI ASSISTANT", CX, CY + 16);
      ctx.shadowBlur = 0;

      ctx.restore();

      // ── 10. OUTER ATMOSPHERIC HAZE ───────────────────────────────────
      const haze = ctx.createRadialGradient(CX, CY, R * 0.9, CX, CY, R * 1.5);
      haze.addColorStop(0, "rgba(0,0,0,0)");
      haze.addColorStop(0.4, `rgba(201,130,20,${0.04 * s.energy})`);
      haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // History badge (green consciousness dot)
      if (hasHistory) {
        const badgeX = CX + R * 0.68;
        const badgeY = CY - R * 0.68;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#34D399";
        ctx.shadowColor = "#34D399";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, [hasHistory]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.mouseX = e.clientX - rect.left - CX;
    stateRef.current.mouseY = e.clientY - rect.top - CY;
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Ambient glow behind the orb */}
      <div
        style={{
          position: "absolute",
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,140,30,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.3)",
          animation: "halopulse 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes halopulse {
          0%,100% { opacity: 0.6; transform: scale(1.2); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes orbfloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .aura-orb-wrap {
          animation: orbfloat 4s ease-in-out infinite;
          cursor: pointer;
          transition: filter 0.3s;
        }
        .aura-orb-wrap:hover {
          filter: drop-shadow(0 0 24px rgba(201,168,76,0.4));
        }
        .aura-orb-wrap:active {
          filter: drop-shadow(0 0 40px rgba(255,200,60,0.6));
        }
      `}</style>

      <div
        className="aura-orb-wrap"
        onMouseEnter={() => {
          stateRef.current.hovered = true;
        }}
        onMouseLeave={() => {
          stateRef.current.hovered = false;
          stateRef.current.clicked = false;
        }}
        onMouseDown={() => {
          stateRef.current.clicked = true;
        }}
        onMouseUp={() => {
          setTimeout(() => {
            stateRef.current.clicked = false;
          }, 400);
        }}
        onMouseMove={handleMouseMove}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: SIZE, height: SIZE }}
        />
      </div>

      {/* Status ring indicators */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["LIVE", "AWARE", "READY"].map((label, i) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background:
                  i === 0 ? "#34D399" : i === 1 ? "#C9A84C" : "#60a5fa",
                boxShadow: `0 0 6px ${i === 0 ? "#34D399" : i === 1 ? "#C9A84C" : "#60a5fa"}`,
                animation: `halopulse ${1.5 + i * 0.4}s ease-in-out infinite`,
              }}
            />
            <span
              style={{
                fontSize: 8,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
