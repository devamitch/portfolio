import { motion } from "framer-motion";

const OrbsOverlay = () => {
  return (
    <>
      <div className="noise-overlay" />

      {/* Ambient orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {[
          { x: "5%", y: "10%", s: 500, d: 0 },
          { x: "72%", y: "50%", s: 350, d: 4 },
          { x: "40%", y: "85%", s: 280, d: 8 },
        ].map((o, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{
              duration: 9 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: o.d,
            }}
            style={{
              position: "absolute",
              left: o.x,
              top: o.y,
              width: o.s,
              height: o.s,
              background:
                "radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)",
              filter: "blur(80px)",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </>
  );
};

export default OrbsOverlay;
