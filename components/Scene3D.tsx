"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Section configurations for each section of the portfolio ──
const SECTION_SCENES = {
  hero: {
    cameraPos: [0, 0, 6],
    geometry: "hero", // Large torus + particles + name aura
    color: new THREE.Color(0xc9a84c),
    desc: "Floating architect symbol",
  },
  about: {
    cameraPos: [2, 0, 5],
    geometry: "atom", // Orbiting spheres like molecular structure
    color: new THREE.Color(0xf5c842),
    desc: "Molecular / atomic structure",
  },
  work: {
    cameraPos: [-1, 0.5, 5.5],
    geometry: "cubes", // Floating geometric building blocks
    color: new THREE.Color(0xdaa520),
    desc: "Building blocks = projects",
  },
  experience: {
    cameraPos: [1.5, 0, 5],
    geometry: "timeline", // Vertical spine with orbital nodes
    color: new THREE.Color(0xc9a84c),
    desc: "Career timeline nodes",
  },
  skills: {
    cameraPos: [0, 0, 5],
    geometry: "radar", // Rotating octahedron / wireframe sphere
    color: new THREE.Color(0xf5c842),
    desc: "Tech skill web/radar",
  },
  story: {
    cameraPos: [0, 1, 5.5],
    geometry: "helix", // DNA-like double helix
    color: new THREE.Color(0xdaa520),
    desc: "Story / journey helix",
  },
  contact: {
    cameraPos: [0, -0.5, 6],
    geometry: "orbit", // Simple elegant orbit + glow
    color: new THREE.Color(0xc9a84c),
    desc: "Connection orbit",
  },
};

