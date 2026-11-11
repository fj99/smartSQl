import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { SceneKind } from "../content";

const SIDE = 10;
const COUNT = SIDE * SIDE * SIDE;

type Cloud = Float32Array;

function fillLattice(out: Cloud) {
  let index = 0;
  for (let z = 0; z < SIDE; z += 1) {
    for (let y = 0; y < SIDE; y += 1) {
      for (let x = 0; x < SIDE; x += 1) {
        out[index] = (x / (SIDE - 1) - 0.5) * 2;
        out[index + 1] = (y / (SIDE - 1) - 0.5) * 2;
        out[index + 2] = (z / (SIDE - 1) - 0.5) * 2;
        index += 3;
      }
    }
  }
}

function fillRibbon(out: Cloud) {
  const across = 10;
  const along = COUNT / across;
  let index = 0;
  for (let a = 0; a < along; a += 1) {
    const u = (a / (along - 1)) * Math.PI * 5;
    for (let b = 0; b < across; b += 1) {
      const v = b / (across - 1) - 0.5;
      out[index] = Math.sin(u) * 0.92;
      out[index + 1] = Math.cos(u * 2) * 0.36 + v * Math.cos(u) * 0.62;
      out[index + 2] = Math.cos(u) * 0.8 + v * Math.sin(u) * 0.18;
      index += 3;
    }
  }
}

function fillKnot(out: Cloud) {
  const strands = 10;
  const steps = COUNT / strands;
  const p = 2;
  const q = 3;
  let index = 0;

  for (let step = 0; step < steps; step += 1) {
    const t = (step / steps) * Math.PI * 2;
    const radius = Math.cos(q * t) + 2;
    const cx = radius * Math.cos(p * t);
    const cy = radius * Math.sin(p * t);
    const cz = Math.sin(q * t) * 1.35;
    const next = t + 0.02;
    const nextRadius = Math.cos(q * next) + 2;
    const tx = nextRadius * Math.cos(p * next) - cx;
    const ty = nextRadius * Math.sin(p * next) - cy;
    const tz = Math.sin(q * next) * 1.35 - cz;
    const length = Math.hypot(tx, ty, tz) || 1;
    const nx = tx / length;
    const ny = ty / length;
    const nz = tz / length;
    const px = -ny;
    const py = nx;
    const pz = 0;
    const pLength = Math.hypot(px, py, pz) || 1;
    const bx = px / pLength;
    const by = py / pLength;
    const bz = pz / pLength;
    const cxn = ny * bz - nz * by;
    const cyn = nz * bx - nx * bz;
    const czn = nx * by - ny * bx;

    for (let strand = 0; strand < strands; strand += 1) {
      const angle = (strand / strands) * Math.PI * 2;
      const tube = 0.34;
      const ox = (bx * Math.cos(angle) + cxn * Math.sin(angle)) * tube;
      const oy = (by * Math.cos(angle) + cyn * Math.sin(angle)) * tube;
      const oz = (bz * Math.cos(angle) + czn * Math.sin(angle)) * tube;
      out[index] = (cx + ox) * 0.42;
      out[index + 1] = (cy + oy) * 0.42;
      out[index + 2] = (cz + oz) * 0.42;
      index += 3;
    }
  }
}

