import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus, RotateCw, Play, Pause, Eye, Sparkles, Move3D } from 'lucide-react';
import * as THREE from 'three';

interface ShoePreviewStageProps {
  baseModel: string;
  colors: Record<string, string>;
  laces: {
    type: string;
    thickness: string;
    length: string;
    material: string;
    color: string;
  };
  soleType: string;
  material: string;
  logo: {
    type: 'none' | 'text' | 'image';
    value: string;
    position: { x: number; y: number };
    scale: number;
  };
  accessories: {
    laceTags: boolean;
    goldEyelets: boolean;
    reflectiveStrips: boolean;
    glowOutsole: boolean;
    carbonHeel: boolean;
    tongueLabel: string;
    insoleText: string;
  };
  onLogoPositionChange: (pos: { x: number; y: number }) => void;
}

export const ShoePreviewStage: React.FC<ShoePreviewStageProps> = ({
  baseModel,
  colors,
  laces,
  soleType,
  material,
  logo,
  accessories,
  onLogoPositionChange
}) => {
  const [angle, setAngle] = useState<'side' | 'front' | 'top' | 'back' | 'sole' | 'orbit'>('side');
  const [zoom, setZoom] = useState(1);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js References
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const shoeGroupRef = useRef<THREE.Group | null>(null);

  // Interaction State
  const isDragging = useRef(false);
  const isDraggingLogo = useRef(false);
  const startMouseX = useRef(0);
  const startMouseY = useRef(0);
  const rotationXRef = useRef(0.08);
  const rotationYRef = useRef(0.5); // Start at a three-quarter angle for depth
  const targetRotationX = useRef(0.08);
  const targetRotationY = useRef(0.5);

  const lastInteractionTime = useRef(Date.now());
  const isIdle = useRef(true);

  // Canvas texture cache keys to prevent redundant redrawing
  const lastLogoCache = useRef('');
  const lastTongueCache = useRef('');
  const lastInsoleCache = useRef('');

  // Mesh & Materials References
  const meshesRef = useRef<{
    midsole?: THREE.Mesh;
    outsole?: THREE.Mesh;
    upper?: THREE.Mesh;
    toeCap?: THREE.Mesh;
    heelCounter?: THREE.Mesh;
    sidePanelL?: THREE.Mesh;
    sidePanelR?: THREE.Mesh;
    tongue?: THREE.Mesh;
    tongueLabel?: THREE.Mesh;
    insole?: THREE.Mesh;
    laces?: THREE.Mesh;
    eyelets?: THREE.Group;
    laceTag?: THREE.Mesh;
    reflectiveStrip?: THREE.Mesh;
    carbonHeel?: THREE.Mesh;
    logoBadge?: THREE.Mesh;
    airBubbleGlassL?: THREE.Mesh;
    airBubbleCoreL?: THREE.Mesh;
    airBubbleGlassR?: THREE.Mesh;
    airBubbleCoreR?: THREE.Mesh;
  }>({});

  const texturesRef = useRef<{
    mesh?: THREE.Texture;
    knit?: THREE.Texture;
    canvas?: THREE.Texture;
    carbon?: THREE.Texture;
    leather?: THREE.Texture;
    logoCanvas?: HTMLCanvasElement;
    logoTexture?: THREE.CanvasTexture;
    tongueCanvas?: HTMLCanvasElement;
    tongueTexture?: THREE.CanvasTexture;
    insoleCanvas?: HTMLCanvasElement;
    insoleTexture?: THREE.CanvasTexture;
  }>({});

  // Helper to check base model type
  const isHighTop = baseModel === 'High Top' || baseModel === 'Basketball';
  const isLowTop = baseModel === 'Low Top' || baseModel === 'Skate';

  // 1. Procedural Texture Generators
  const getProceduralTextures = () => {
    if (texturesRef.current.mesh) return texturesRef.current;

    // Mesh Pattern
    const meshCanvas = document.createElement('canvas');
    meshCanvas.width = 64;
    meshCanvas.height = 64;
    const meshCtx = meshCanvas.getContext('2d')!;
    meshCtx.fillStyle = '#ffffff';
    meshCtx.fillRect(0, 0, 64, 64);
    meshCtx.fillStyle = '#e2e8f0';
    for (let x = 0; x < 64; x += 8) {
      for (let y = 0; y < 64; y += 8) {
        meshCtx.beginPath();
        meshCtx.arc(x + 4, y + 4, 1.8, 0, Math.PI * 2);
        meshCtx.fill();
      }
    }
    const meshTex = new THREE.CanvasTexture(meshCanvas);
    meshTex.wrapS = THREE.RepeatWrapping;
    meshTex.wrapT = THREE.RepeatWrapping;
    meshTex.repeat.set(16, 16);

    // Knit Pattern
    const knitCanvas = document.createElement('canvas');
    knitCanvas.width = 64;
    knitCanvas.height = 32;
    const knitCtx = knitCanvas.getContext('2d')!;
    knitCtx.fillStyle = '#ffffff';
    knitCtx.fillRect(0, 0, 64, 32);
    knitCtx.strokeStyle = '#cbd5e1';
    knitCtx.lineWidth = 1.2;
    for (let x = 0; x < 64; x += 8) {
      knitCtx.beginPath();
      knitCtx.moveTo(x, 0);
      knitCtx.bezierCurveTo(x + 4, 8, x - 4, 16, x, 32);
      knitCtx.stroke();
      knitCtx.beginPath();
      knitCtx.moveTo(x + 4, 0);
      knitCtx.bezierCurveTo(x, 8, x + 8, 16, x + 4, 32);
      knitCtx.stroke();
    }
    const knitTex = new THREE.CanvasTexture(knitCanvas);
    knitTex.wrapS = THREE.RepeatWrapping;
    knitTex.wrapT = THREE.RepeatWrapping;
    knitTex.repeat.set(10, 20);

    // Canvas Pattern
    const canvasCanvas = document.createElement('canvas');
    canvasCanvas.width = 16;
    canvasCanvas.height = 16;
    const canvasCtx = canvasCanvas.getContext('2d')!;
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.fillRect(0, 0, 16, 16);
    canvasCtx.strokeStyle = '#e2e8f0';
    canvasCtx.lineWidth = 0.8;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 8);
    canvasCtx.lineTo(16, 8);
    canvasCtx.moveTo(8, 0);
    canvasCtx.lineTo(8, 16);
    canvasCtx.stroke();
    const canvasTex = new THREE.CanvasTexture(canvasCanvas);
    canvasTex.wrapS = THREE.RepeatWrapping;
    canvasTex.wrapT = THREE.RepeatWrapping;
    canvasTex.repeat.set(32, 32);

    // Carbon Fiber Pattern
    const carbonCanvas = document.createElement('canvas');
    carbonCanvas.width = 16;
    carbonCanvas.height = 16;
    const carbonCtx = carbonCanvas.getContext('2d')!;
    carbonCtx.fillStyle = '#1e293b';
    carbonCtx.fillRect(0, 0, 16, 16);
    carbonCtx.fillStyle = '#0f172a';
    carbonCtx.beginPath();
    carbonCtx.moveTo(0, 0);
    carbonCtx.lineTo(8, 0);
    carbonCtx.lineTo(0, 8);
    carbonCtx.closePath();
    carbonCtx.fill();
    carbonCtx.beginPath();
    carbonCtx.moveTo(8, 8);
    carbonCtx.lineTo(16, 8);
    carbonCtx.lineTo(8, 16);
    carbonCtx.closePath();
    carbonCtx.fill();
    carbonCtx.beginPath();
    carbonCtx.moveTo(16, 0);
    carbonCtx.lineTo(16, 8);
    carbonCtx.lineTo(8, 0);
    carbonCtx.closePath();
    carbonCtx.fill();
    carbonCtx.beginPath();
    carbonCtx.moveTo(0, 8);
    carbonCtx.lineTo(8, 16);
    carbonCtx.lineTo(0, 16);
    carbonCtx.closePath();
    carbonCtx.fill();
    const carbonTex = new THREE.CanvasTexture(carbonCanvas);
    carbonTex.wrapS = THREE.RepeatWrapping;
    carbonTex.wrapT = THREE.RepeatWrapping;
    carbonTex.repeat.set(6, 6);

    // Leather Micro Bump
    const leatherCanvas = document.createElement('canvas');
    leatherCanvas.width = 128;
    leatherCanvas.height = 128;
    const leatherCtx = leatherCanvas.getContext('2d')!;
    const imgData = leatherCtx.createImageData(128, 128);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = 128 + Math.floor(Math.random() * 25);
      imgData.data[i] = val;
      imgData.data[i + 1] = val;
      imgData.data[i + 2] = val;
      imgData.data[i + 3] = 255;
    }
    leatherCtx.putImageData(imgData, 0, 0);
    const leatherTex = new THREE.CanvasTexture(leatherCanvas);
    leatherTex.wrapS = THREE.RepeatWrapping;
    leatherTex.wrapT = THREE.RepeatWrapping;
    leatherTex.repeat.set(16, 16);

    // Repositionable Logo canvas texture
    const logoCanv = document.createElement('canvas');
    logoCanv.width = 256;
    logoCanv.height = 256;
    const logoTex = new THREE.CanvasTexture(logoCanv);

    // Tongue label canvas texture
    const tongueCanv = document.createElement('canvas');
    tongueCanv.width = 256;
    tongueCanv.height = 128;
    const tongueTex = new THREE.CanvasTexture(tongueCanv);

    // Insole canvas texture
    const insoleCanv = document.createElement('canvas');
    insoleCanv.width = 128;
    insoleCanv.height = 256;
    const insoleTex = new THREE.CanvasTexture(insoleCanv);

    texturesRef.current = {
      mesh: meshTex,
      knit: knitTex,
      canvas: canvasTex,
      carbon: carbonTex,
      leather: leatherTex,
      logoCanvas: logoCanv,
      logoTexture: logoTex,
      tongueCanvas: tongueCanv,
      tongueTexture: tongueTex,
      insoleCanvas: insoleCanv,
      insoleTexture: insoleTex
    };

    return texturesRef.current;
  };

  // 2. Geometry Generators
  const applySoleCurve = (geom: THREE.BufferGeometry) => {
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      const y = pos.getY(i);
      
      let lift = 0;
      if (z > 0) {
        lift = 0.12 * Math.pow(z / 1.15, 2);
      } else {
        lift = 0.04 * Math.pow(z / 1.15, 2);
      }
      pos.setY(i, y + lift);
    }
    geom.computeVertexNormals();
  };

  const createSoleGeometry = (height: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.1);
    shape.quadraticCurveTo(0.28, 0.95, 0.32, 0.45);
    shape.quadraticCurveTo(0.34, -0.1, 0.19, -0.5);
    shape.quadraticCurveTo(0.23, -0.9, 0.21, -1.05);
    shape.quadraticCurveTo(0.12, -1.15, 0, -1.15);
    
    // Mirror
    shape.quadraticCurveTo(-0.12, -1.15, -0.21, -1.05);
    shape.quadraticCurveTo(-0.23, -0.9, -0.19, -0.5);
    shape.quadraticCurveTo(-0.34, -0.1, -0.32, 0.45);
    shape.quadraticCurveTo(-0.28, 0.95, 0, 1.1);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4,
      curveSegments: 36
    });

    geom.rotateX(-Math.PI / 2);
    applySoleCurve(geom);
    return geom;
  };

  const getUpperGeometry = () => {
    const geom = new THREE.BufferGeometry();
    const slices = 32;
    const radialSegments = 24;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let s = 0; s <= slices; s++) {
      const u = s / slices;
      const z = -1.1 + 2.2 * u;

      let w = 0.22;
      if (u < 0.25) {
        w = 0.22 + 0.08 * (u / 0.25);
      } else if (u < 0.65) {
        const t = (u - 0.25) / 0.4;
        w = 0.30 + 0.03 * Math.sin(t * Math.PI);
      } else {
        const t = (u - 0.65) / 0.35;
        w = 0.33 * (1 - t * t) + 0.02;
      }

      let h = 0.12;
      if (u < 0.25) {
        const t = u / 0.25;
        const hBack = isHighTop ? 0.70 : isLowTop ? 0.35 : 0.44;
        const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
        h = hBack + (hCollar - hBack) * t;
      } else {
        const t = (u - 0.25) / 0.75;
        const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
        h = hCollar * Math.pow(1 - t, 1.3) + 0.12;
      }

      const soleY = z > 0 ? 0.12 * Math.pow(z / 1.15, 2) : 0.04 * Math.pow(z / 1.15, 2);
      const yBase = soleY + 0.14;

      for (let r = 0; r < radialSegments; r++) {
        const theta = (r / radialSegments) * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        let x = cos * w;
        let y = yBase;

        if (sin >= 0) {
          y += sin * h;
        } else {
          y += sin * 0.02 * h;
        }

        if (u > 0.2 && u < 0.65 && sin > 0) {
          const angleDiff = Math.abs(theta - Math.PI / 2);
          const factor = Math.max(0, 1 - angleDiff / (Math.PI / 2.5));
          if (factor > 0) {
            const pull = factor * factor * h * 0.82;
            y -= pull;
            x *= (1 - factor * 0.4);
          }
        }

        vertices.push(x, y, z);
        uvs.push(r / radialSegments, u);
      }
    }

    for (let s = 0; s < slices; s++) {
      for (let r = 0; r < radialSegments; r++) {
        const nextR = (r + 1) % radialSegments;
        const currRow = s * radialSegments;
        const nextRow = (s + 1) * radialSegments;

        const a = currRow + r;
        const b = currRow + nextR;
        const c = nextRow + r;
        const d = nextRow + nextR;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  const getOverlayGeometry = (uStart: number, uEnd: number, scale: number) => {
    const geom = new THREE.BufferGeometry();
    const slices = 16;
    const radialSegments = 24;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let s = 0; s <= slices; s++) {
      const tSlice = s / slices;
      const u = uStart + (uEnd - uStart) * tSlice;
      const z = -1.1 + 2.2 * u;

      let w = 0.22;
      if (u < 0.25) {
        w = 0.22 + 0.08 * (u / 0.25);
      } else if (u < 0.65) {
        const t = (u - 0.25) / 0.4;
        w = 0.30 + 0.03 * Math.sin(t * Math.PI);
      } else {
        const t = (u - 0.65) / 0.35;
        w = 0.33 * (1 - t * t) + 0.02;
      }

      let h = 0.12;
      if (u < 0.25) {
        const t = u / 0.25;
        const hBack = isHighTop ? 0.70 : isLowTop ? 0.35 : 0.44;
        const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
        h = hBack + (hCollar - hBack) * t;
      } else {
        const t = (u - 0.25) / 0.75;
        const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
        h = hCollar * Math.pow(1 - t, 1.3) + 0.12;
      }

      const soleY = z > 0 ? 0.12 * Math.pow(z / 1.15, 2) : 0.04 * Math.pow(z / 1.15, 2);
      const yBase = soleY + 0.14;

      for (let r = 0; r < radialSegments; r++) {
        const theta = (r / radialSegments) * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        let x = cos * w * scale;
        let y = yBase;

        if (sin >= 0) {
          y += sin * h * scale;
        } else {
          y += sin * 0.02 * h * scale;
        }

        if (u > 0.2 && u < 0.65 && sin > 0) {
          const angleDiff = Math.abs(theta - Math.PI / 2);
          const factor = Math.max(0, 1 - angleDiff / (Math.PI / 2.5));
          if (factor > 0) {
            const pull = factor * factor * h * scale * 0.82;
            y -= pull;
            x *= (1 - factor * 0.4);
          }
        }

        vertices.push(x, y, z);
        uvs.push(r / radialSegments, tSlice);
      }
    }

    for (let s = 0; s < slices; s++) {
      for (let r = 0; r < radialSegments; r++) {
        const nextR = (r + 1) % radialSegments;
        const currRow = s * radialSegments;
        const nextRow = (s + 1) * radialSegments;

        const a = currRow + r;
        const b = currRow + nextR;
        const c = nextRow + r;
        const d = nextRow + nextR;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  const getSidePanelGeometry = (isRight: boolean) => {
    const geom = new THREE.BufferGeometry();
    const slices = 12;
    const radialSegments = 6;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let s = 0; s <= slices; s++) {
      const tSlice = s / slices;
      const u = 0.3 + 0.35 * tSlice;
      const z = -1.1 + 2.2 * u;

      let w = 0.22;
      if (u < 0.25) {
        w = 0.22 + 0.08 * (u / 0.25);
      } else if (u < 0.65) {
        const t = (u - 0.25) / 0.4;
        w = 0.30 + 0.03 * Math.sin(t * Math.PI);
      } else {
        const t = (u - 0.65) / 0.35;
        w = 0.33 * (1 - t * t) + 0.02;
      }

      let h = 0.12;
      if (u < 0.25) {
        const t = u / 0.25;
        const hBack = isHighTop ? 0.70 : isLowTop ? 0.35 : 0.44;
        const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
        h = hBack + (hCollar - hBack) * t;
      } else {
        const t = (u - 0.25) / 0.75;
        const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
        h = hCollar * Math.pow(1 - t, 1.3) + 0.12;
      }

      const soleY = z > 0 ? 0.12 * Math.pow(z / 1.15, 2) : 0.04 * Math.pow(z / 1.15, 2);
      const yBase = soleY + 0.14;

      for (let r = 0; r <= radialSegments; r++) {
        const tRad = r / radialSegments;
        let theta = 0;
        if (isRight) {
          theta = -0.1 * Math.PI + 0.55 * Math.PI * tRad;
        } else {
          theta = 0.55 * Math.PI + 0.55 * Math.PI * tRad;
        }

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const scaleVal = 1.01;
        let x = cos * w * scaleVal;
        let y = yBase;

        if (sin >= 0) {
          y += sin * h * scaleVal;
        } else {
          y += sin * 0.02 * h * scaleVal;
        }

        const angleDiff = Math.abs(theta - Math.PI / 2);
        const factor = Math.max(0, 1 - angleDiff / (Math.PI / 2.5));
        if (factor > 0) {
          const pull = factor * factor * h * scaleVal * 0.82;
          y -= pull;
          x *= (1 - factor * 0.4);
        }

        const edgeTaper = 1 - Math.pow(2 * tRad - 1, 2) * 0.1;
        x *= edgeTaper;

        vertices.push(x, y, z);
        uvs.push(tRad, tSlice);
      }
    }

    const radialCount = radialSegments + 1;
    for (let s = 0; s < slices; s++) {
      for (let r = 0; r < radialSegments; r++) {
        const a = s * radialCount + r;
        const b = s * radialCount + r + 1;
        const c = (s + 1) * radialCount + r;
        const d = (s + 1) * radialCount + r + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  const getTongueGeometry = () => {
    const geom = new THREE.BufferGeometry();
    const slices = 16;
    const radialSegments = 10;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let s = 0; s <= slices; s++) {
      const tSlice = s / slices;
      const u = 0.22 + 0.38 * tSlice;
      const z = -1.1 + 2.2 * u;

      let w = 0.18;
      if (u < 0.25) {
        w = 0.18 + 0.08 * (u / 0.25);
      } else {
        const t = (u - 0.25) / 0.4;
        w = 0.26 - 0.12 * t;
      }

      let h = 0.12;
      const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
      const tonguePeak = hCollar + (isHighTop ? 0.08 : 0.04);
      if (u < 0.25) {
        h = tonguePeak;
      } else {
        const t = (u - 0.25) / 0.75;
        h = tonguePeak * Math.pow(1 - t, 1.3) + 0.12;
      }

      const soleY = z > 0 ? 0.12 * Math.pow(z / 1.15, 2) : 0.04 * Math.pow(z / 1.15, 2);
      const yBase = soleY + 0.15;

      for (let r = 0; r <= radialSegments; r++) {
        const tRad = r / radialSegments;
        const theta = 0.15 * Math.PI + 0.7 * Math.PI * tRad;

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const x = cos * w * 1.005;
        const puff = 0.035 * Math.sin(tRad * Math.PI);
        const y = yBase + sin * h * 1.005 + puff;

        vertices.push(x, y, z);
        uvs.push(tRad, tSlice);
      }
    }

    const radialCount = radialSegments + 1;
    for (let s = 0; s < slices; s++) {
      for (let r = 0; r < radialSegments; r++) {
        const a = s * radialCount + r;
        const b = s * radialCount + r + 1;
        const c = (s + 1) * radialCount + r;
        const d = (s + 1) * radialCount + r + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  const getEyeletPoints = () => {
    const eyeletsCount = 5;
    const leftEyelets: THREE.Vector3[] = [];
    const rightEyelets: THREE.Vector3[] = [];

    for (let i = 0; i < eyeletsCount; i++) {
      const t = i / (eyeletsCount - 1);
      const u = 0.35 + 0.22 * t;
      const z = -1.1 + 2.2 * u;

      let w = 0.30 - 0.05 * t;
      const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
      const h = hCollar * Math.pow(1 - (u - 0.25) / 0.75, 1.3) + 0.12;
      const soleY = z > 0 ? 0.12 * Math.pow(z / 1.15, 2) : 0.04 * Math.pow(z / 1.15, 2);
      const yBase = soleY + 0.14;

      const leftTheta = 0.38 * Math.PI;
      const rightTheta = 0.62 * Math.PI;

      const xl = Math.cos(leftTheta) * w * 1.01;
      const yl = yBase + Math.sin(leftTheta) * h * 0.32;

      const xr = Math.cos(rightTheta) * w * 1.01;
      const yr = yBase + Math.sin(rightTheta) * h * 0.32;

      leftEyelets.push(new THREE.Vector3(xl, yl, z));
      rightEyelets.push(new THREE.Vector3(xr, yr, z));
    }
    return { leftEyelets, rightEyelets, eyeletsCount };
  };

  const getLacesGeometry = () => {
    const { leftEyelets, rightEyelets, eyeletsCount } = getEyeletPoints();
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i < eyeletsCount; i++) {
      if (i % 2 === 0) {
        points.push(leftEyelets[i]);
        points.push(rightEyelets[i]);
      } else {
        points.push(rightEyelets[i]);
        points.push(leftEyelets[i]);
      }
    }

    const topL = leftEyelets[eyeletsCount - 1];
    const topR = rightEyelets[eyeletsCount - 1];
    const center = new THREE.Vector3().addVectors(topL, topR).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.06, 0.02));
    
    points.push(topR);
    points.push(center);
    points.push(topL);

    const bowL1 = new THREE.Vector3(topL.x - 0.06, topL.y + 0.05, topL.z - 0.05);
    const bowL2 = new THREE.Vector3(topL.x - 0.12, topL.y + 0.02, topL.z - 0.08);
    points.push(bowL1);
    points.push(bowL2);
    points.push(center);

    const bowR1 = new THREE.Vector3(topR.x + 0.06, topR.y + 0.05, topR.z - 0.05);
    const bowR2 = new THREE.Vector3(topR.x + 0.12, topR.y + 0.02, topR.z - 0.08);
    points.push(bowR1);
    points.push(bowR2);
    points.push(center);

    const curve = new THREE.CatmullRomCurve3(points);
    const thickness = laces.thickness === 'thick' ? 0.013 : laces.thickness === 'thin' ? 0.007 : 0.010;
    
    return new THREE.TubeGeometry(curve, 90, thickness, 8, false);
  };

  // 3. Optimized Texture Canvas Drawers (Memoized via cache keys)
  const drawLogoCanvas = () => {
    const textures = texturesRef.current;
    if (!textures.logoCanvas || !textures.logoTexture) return;

    const key = `${logo.type}_${logo.value}_${colors.stitching || ''}`;
    if (lastLogoCache.current === key && logo.type !== 'image') return;

    const ctx = textures.logoCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 256, 256);
    const activeColor = colors.stitching || '#0B1E2D';

    if (logo.type === 'text') {
      ctx.fillStyle = activeColor;
      ctx.font = '900 68px "Syne", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(logo.value || 'ODD', 128, 128);
      lastLogoCache.current = key;
    } else if (logo.type === 'image') {
      if (logo.value.startsWith('data:') || logo.value.startsWith('http')) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = logo.value;
        img.onload = () => {
          ctx.clearRect(0, 0, 256, 256);
          ctx.drawImage(img, 32, 32, 192, 192);
          textures.logoTexture!.needsUpdate = true;
        };
      } else {
        ctx.fillStyle = activeColor;
        ctx.beginPath();
        ctx.moveTo(20, 160);
        ctx.quadraticCurveTo(80, 70, 190, 110);
        ctx.quadraticCurveTo(240, 125, 230, 95);
        ctx.quadraticCurveTo(190, 160, 100, 160);
        ctx.quadraticCurveTo(50, 160, 20, 160);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(60, 175);
        ctx.quadraticCurveTo(120, 110, 210, 135);
        ctx.quadraticCurveTo(230, 140, 220, 125);
        ctx.quadraticCurveTo(140, 185, 60, 175);
        ctx.closePath();
        ctx.fill();
        lastLogoCache.current = key;
      }
    }

    textures.logoTexture.needsUpdate = true;
  };

  const drawTongueLabelCanvas = () => {
    const textures = texturesRef.current;
    if (!textures.tongueCanvas || !textures.tongueTexture) return;

    const key = `${accessories.tongueLabel}_${colors.stitching || ''}`;
    if (lastTongueCache.current === key) return;

    const ctx = textures.tongueCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#faf9f6';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = colors.stitching || '#e2e8f0';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 232, 104);

    if (accessories.tongueLabel) {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 36px "Syne", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(accessories.tongueLabel.toUpperCase().substring(0, 8), 128, 64);
    }

    lastTongueCache.current = key;
    textures.tongueTexture.needsUpdate = true;
  };

  const drawInsoleCanvas = () => {
    const textures = texturesRef.current;
    if (!textures.insoleCanvas || !textures.insoleTexture) return;

    const key = `${accessories.insoleText}_${colors.midsole || ''}_${colors.upper || ''}`;
    if (lastInsoleCache.current === key) return;

    const ctx = textures.insoleCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = colors.midsole || '#f8fafc';
    ctx.fillRect(0, 0, 128, 256);

    ctx.fillStyle = colors.upper || '#0f172a';
    ctx.font = 'bold 16px "Syne", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.translate(64, 128);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(accessories.insoleText ? accessories.insoleText.substring(0, 15).toUpperCase() : 'ODDSHOE DESIGN', 0, 0);
    ctx.restore();

    lastInsoleCache.current = key;
    textures.insoleTexture.needsUpdate = true;
  };

  // Setup Three.js Scene, Camera, Lights and Objects
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 350;

    // A. RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // B. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // C. CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(1.9, 0.6, 2.3); 
    cameraRef.current = camera;

    // D. LIGHTS
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#ffffff', 1.4);
    dirLight1.position.set(2, 4, 3);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    dirLight1.shadow.camera.near = 0.5;
    dirLight1.shadow.camera.far = 15;
    dirLight1.shadow.camera.left = -1.5;
    dirLight1.shadow.camera.right = 1.5;
    dirLight1.shadow.camera.top = 1.5;
    dirLight1.shadow.camera.bottom = -1.5;
    dirLight1.shadow.bias = -0.0005;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#e0f2fe', 0.6); 
    dirLight2.position.set(-2, -1, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight('#ffffff', 0.4, 6);
    pointLight.position.set(0, 2, -1);
    scene.add(pointLight);

    // E. GROUND BLUR SHADOW
    const shadowGeo = new THREE.PlaneGeometry(3, 3);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(128, 128, 0, 128, 128, 110);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    grad.addColorStop(0.3, 'rgba(15, 23, 42, 0.35)');
    grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.1)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.035; 
    scene.add(shadowMesh);

    // F. SHOE GROUP
    const shoeGroup = new THREE.Group();
    shoeGroupRef.current = shoeGroup;
    scene.add(shoeGroup);

    shoeGroup.position.set(0, 0.05, 0);

    const textures = getProceduralTextures();

    // Sole
    const midsoleGeom = createSoleGeometry(0.14);
    const midsoleMat = new THREE.MeshStandardMaterial({
      color: colors.midsole || '#FFFFFF',
      roughness: 0.55,
      metalness: 0.05
    });
    const midsole = new THREE.Mesh(midsoleGeom, midsoleMat);
    midsole.castShadow = true;
    midsole.receiveShadow = true;
    shoeGroup.add(midsole);
    meshesRef.current.midsole = midsole;

    const outsoleGeom = createSoleGeometry(0.04);
    outsoleGeom.translate(0, -0.04, 0); 
    const outsoleMat = new THREE.MeshStandardMaterial({
      color: accessories.glowOutsole ? '#70E000' : colors.outsole || '#333333',
      roughness: 0.8,
      metalness: 0.1,
      emissive: accessories.glowOutsole ? new THREE.Color('#70E000') : new THREE.Color('#000000'),
      emissiveIntensity: accessories.glowOutsole ? 0.7 : 0
    });
    const outsole = new THREE.Mesh(outsoleGeom, outsoleMat);
    outsole.castShadow = true;
    outsole.receiveShadow = true;
    shoeGroup.add(outsole);
    meshesRef.current.outsole = outsole;

    // Air Bubbles
    const airGlassGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 16);
    airGlassGeom.rotateZ(Math.PI / 2); 
    const airGlassMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.02,
      transparent: true,
      opacity: 0.8
    });

    const airCoreGeom = new THREE.CylinderGeometry(0.038, 0.038, 0.14, 16);
    airCoreGeom.rotateZ(Math.PI / 2);
    const airCoreMat = new THREE.MeshStandardMaterial({
      color: colors.airBubble || '#00E5FF',
      emissive: colors.airBubble || '#00E5FF',
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    const hasBubble = soleType === 'air' || soleType === 'bubble';

    const bubbleGroupL = new THREE.Group();
    bubbleGroupL.position.set(-0.16, 0.15, -0.45); 
    const bubbleGroupR = new THREE.Group();
    bubbleGroupR.position.set(0.16, 0.15, -0.45); 

    const glassMeshL = new THREE.Mesh(airGlassGeom, airGlassMat);
    const coreMeshL = new THREE.Mesh(airCoreGeom, airCoreMat);
    bubbleGroupL.add(glassMeshL, coreMeshL);

    const glassMeshR = new THREE.Mesh(airGlassGeom, airGlassMat);
    const coreMeshR = new THREE.Mesh(airCoreGeom, airCoreMat);
    bubbleGroupR.add(glassMeshR, coreMeshR);

    shoeGroup.add(bubbleGroupL, bubbleGroupR);
    meshesRef.current.airBubbleGlassL = glassMeshL;
    meshesRef.current.airBubbleCoreL = coreMeshL;
    meshesRef.current.airBubbleGlassR = glassMeshR;
    meshesRef.current.airBubbleCoreR = coreMeshR;

    bubbleGroupL.visible = hasBubble;
    bubbleGroupR.visible = hasBubble;

    // Upper Mesh
    const upperGeom = getUpperGeometry();
    const upperMat = new THREE.MeshStandardMaterial({
      color: colors.upper || '#FFFFFF',
      roughness: material === 'leather' ? 0.35 : material === 'suede' ? 0.9 : 0.6,
      metalness: material === 'leather' ? 0.1 : 0.0,
      map: material === 'mesh' ? textures.mesh : material === 'knit' ? textures.knit : material === 'canvas' ? textures.canvas : null,
      bumpMap: material === 'leather' ? textures.leather : null,
      bumpScale: 0.004
    });
    const upper = new THREE.Mesh(upperGeom, upperMat);
    upper.castShadow = true;
    upper.receiveShadow = true;
    shoeGroup.add(upper);
    meshesRef.current.upper = upper;

    // Toe Cap
    const toeCapGeom = getOverlayGeometry(0.72, 1.0, 1.008);
    const toeCapMat = new THREE.MeshStandardMaterial({
      color: colors.toeBox || '#FFFFFF',
      roughness: material === 'leather' ? 0.35 : material === 'suede' ? 0.9 : 0.6,
      metalness: 0.0
    });
    const toeCap = new THREE.Mesh(toeCapGeom, toeCapMat);
    toeCap.castShadow = true;
    shoeGroup.add(toeCap);
    meshesRef.current.toeCap = toeCap;

    // Heel Counter
    const heelCounterGeom = getOverlayGeometry(0.0, 0.22, 1.01);
    const heelCounterMat = new THREE.MeshStandardMaterial({
      color: colors.heel || '#FFFFFF',
      roughness: 0.7,
      metalness: 0.0
    });
    const heelCounter = new THREE.Mesh(heelCounterGeom, heelCounterMat);
    heelCounter.castShadow = true;
    shoeGroup.add(heelCounter);
    meshesRef.current.heelCounter = heelCounter;

    // Side Panels Overlay
    const sidePanelGeomL = getSidePanelGeometry(false);
    const sidePanelGeomR = getSidePanelGeometry(true);
    const sidePanelMat = new THREE.MeshStandardMaterial({
      color: colors.sidePanels || '#FFFFFF',
      roughness: 0.6,
      metalness: 0.05
    });
    
    const sidePanelL = new THREE.Mesh(sidePanelGeomL, sidePanelMat);
    const sidePanelR = new THREE.Mesh(sidePanelGeomR, sidePanelMat);
    sidePanelL.castShadow = true;
    sidePanelR.castShadow = true;
    shoeGroup.add(sidePanelL, sidePanelR);
    meshesRef.current.sidePanelL = sidePanelL;
    meshesRef.current.sidePanelR = sidePanelR;

    // Tongue
    const tongueGeom = getTongueGeometry();
    const tongueMat = new THREE.MeshStandardMaterial({
      color: colors.tongue || '#FFFFFF',
      roughness: 0.75,
      map: material === 'mesh' ? textures.mesh : material === 'knit' ? textures.knit : material === 'canvas' ? textures.canvas : null
    });
    const tongue = new THREE.Mesh(tongueGeom, tongueMat);
    tongue.castShadow = true;
    shoeGroup.add(tongue);
    meshesRef.current.tongue = tongue;

    // Tongue Label
    const tongueLabelGeom = new THREE.PlaneGeometry(0.12, 0.065);
    drawTongueLabelCanvas();
    const tongueLabelMat = new THREE.MeshBasicMaterial({
      map: textures.tongueTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const tongueLabel = new THREE.Mesh(tongueLabelGeom, tongueLabelMat);
    
    const zTongue = -0.15;
    const soleYTongue = zTongue > 0 ? 0.12 * Math.pow(zTongue / 1.15, 2) : 0.04 * Math.pow(zTongue / 1.15, 2);
    const yBaseTongue = soleYTongue + 0.14;
    const hCollar = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;

    tongueLabel.position.set(0, yBaseTongue + hCollar + (isHighTop ? 0.07 : 0.04), -0.15);
    tongueLabel.rotation.set(-Math.PI / 4.5, 0, 0);
    shoeGroup.add(tongueLabel);
    meshesRef.current.tongueLabel = tongueLabel;
    tongueLabel.visible = !!accessories.tongueLabel;

    // Insole
    const insoleGeom = new THREE.PlaneGeometry(0.35, 0.8);
    drawInsoleCanvas();
    const insoleMat = new THREE.MeshBasicMaterial({
      map: textures.insoleTexture,
      side: THREE.DoubleSide
    });
    const insole = new THREE.Mesh(insoleGeom, insoleMat);
    insole.position.set(0, 0.22, 0.0);
    insole.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    shoeGroup.add(insole);
    meshesRef.current.insole = insole;

    // Laces Tube
    const lacesGeom = getLacesGeometry();
    const lacesMat = new THREE.MeshStandardMaterial({
      color: laces.color || '#FFFFFF',
      roughness: 0.85
    });
    const lacesMesh = new THREE.Mesh(lacesGeom, lacesMat);
    lacesMesh.castShadow = true;
    shoeGroup.add(lacesMesh);
    meshesRef.current.laces = lacesMesh;

    // Repositionable Logo Badge
    const logoBadgeGeom = new THREE.PlaneGeometry(0.18, 0.18);
    drawLogoCanvas();
    const logoBadgeMat = new THREE.MeshBasicMaterial({
      map: textures.logoTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const logoBadge = new THREE.Mesh(logoBadgeGeom, logoBadgeMat);
    
    const mapLogoPosition = () => {
      const lx = logo.position.x; 
      const ly = logo.position.y; 
      
      const lz3d = -0.5 + ((lx - 100) / 280) * 0.9;
      const ly3d = 0.44 - ((ly - 60) / 160) * 0.25;

      const uNorm = (lz3d + 1.1) / 2.2;
      let wUpper = 0.22;
      if (uNorm < 0.25) {
        wUpper = 0.22 + 0.08 * (uNorm / 0.25);
      } else if (uNorm < 0.65) {
        wUpper = 0.30 + 0.03 * Math.sin(((uNorm - 0.25) / 0.4) * Math.PI);
      } else {
        wUpper = 0.33 * (1 - Math.pow((uNorm - 0.65) / 0.35, 2)) + 0.02;
      }

      logoBadge.position.set(wUpper * 1.018, ly3d, lz3d);
      logoBadge.scale.setScalar(logo.scale);
      logoBadge.rotation.set(0, Math.PI / 2 + 0.15, 0);
    };

    mapLogoPosition();
    shoeGroup.add(logoBadge);
    meshesRef.current.logoBadge = logoBadge;
    logoBadge.visible = logo.type !== 'none';

    // Heel Pull Tab
    const pullTabPoints = [
      new THREE.Vector3(0, 0.3, -1.0),
      new THREE.Vector3(0, 0.5, -1.1),
      new THREE.Vector3(0, 0.4, -0.95),
    ];
    const pullTabCurve = new THREE.CatmullRomCurve3(pullTabPoints);
    const pullTabGeom = new THREE.TubeGeometry(pullTabCurve, 16, 0.012, 6, true);
    const pullTabMat = new THREE.MeshStandardMaterial({
      color: colors.heelPull || '#FFFFFF',
      roughness: 0.7
    });
    const pullTab = new THREE.Mesh(pullTabGeom, pullTabMat);
    pullTab.castShadow = true;
    
    const zHeel = -1.0;
    const soleYHeel = zHeel > 0 ? 0.12 * Math.pow(zHeel / 1.15, 2) : 0.04 * Math.pow(zHeel / 1.15, 2);
    const yBaseHeel = soleYHeel + 0.14;
    const hCollarBack = isHighTop ? 0.70 : isLowTop ? 0.35 : 0.44;

    pullTab.position.set(0, yBaseHeel + hCollarBack - 0.35, 0.0);
    shoeGroup.add(pullTab);

    // Carbon Fiber Heel Plate
    const carbonHeelGeom = getOverlayGeometry(0.0, 0.15, 1.015);
    const zCarbon = -1.1;
    const soleYCarbon = zCarbon > 0 ? 0.12 * Math.pow(zCarbon / 1.15, 2) : 0.04 * Math.pow(zCarbon / 1.15, 2);
    const yBaseCarbon = soleYCarbon + 0.14;

    const cPos = carbonHeelGeom.attributes.position;
    for (let i = 0; i < cPos.count; i++) {
      if (cPos.getY(i) > yBaseCarbon + 0.12) {
        cPos.setY(i, yBaseCarbon + 0.08); 
      }
    }
    carbonHeelGeom.computeVertexNormals();

    const carbonHeelMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.1,
      metalness: 0.85,
      map: textures.carbon
    });
    const carbonHeel = new THREE.Mesh(carbonHeelGeom, carbonHeelMat);
    shoeGroup.add(carbonHeel);
    meshesRef.current.carbonHeel = carbonHeel;
    carbonHeel.visible = accessories.carbonHeel;

    // Reflective Strip
    const refStripGeom = new THREE.BoxGeometry(0.018, 0.25, 0.005);
    const refStripMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    const reflectiveStrip = new THREE.Mesh(refStripGeom, refStripMat);
    
    const zReflective = -1.06;
    const soleYReflective = zReflective > 0 ? 0.12 * Math.pow(zReflective / 1.15, 2) : 0.04 * Math.pow(zReflective / 1.15, 2);
    const yBaseReflective = soleYReflective + 0.14;

    reflectiveStrip.position.set(0, yBaseReflective + 0.16, -1.06);
    reflectiveStrip.rotation.set(0.1, 0, 0);
    shoeGroup.add(reflectiveStrip);
    meshesRef.current.reflectiveStrip = reflectiveStrip;
    reflectiveStrip.visible = accessories.reflectiveStrips;

    // Eyelets Detail
    const { leftEyelets, rightEyelets, eyeletsCount } = getEyeletPoints();

    const eyelets = new THREE.Group();
    const eyeletGeo = new THREE.TorusGeometry(0.014, 0.005, 6, 12);
    eyeletGeo.rotateY(Math.PI / 2);
    const eyeletMat = new THREE.MeshStandardMaterial({
      color: accessories.goldEyelets ? '#FFD700' : colors.laceLoops || '#FFFFFF',
      metalness: accessories.goldEyelets ? 0.9 : 0.2,
      roughness: accessories.goldEyelets ? 0.1 : 0.6
    });

    for (let i = 0; i < eyeletsCount; i++) {
      const t = i / (eyeletsCount - 1);
      const u = 0.35 + 0.22 * t;
      const z = -1.1 + 2.2 * u;

      let w = 0.30 - 0.05 * t;
      const hCollarEl = isHighTop ? 0.85 : isLowTop ? 0.42 : 0.52;
      const h = hCollarEl * Math.pow(1 - (u - 0.25) / 0.75, 1.3) + 0.12;
      const soleY = z > 0 ? 0.12 * Math.pow(z / 1.15, 2) : 0.04 * Math.pow(z / 1.15, 2);
      const yBaseEl = soleY + 0.14;

      const leftTheta = 0.38 * Math.PI;
      const rightTheta = 0.62 * Math.PI;

      const xl = Math.cos(leftTheta) * w * 1.008;
      const yl = yBaseEl + Math.sin(leftTheta) * h * 0.32;

      const xr = Math.cos(rightTheta) * w * 1.008;
      const yr = yBaseEl + Math.sin(rightTheta) * h * 0.32;

      const eyeletL = new THREE.Mesh(eyeletGeo, eyeletMat);
      eyeletL.position.set(xl, yl, z);
      eyeletL.rotation.set(0, 0.1, -0.4);
      eyelets.add(eyeletL);

      const eyeletR = new THREE.Mesh(eyeletGeo, eyeletMat);
      eyeletR.position.set(xr, yr, z);
      eyeletR.rotation.set(0, -0.1, 0.4);
      eyelets.add(eyeletR);
    }
    shoeGroup.add(eyelets);
    meshesRef.current.eyelets = eyelets;

    // Lace Tag Deubré
    const laceTagGeom = new THREE.BoxGeometry(0.08, 0.02, 0.015);
    const laceTagMat = new THREE.MeshStandardMaterial({
      color: '#cccccc',
      metalness: 0.95,
      roughness: 0.1
    });
    const laceTag = new THREE.Mesh(laceTagGeom, laceTagMat);
    const l1 = leftEyelets[0];
    const r1 = rightEyelets[0];
    laceTag.position.set(0, (l1.y + r1.y) / 2 + 0.005, (l1.z + r1.z) / 2 + 0.01);
    laceTag.rotation.set(-Math.PI / 4, 0, 0);
    shoeGroup.add(laceTag);
    meshesRef.current.laceTag = laceTag;
    laceTag.visible = accessories.laceTags;

    // 5. ANIMATION & RENDER LOOP
    let animationFrameId: number;
    
    const render = () => {
      // Smooth Damping Lerp
      rotationXRef.current += (targetRotationX.current - rotationXRef.current) * 0.12;
      rotationYRef.current += (targetRotationY.current - rotationYRef.current) * 0.12;
      
      shoeGroup.rotation.y = rotationYRef.current;
      shoeGroup.rotation.x = rotationXRef.current;

      const timeSinceLastInteract = Date.now() - lastInteractionTime.current;
      if (timeSinceLastInteract > 4000) {
        isIdle.current = true;
      }

      // Auto-rotation & floating motion
      if ((isIdle.current || isAutoRotate) && !isDragging.current && !isDraggingLogo.current) {
        if (isAutoRotate) {
          targetRotationY.current += 0.005; 
        }
        const floatOffset = Math.sin(Date.now() * 0.002) * 0.025;
        shoeGroup.position.y = 0.05 + floatOffset;
        shadowMesh.scale.setScalar(1 - floatOffset * 0.85);
      } else {
        shoeGroup.position.y = 0.05;
        shadowMesh.scale.setScalar(1);
      }

      const distance = 2.45 / zoom;
      camera.position.set(
        distance * Math.sin(1.15) * Math.cos(0.2),
        distance * Math.sin(0.2) + 0.2,
        distance * Math.cos(1.15) * Math.cos(0.2)
      );
      camera.lookAt(0, 0.28, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 6. RESIZE HANDLER
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      midsoleGeom.dispose();
      midsoleMat.dispose();
      outsoleGeom.dispose();
      outsoleMat.dispose();
      airGlassGeom.dispose();
      airGlassMat.dispose();
      airCoreGeom.dispose();
      airCoreMat.dispose();
      upperGeom.dispose();
      upperMat.dispose();
      toeCapGeom.dispose();
      toeCapMat.dispose();
      heelCounterGeom.dispose();
      heelCounterMat.dispose();
      sidePanelGeomL.dispose();
      sidePanelGeomR.dispose();
      sidePanelMat.dispose();
      tongueGeom.dispose();
      tongueMat.dispose();
      tongueLabelGeom.dispose();
      tongueLabelMat.dispose();
      insoleGeom.dispose();
      insoleMat.dispose();
      lacesGeom.dispose();
      lacesMat.dispose();
      logoBadgeGeom.dispose();
      logoBadgeMat.dispose();
      pullTabGeom.dispose();
      pullTabMat.dispose();
      carbonHeelGeom.dispose();
      carbonHeelMat.dispose();
      refStripGeom.dispose();
      refStripMat.dispose();
      eyeletGeo.dispose();
      eyeletMat.dispose();
      laceTagGeom.dispose();
      laceTagMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
    };
  }, [baseModel, soleType, laces.type, laces.thickness]); 

  // Fast materials & accessories updates
  useEffect(() => {
    const meshes = meshesRef.current;
    const textures = texturesRef.current;
    if (!meshes.upper) return;

    if (meshes.midsole) {
      (meshes.midsole.material as THREE.MeshStandardMaterial).color.set(colors.midsole || '#FFFFFF');
    }
    if (meshes.outsole) {
      const outMat = meshes.outsole.material as THREE.MeshStandardMaterial;
      outMat.color.set(accessories.glowOutsole ? '#70E000' : colors.outsole || '#333333');
      outMat.emissive.set(accessories.glowOutsole ? '#70E000' : '#000000');
      outMat.emissiveIntensity = accessories.glowOutsole ? 0.7 : 0;
    }
    if (meshes.airBubbleCoreL) {
      const coreMat = meshes.airBubbleCoreL.material as THREE.MeshStandardMaterial;
      coreMat.color.set(colors.airBubble || '#00E5FF');
      coreMat.emissive.set(colors.airBubble || '#00E5FF');
    }
    if (meshes.airBubbleCoreR) {
      const coreMat = meshes.airBubbleCoreR.material as THREE.MeshStandardMaterial;
      coreMat.color.set(colors.airBubble || '#00E5FF');
      coreMat.emissive.set(colors.airBubble || '#00E5FF');
    }

    const upperMat = meshes.upper.material as THREE.MeshStandardMaterial;
    upperMat.color.set(colors.upper || '#FFFFFF');
    upperMat.roughness = material === 'leather' ? 0.35 : material === 'suede' ? 0.9 : 0.6;
    upperMat.metalness = material === 'leather' ? 0.1 : 0.0;
    upperMat.map = material === 'mesh' ? textures.mesh! : material === 'knit' ? textures.knit! : material === 'canvas' ? textures.canvas! : null;
    upperMat.bumpMap = material === 'leather' ? textures.leather! : null;
    upperMat.needsUpdate = true;

    if (meshes.toeCap) {
      const mat = meshes.toeCap.material as THREE.MeshStandardMaterial;
      mat.color.set(colors.toeBox || '#FFFFFF');
      mat.roughness = upperMat.roughness;
      mat.metalness = upperMat.metalness;
      mat.map = upperMat.map;
      mat.bumpMap = upperMat.bumpMap;
      mat.needsUpdate = true;
    }

    if (meshes.heelCounter) {
      const mat = meshes.heelCounter.material as THREE.MeshStandardMaterial;
      mat.color.set(colors.heel || '#FFFFFF');
      mat.roughness = upperMat.roughness;
      mat.metalness = upperMat.metalness;
      mat.map = upperMat.map;
      mat.bumpMap = upperMat.bumpMap;
      mat.needsUpdate = true;
    }

    if (meshes.sidePanelL && meshes.sidePanelR) {
      const panelMat = meshes.sidePanelL.material as THREE.MeshStandardMaterial;
      panelMat.color.set(colors.sidePanels || '#FFFFFF');
      panelMat.roughness = upperMat.roughness;
      panelMat.map = upperMat.map;
      panelMat.needsUpdate = true;
      meshes.sidePanelR.material = panelMat;
    }

    if (meshes.tongue) {
      const tongueMat = meshes.tongue.material as THREE.MeshStandardMaterial;
      tongueMat.color.set(colors.tongue || '#FFFFFF');
      tongueMat.roughness = upperMat.roughness;
      tongueMat.map = upperMat.map;
      tongueMat.needsUpdate = true;
    }

    if (meshes.reflectiveStrip) {
      meshes.reflectiveStrip.visible = accessories.reflectiveStrips;
    }
    if (meshes.carbonHeel) {
      meshes.carbonHeel.visible = accessories.carbonHeel;
    }
    if (meshes.laceTag) {
      meshes.laceTag.visible = accessories.laceTags;
    }
    if (meshes.tongueLabel) {
      meshes.tongueLabel.visible = !!accessories.tongueLabel;
      drawTongueLabelCanvas();
    }
    if (meshes.insole) {
      drawInsoleCanvas();
    }

    if (meshes.logoBadge) {
      meshes.logoBadge.visible = logo.type !== 'none';
      drawLogoCanvas();
      
      const lx = logo.position.x;
      const ly = logo.position.y;
      const lz3d = -0.5 + ((lx - 100) / 280) * 0.9;
      const ly3d = 0.44 - ((ly - 60) / 160) * 0.25;

      const uNorm = (lz3d + 1.1) / 2.2;
      let wUpper = 0.22;
      if (uNorm < 0.25) {
        wUpper = 0.22 + 0.08 * (uNorm / 0.25);
      } else if (uNorm < 0.65) {
        wUpper = 0.30 + 0.03 * Math.sin(((uNorm - 0.25) / 0.4) * Math.PI);
      } else {
        wUpper = 0.33 * (1 - Math.pow((uNorm - 0.65) / 0.35, 2)) + 0.02;
      }
      
      meshes.logoBadge.position.set(wUpper * 1.018, ly3d, lz3d);
      meshes.logoBadge.scale.setScalar(logo.scale);
    }

    if (meshes.laces) {
      (meshes.laces.material as THREE.MeshStandardMaterial).color.set(laces.color || '#FFFFFF');
    }

    if (meshes.eyelets) {
      meshes.eyelets.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const mat = node.material as THREE.MeshStandardMaterial;
          mat.color.set(accessories.goldEyelets ? '#FFD700' : colors.laceLoops || '#FFFFFF');
          mat.metalness = accessories.goldEyelets ? 0.95 : 0.2;
          mat.roughness = accessories.goldEyelets ? 0.1 : 0.6;
        }
      });
    }

  }, [colors, laces.color, material, logo.type, logo.value, logo.position, logo.scale, accessories]);

  // Handle Preset Angle changes
  useEffect(() => {
    isIdle.current = false;
    lastInteractionTime.current = Date.now();

    if (angle === 'side') {
      targetRotationY.current = 0.45;
      targetRotationX.current = 0.08;
    } else if (angle === 'front') {
      targetRotationY.current = -Math.PI / 2.2;
      targetRotationX.current = 0.12;
    } else if (angle === 'top') {
      targetRotationY.current = 0.0;
      targetRotationX.current = Math.PI / 2.05; 
    } else if (angle === 'back') {
      targetRotationY.current = Math.PI * 0.9; 
      targetRotationX.current = 0.08;
    } else if (angle === 'sole') {
      targetRotationY.current = 0.0;
      targetRotationX.current = -Math.PI / 1.95; 
    } else if (angle === 'orbit') {
      targetRotationY.current = Math.PI / 3.8;
      targetRotationX.current = 0.28;
    }
  }, [angle]);

  // Showcase Spin Handler
  const handleFullSpin = () => {
    isIdle.current = false;
    lastInteractionTime.current = Date.now();
    setIsSpinning(true);
    targetRotationY.current += Math.PI * 2;
    setTimeout(() => setIsSpinning(false), 1200);
  };

  // Pointer dragging event handlers
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isIdle.current = false;
    lastInteractionTime.current = Date.now();
    isDragging.current = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    startMouseX.current = clientX;
    startMouseY.current = clientY;

    if (canvasRef.current && rendererRef.current && cameraRef.current && logo.type !== 'none') {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      
      const intersectsUpper = raycaster.intersectObject(meshesRef.current.upper!);
      
      if (intersectsUpper.length > 0) {
        const hitPoint = intersectsUpper[0].point;
        if (shoeGroupRef.current) {
          const localHit = shoeGroupRef.current.worldToLocal(hitPoint.clone());
          if (localHit.x > 0.05 && localHit.z > -0.7 && localHit.z < 0.6) {
            isDraggingLogo.current = true;
            isDragging.current = false;
            handleLogoDrag(localHit);
          }
        }
      }
    }
  };

  const handleLogoDrag = (localPoint: THREE.Vector3) => {
    const lx = Math.round(100 + ((localPoint.z + 0.5) / 0.9) * 280);
    const ly = Math.round(60 + ((0.44 - localPoint.y) / 0.25) * 160);
    
    const clampedX = Math.max(100, Math.min(380, lx));
    const clampedY = Math.max(60, Math.min(220, ly));

    onLogoPositionChange({ x: clampedX, y: clampedY });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current && !isDraggingLogo.current) return;
    
    isIdle.current = false;
    lastInteractionTime.current = Date.now();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (isDraggingLogo.current && canvasRef.current && cameraRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
      
      const intersects = raycaster.intersectObject(meshesRef.current.upper!);
      if (intersects.length > 0 && shoeGroupRef.current) {
        const localHit = shoeGroupRef.current.worldToLocal(intersects[0].point.clone());
        handleLogoDrag(localHit);
      }
    } else {
      const deltaX = clientX - startMouseX.current;
      const deltaY = clientY - startMouseY.current;

      targetRotationY.current = rotationYRef.current + deltaX * 0.008;
      targetRotationX.current = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, rotationXRef.current + deltaY * 0.008)
      );

      startMouseX.current = clientX;
      startMouseY.current = clientY;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    isDraggingLogo.current = false;
  };

  return (
    <div className="preview-stage-wrapper">
      {/* Interactive 3D Canvas Stage */}
      <div 
        ref={containerRef}
        className="interactive-drag-container"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ cursor: isDraggingLogo.current ? 'grabbing' : 'grab' }}
      >
        <div className="shoe-ambient-lighting" />
        
        <canvas ref={canvasRef} className="shoe-3d-canvas" />

        <div className="drag-hint">
          <Move3D size={14} />
          <span>Drag to rotate 360° | Drag logo badge to reposition</span>
        </div>
      </div>

      {/* Floating Camera Angles, Turntable & Zoom Toolbar */}
      <div className="camera-nav-bar">
        <div className="view-angle-buttons">
          {(['side', 'front', 'top', 'back', 'sole', 'orbit'] as const).map((vAngle) => (
            <button 
              key={vAngle}
              className={`camera-angle-tab ${angle === vAngle ? 'active' : ''}`}
              onClick={() => setAngle(vAngle)}
            >
              {vAngle.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="motion-control-group">
          {/* Showcase 360 Spin Button */}
          <button 
            className={`motion-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={handleFullSpin}
            title="360° Full Showcase Spin"
          >
            <RotateCw size={16} className={isSpinning ? 'animate-spin' : ''} />
            <span className="btn-label-desktop">Spin 360°</span>
          </button>

          {/* Auto rotate toggle */}
          <button 
            className={`motion-btn ${isAutoRotate ? 'active' : ''}`}
            onClick={() => setIsAutoRotate(prev => !prev)}
            title={isAutoRotate ? "Pause Turntable Auto-Rotation" : "Enable Turntable Auto-Rotation"}
          >
            {isAutoRotate ? <Pause size={16} /> : <Play size={16} />}
            <span className="btn-label-desktop">{isAutoRotate ? "Auto-Rotate" : "Static"}</span>
          </button>

          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.7, z - 0.1))} title="Zoom Out">
              <Minus size={16} />
            </button>
            <span className="zoom-val">{Math.round(zoom * 100)}%</span>
            <button className="zoom-btn" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} title="Zoom In">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