type SectionKey = keyof typeof SECTION_SCENES;

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef = useRef<number>(0);
  const currentSectionRef = useRef<SectionKey>("hero");
  const targetCamRef = useRef({ x: 0, y: 0, z: 6 });
  const currentCamRef = useRef({ x: 0, y: 0, z: 6 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const transitionRef = useRef(0); // 0→1 during section transitions
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── Camera ────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xfff5dd, 1.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);
    const goldPoint = new THREE.PointLight(0xc9a84c, 2.5, 18);
    goldPoint.position.set(-3, 2, 4);
    scene.add(goldPoint);

    // ── Main group ────────────────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);
    meshGroupRef.current = group;

    // ── Build all section geometries (all in scene, toggled visible) ──
    const meshes: Record<string, THREE.Object3D[]> = {};

    const GOLD = 0xc9a84c;
    const GOLDF = new THREE.MeshPhongMaterial({
      color: GOLD,
      shininess: 80,
      transparent: true,
      opacity: 0.92,
    });
    const GOLDW = new THREE.MeshBasicMaterial({
      color: GOLD,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const LINE_MAT = new THREE.LineBasicMaterial({
      color: GOLD,
      transparent: true,
      opacity: 0.4,
    });

    // Helper: make visible
    const show = (key: SectionKey) => {
      Object.entries(meshes).forEach(([k, objs]) => {
        objs.forEach((o) => {
          o.visible = k === key;
        });
      });
    };

    // ────── HERO scene: torus + particle cloud ──────
    {
      const objs: THREE.Object3D[] = [];
      // Morphing torus
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(1.6, 0.38, 64, 128),
        new THREE.MeshPhongMaterial({
          color: GOLD,
          shininess: 100,
          transparent: true,
          opacity: 0.88,
        }),
      );
      group.add(torus);
      objs.push(torus);
      // Wireframe overlay
      const torusW = new THREE.Mesh(
        new THREE.TorusGeometry(1.62, 0.41, 24, 64),
        new THREE.MeshBasicMaterial({
          color: GOLD,
          wireframe: true,
          transparent: true,
          opacity: 0.1,
        }),
      );
      group.add(torusW);
      objs.push(torusW);
      // Inner icosahedron
      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 1),
        new THREE.MeshPhongMaterial({
          color: 0xf5c842,
          shininess: 120,
          transparent: true,
          opacity: 0.7,
        }),
      );
      group.add(ico);
      objs.push(ico);
      // Particles
      const pGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(900);
      for (let i = 0; i < 900; i += 3) {
        pPositions[i] = (Math.random() - 0.5) * 9;
        pPositions[i + 1] = (Math.random() - 0.5) * 9;
        pPositions[i + 2] = (Math.random() - 0.5) * 9;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: GOLD,
          size: 0.04,
          transparent: true,
          opacity: 0.55,
        }),
      );
      group.add(particles);
      objs.push(particles);
      meshes["hero"] = objs;
    }

    // ────── ABOUT: Atomic orbital structure ──────
    {
      const objs: THREE.Object3D[] = [];
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 32, 32),
        GOLDF.clone(),
      );
      group.add(nucleus);
      objs.push(nucleus);
      // Orbital rings with orbiting spheres
      const orbitData = [
        { radius: 1.4, tilt: 0, speed: 1.2 },
        { radius: 2.0, tilt: Math.PI / 3, speed: 0.8 },
        { radius: 2.6, tilt: -Math.PI / 5, speed: 0.5 },
      ];
      orbitData.forEach((od) => {
        const ringGeo = new THREE.TorusGeometry(od.radius, 0.015, 8, 80);
        const ring = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.22,
          }),
        );
        ring.rotation.x = Math.PI / 2 + od.tilt;
        group.add(ring);
        objs.push(ring);
        // Electron sphere
        const electron = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 16, 16),
          new THREE.MeshPhongMaterial({
            color: 0xf5c842,
            shininess: 120,
            transparent: true,
            opacity: 0.9,
          }),
        );
        // Store orbit parameters on userData
        electron.userData = { orbit: od };
        group.add(electron);
        objs.push(electron);
      });
      meshes["about"] = objs;
    }

    // ────── WORK: Floating geometric building blocks ──────
    {
      const objs: THREE.Object3D[] = [];
      const shapes = [
        {
          geo: new THREE.BoxGeometry(0.8, 0.8, 0.8),
          pos: [-1.5, 1, 0],
          rot: [0.3, 0.5, 0],
        },
        {
          geo: new THREE.OctahedronGeometry(0.6),
          pos: [1.2, 0.4, -0.5],
          rot: [0.1, 0.8, 0],
        },
        {
          geo: new THREE.TetrahedronGeometry(0.7),
          pos: [-0.4, -1.2, 0.3],
          rot: [0.5, 0.2, 0.1],
        },
        {
          geo: new THREE.BoxGeometry(0.5, 0.5, 0.5),
          pos: [1.6, -0.8, 0.4],
          rot: [0.7, 0.3, 0],
        },
        {
          geo: new THREE.IcosahedronGeometry(0.45, 0),
          pos: [0.2, 1.6, -0.3],
          rot: [0.2, 0.6, 0.3],
        },
        {
          geo: new THREE.BoxGeometry(1, 0.35, 0.35),
          pos: [-1.0, -0.5, 0.5],
          rot: [0.4, 0.1, 0.7],
        },
      ];
      shapes.forEach((s) => {
        const mat = new THREE.MeshPhongMaterial({
          color: GOLD,
          shininess: 80,
          transparent: true,
          opacity: 0.78,
        });
        const mesh = new THREE.Mesh(s.geo, mat);
        mesh.position.set(s.pos[0]!, s.pos[1]!, s.pos[2]!);
        mesh.rotation.set(s.rot[0]!, s.rot[1]!, s.rot[2]!);
        group.add(mesh);
        objs.push(mesh);
        const wf = new THREE.Mesh(
          s.geo.clone(),
          new THREE.MeshBasicMaterial({
            color: GOLD,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
          }),
        );
        wf.position.copy(mesh.position);
        wf.rotation.copy(mesh.rotation);
        group.add(wf);
        objs.push(wf);
      });
      meshes["work"] = objs;
    }

    // ────── EXPERIENCE: Timeline spine + orbital nodes ──────
    {
      const objs: THREE.Object3D[] = [];
      // Vertical spine line
      const spineGeo = new THREE.BufferGeometry();
      const spinePts: number[] = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        spinePts.push(0, -2.5 + t * 5, Math.sin(t * Math.PI * 2) * 0.15);
      }
      spineGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(spinePts), 3),
      );
      const spine = new THREE.Line(spineGeo, LINE_MAT.clone());
      group.add(spine);
      objs.push(spine);
      // Timeline nodes
      const nodeYears = [-2, -0.8, 0.4, 1.2, 2.2];
      nodeYears.forEach((y, i) => {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 20, 20),
          new THREE.MeshPhongMaterial({
            color: GOLD,
            shininess: 120,
            transparent: true,
            opacity: 0.9,
          }),
        );
        node.position.set(0, y, 0);
        group.add(node);
        objs.push(node);
        // Orbit ring around node
        const orbitGeo = new THREE.TorusGeometry(0.5 + i * 0.12, 0.01, 6, 40);
        const orbit = new THREE.Mesh(
          orbitGeo,
          new THREE.MeshBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.18,
          }),
        );
        orbit.position.set(0, y, 0);
        orbit.rotation.x = Math.PI / 2;
        group.add(orbit);
        objs.push(orbit);
        // Connect line
        const linkGeo = new THREE.BufferGeometry();
        linkGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([0, y, 0, 0.7 + i * 0.1, y, 0]),
            3,
          ),
        );
        const link = new THREE.Line(
          linkGeo,
          new THREE.LineBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.25,
          }),
        );
        group.add(link);
        objs.push(link);
      });
      meshes["experience"] = objs;
    }

    // ────── SKILLS: Radar / wireframe sphere ──────
    {
      const objs: THREE.Object3D[] = [];
      // Concentric wireframe spheres
      [1, 1.7, 2.4].forEach((r, i) => {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(r, 16, 16),
          new THREE.MeshBasicMaterial({
            color: GOLD,
            wireframe: true,
            transparent: true,
            opacity: 0.12 - i * 0.03,
          }),
        );
        group.add(s);
        objs.push(s);
      });
      // Central octahedron
      const oct = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.7, 1),
        new THREE.MeshPhongMaterial({
          color: GOLD,
          shininess: 100,
          transparent: true,
          opacity: 0.85,
        }),
      );
      group.add(oct);
      objs.push(oct);
      // Radar arms
      const ARMS = 8;
      for (let i = 0; i < ARMS; i++) {
        const angle = (i / ARMS) * Math.PI * 2;
        const r = 1.5 + Math.random() * 0.8;
        const armGeo = new THREE.BufferGeometry();
        armGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([
              0,
              0,
              0,
              Math.cos(angle) * r,
              Math.sin(angle) * r * 0.5,
              Math.sin(angle * 0.7) * 0.3,
            ]),
            3,
          ),
        );
        const arm = new THREE.Line(
          armGeo,
          new THREE.LineBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.3,
          }),
        );
        group.add(arm);
        objs.push(arm);
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 8, 8),
          new THREE.MeshPhongMaterial({
            color: 0xf5c842,
            transparent: true,
            opacity: 0.9,
          }),
        );
        dot.position.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r * 0.5,
          Math.sin(angle * 0.7) * 0.3,
        );
        group.add(dot);
        objs.push(dot);
      }
      meshes["skills"] = objs;
    }

    // ────── STORY: Double helix ──────
    {
      const objs: THREE.Object3D[] = [];
      const HELIX_STEPS = 40;
      const helixGeo1 = new THREE.BufferGeometry();
      const helixGeo2 = new THREE.BufferGeometry();
      const pts1: number[] = [],
        pts2: number[] = [];
      for (let i = 0; i <= HELIX_STEPS; i++) {
        const t = (i / HELIX_STEPS) * Math.PI * 4;
        const y = -2.5 + (i / HELIX_STEPS) * 5;
        const r = 0.9;
        pts1.push(Math.cos(t) * r, y, Math.sin(t) * r);
        pts2.push(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r);
      }
      helixGeo1.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(pts1), 3),
      );
      helixGeo2.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(pts2), 3),
      );
      const h1 = new THREE.Line(
        helixGeo1,
        new THREE.LineBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: 0.55,
        }),
      );
      const h2 = new THREE.Line(
        helixGeo2,
        new THREE.LineBasicMaterial({
          color: 0xf5c842,
          transparent: true,
          opacity: 0.55,
        }),
      );
      group.add(h1);
      objs.push(h1);
      group.add(h2);
      objs.push(h2);
      // Rungs
      for (let i = 0; i <= HELIX_STEPS; i += 3) {
        const t = (i / HELIX_STEPS) * Math.PI * 4;
        const y = -2.5 + (i / HELIX_STEPS) * 5;
        const r = 0.9;
        const rungGeo = new THREE.BufferGeometry();
        rungGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([
              Math.cos(t) * r,
              y,
              Math.sin(t) * r,
              Math.cos(t + Math.PI) * r,
              y,
              Math.sin(t + Math.PI) * r,
            ]),
            3,
          ),
        );
        const rung = new THREE.Line(
          rungGeo,
          new THREE.LineBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.18,
          }),
        );
        group.add(rung);
        objs.push(rung);
        // Node spheres
        [t, t + Math.PI].forEach((angle) => {
          const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 10, 10),
            new THREE.MeshPhongMaterial({
              color: GOLD,
              transparent: true,
              opacity: 0.85,
            }),
          );
          node.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
          group.add(node);
          objs.push(node);
        });
      }
      meshes["story"] = objs;
    }

    // ────── CONTACT: Elegant orbit ──────
    {
      const objs: THREE.Object3D[] = [];
      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 32, 32),
        new THREE.MeshPhongMaterial({
          color: GOLD,
          shininess: 140,
          transparent: true,
          opacity: 0.92,
        }),
      );
      group.add(center);
      objs.push(center);
      [1.2, 2.0, 2.8].forEach((r, i) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.018, 8, 80),
          new THREE.MeshBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.2 - i * 0.05,
          }),
        );
        ring.rotation.x = Math.PI / 2 + i * 0.4;
        group.add(ring);
        objs.push(ring);
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 14, 14),
          new THREE.MeshPhongMaterial({
            color: 0xf5c842,
            shininess: 120,
            transparent: true,
            opacity: 0.9,
          }),
        );
        dot.userData = {
          orbitR: r,
          orbitTilt: i * 0.4,
          orbitSpeed: 0.6 + i * 0.3,
        };
        group.add(dot);
        objs.push(dot);
      });
      meshes["contact"] = objs;
    }

    // Start with hero
    show("hero");

    // ── Section observer ──────────────────────────────────────
    const SECTION_MAP: Record<string, SectionKey> = {
      hero: "hero",
      about: "about",
      work: "work",
      experience: "experience",
      skills: "skills",
      story: "story",
      contact: "contact",
      github: "contact",
      testimonials: "contact",
      blog: "contact",
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const best = visible.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b,
        );
        const id = best.target.id;
        const key = SECTION_MAP[id] ?? "hero";
        if (key !== currentSectionRef.current) {
          currentSectionRef.current = key;
          const cfg = SECTION_SCENES[key];
          targetCamRef.current = {
            x: cfg.cameraPos[0]!,
            y: cfg.cameraPos[1]!,
            z: cfg.cameraPos[2]!,
          };
          show(key);
          transitionRef.current = 0;
        }
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0.1 },
    );

    [
      "hero",
      "about",
      "work",
      "experience",
      "skills",
      "story",
      "github",
      "testimonials",
      "contact",
      "blog",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // ── Mouse parallax ────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const dt = clockRef.current.getDelta();

      // Lerp camera
      const LERP = 0.025;
      currentCamRef.current.x +=
        (targetCamRef.current.x - currentCamRef.current.x) * LERP;
      currentCamRef.current.y +=
        (targetCamRef.current.y - currentCamRef.current.y) * LERP;
      currentCamRef.current.z +=
        (targetCamRef.current.z - currentCamRef.current.z) * LERP;

      const mouse = mousePosRef.current;
      camera.position.set(
        currentCamRef.current.x + mouse.x * 0.3,
        currentCamRef.current.y + mouse.y * 0.2,
        currentCamRef.current.z,
      );
      camera.lookAt(0, 0, 0);

      // Animate group
      group.rotation.y = t * 0.08 + mouse.x * 0.25;
      group.rotation.x = Math.sin(t * 0.12) * 0.08 + mouse.y * 0.12;

      // Section-specific animations
      const section = currentSectionRef.current;
      const sectionMeshes = meshes[section] ?? [];

      if (section === "hero") {
        // Torus vertex morph
        const torus = sectionMeshes[0] as THREE.Mesh;
        if (torus?.geometry instanceof THREE.BufferGeometry) {
          const pos = torus.geometry.attributes
            .position as THREE.BufferAttribute;
          const orig = (torus.geometry as any).__origPos as
            | Float32Array
            | undefined;
          if (!orig) {
            (torus.geometry as any).__origPos = pos.array.slice();
          } else {
            for (let i = 0; i < pos.count; i++) {
              const ix = i * 3;
              const noise =
                Math.sin(orig[ix]! * 2 + t) *
                Math.cos(orig[ix + 1]! * 2 + t * 0.7) *
                0.08;
              pos.array[ix] = orig[ix]! + noise;
              pos.array[ix + 1] = orig[ix + 1]! + noise * 0.8;
            }
            pos.needsUpdate = true;
          }
        }
        // Ico rotate
        const ico = sectionMeshes[2] as THREE.Mesh;
        if (ico) {
          ico.rotation.y = t * 0.9;
          ico.rotation.x = t * 0.5;
        }
        // Particles drift
        const particles = sectionMeshes[3] as THREE.Points;
        if (particles) particles.rotation.y = t * 0.025;
      }

      if (section === "about") {
        sectionMeshes.forEach((obj) => {
          if (obj.userData?.orbit) {
            const od = obj.userData.orbit;
            const angle = t * od.speed;
            obj.position.set(
              Math.cos(angle + od.tilt) * od.radius,
              Math.sin(od.tilt * 2) * 0.4,
              Math.sin(angle + od.tilt) * od.radius * 0.6,
            );
          }
        });
      }

      if (section === "work") {
        sectionMeshes.forEach((obj, i) => {
          obj.rotation.x += 0.003 + i * 0.001;
          obj.rotation.y += 0.005 + i * 0.001;
          (obj as THREE.Mesh).position.y =
            ((obj as THREE.Mesh).position.y || 0) + Math.sin(t + i) * 0.001;
        });
      }

      if (section === "experience") {
        sectionMeshes.forEach((obj, i) => {
          if (obj.type === "Mesh" && i > 0) {
            obj.rotation.y = t * (0.5 + i * 0.1);
          }
        });
      }

      if (section === "skills") {
        const oct = sectionMeshes[3] as THREE.Mesh;
        if (oct) {
          oct.rotation.y = t * 0.6;
          oct.rotation.x = t * 0.4;
        }
        sectionMeshes.slice(0, 3).forEach((s, i) => {
          s.rotation.y = t * (0.12 + i * 0.05);
        });
      }

      if (section === "story") {
        group.rotation.y = t * 0.05;
      }

      if (section === "contact") {
        sectionMeshes.forEach((obj) => {
          if (obj.userData?.orbitR) {
            const angle = t * obj.userData.orbitSpeed;
            const tilt = obj.userData.orbitTilt;
            obj.position.set(
              Math.cos(angle) * obj.userData.orbitR,
              Math.sin(angle) * obj.userData.orbitR * Math.sin(tilt),
              Math.sin(angle) * obj.userData.orbitR * Math.cos(tilt),
            );
          }
        });
        // Pulse center
        const center = sectionMeshes[0] as THREE.Mesh;
        if (center) {
          const pulse = 1 + 0.08 * Math.sin(t * 2.5);
          center.scale.setScalar(pulse);
        }
      }

      // Gold point light orbit
      goldPoint.position.set(
        Math.cos(t * 0.4) * 4,
        Math.sin(t * 0.28) * 2.5,
        Math.sin(t * 0.4) * 3,
      );
      goldPoint.intensity = 2 + Math.sin(t * 1.5) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      sectionObserver.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "40vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.82,
      }}
    />
  );
}