function normalize(data: Cloud) {
  let max = 0.0001;
  for (let i = 0; i < COUNT; i += 1) {
    const radius = Math.hypot(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
    if (radius > max) max = radius;
  }
  const scale = 0.96 / max;
  for (let i = 0; i < data.length; i += 1) data[i] *= scale;
}

function makeCloud(fill: (out: Cloud) => void) {
  const cloud = new Float32Array(COUNT * 3);
  fill(cloud);
  normalize(cloud);
  return cloud;
}

const TARGETS: Record<SceneKind, Cloud> = {
  lattice: makeCloud(fillLattice),
  ribbon: makeCloud(fillRibbon),
  knot: makeCloud(fillKnot),
};

function hexToRgb(hex: string): [number, number, number] {
  const stripped = hex.replace("#", "").trim();
  const full =
    stripped.length === 3
      ? stripped
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : stripped;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return [200, 255, 67];
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface ParticleFieldProps {
  scene: SceneKind;
  color: string;
  secondary: string;
  paused: boolean;
  label: string;
}

export function ParticleField({ scene, color, secondary, paused, label }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yaw = useRef(0.55);
  const pitch = useRef(0.38);
  const dragging = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const pausedRef = useRef(paused);
  const sceneRef = useRef(scene);
  const colorRef = useRef(color);
  const secondaryRef = useRef(secondary);
  const reducedRef = useRef(false);
  const positions = useRef(Float32Array.from(TARGETS.lattice));

  pausedRef.current = paused;
  sceneRef.current = scene;
  colorRef.current = color;
  secondaryRef.current = secondary;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMedia = () => {
      reducedRef.current = media.matches;
    };
    onMedia();
    media.addEventListener("change", onMedia);

    const order = Array.from({ length: COUNT }, (_, index) => index);
    const depth = new Float32Array(COUNT);
    const projectedX = new Float32Array(COUNT);
    const projectedY = new Float32Array(COUNT);
    const projectedScale = new Float32Array(COUNT);
    let frame = 0;
    let last = performance.now();
    let clock = 0;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const frozen = pausedRef.current || reducedRef.current;
      if (!frozen) {
        yaw.current += dt * 0.18;
        clock += dt;
      }

      const target = TARGETS[sceneRef.current];
      const current = positions.current;
      const blend = 1 - Math.exp(-3.4 * dt);
      for (let i = 0; i < current.length; i += 1) {
        current[i] += (target[i] - current[i]) * blend;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const cosY = Math.cos(yaw.current);
      const sinY = Math.sin(yaw.current);
      const cosX = Math.cos(pitch.current);
      const sinX = Math.sin(pitch.current);
      const spread = Math.min(width, height) * 0.36;
      const originX = width / 2;
      const originY = height / 2;
      const activeScene = sceneRef.current;

      for (let i = 0; i < COUNT; i += 1) {
        let x = current[i * 3];
        let y = current[i * 3 + 1];
        let z = current[i * 3 + 2];
        if (!frozen) {
          if (activeScene === "lattice") y += Math.sin(clock * 1.6 + x * 5 + z * 3) * 0.045;
          else if (activeScene === "ribbon") y += Math.sin(clock * 1.4 + x * 6) * 0.03;
          else z += Math.sin(clock * 1.5 + y * 7) * 0.035;
        }
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const perspective = 1.2 / (1.2 + z2 * 0.62);
        depth[i] = z2;
        projectedX[i] = originX + x1 * spread * perspective;
        projectedY[i] = originY + y2 * spread * perspective;
        projectedScale[i] = perspective;
      }

      order.sort((a, b) => depth[a] - depth[b]);
      context.clearRect(0, 0, width, height);

      const [red, green, blue] = hexToRgb(colorRef.current);
      const [red2, green2, blue2] = hexToRgb(secondaryRef.current);
      const glow = context.createRadialGradient(originX, originY, 0, originX, originY, spread * 1.05);
      glow.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.18)`);
      glow.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(originX, originY, spread * 1.05, 0, Math.PI * 2);
      context.fill();

      for (const i of order) {
        const mix = ((i * 17) % 10) / 9;
        const perspective = projectedScale[i];
        const pointRed = Math.round(red + (red2 - red) * mix);
        const pointGreen = Math.round(green + (green2 - green) * mix);
        const pointBlue = Math.round(blue + (blue2 - blue) * mix);
        const alpha = 0.42 + perspective * 0.55;
        const radius = Math.max(0.7 * dpr, (0.85 + (1 - mix) * 1.45) * perspective * dpr);
        context.fillStyle = `rgba(${pointRed}, ${pointGreen}, ${pointBlue}, ${alpha})`;
        context.beginPath();
        context.arc(projectedX[i], projectedY[i], radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onMedia);
    };
  }, []);

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    dragging.current = true;
    pointer.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    pointer.current = { x: event.clientX, y: event.clientY };
    yaw.current += dx * 0.007;
    pitch.current = clamp(pitch.current + dy * 0.007, -1.15, 1.15);
  }

  function onPointerUp(event: PointerEvent<HTMLCanvasElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    const step = 0.14;
    if (event.key === "ArrowLeft") yaw.current -= step;
    else if (event.key === "ArrowRight") yaw.current += step;
    else if (event.key === "ArrowUp") pitch.current = clamp(pitch.current - step, -1.15, 1.15);
    else if (event.key === "ArrowDown") pitch.current = clamp(pitch.current + step, -1.15, 1.15);
    else return;
    event.preventDefault();
  }

  return (
    <canvas
      ref={canvasRef}
      className="specimen-canvas"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    />
  );
}
