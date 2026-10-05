'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, RefreshCw, Sparkles } from 'lucide-react';

interface Avatar3DViewerProps {
  avatarUrl?: string;
}

export const Avatar3DViewer: React.FC<Avatar3DViewerProps> = ({ avatarUrl = '/avatars/male-1.png' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const targetRotationYRef = useRef(0);
  const targetRotationXRef = useRef(0);
  const currentRotationYRef = useRef(0);
  const currentRotationXRef = useRef(0);
  const lastUserInteractionTime = useRef(Date.now());

  // Determine avatar style preset from avatarUrl
  const getStyleKey = (url: string) => {
    if (url.includes('female-1')) return 'female-1';
    if (url.includes('female-2')) return 'female-2';
    if (url.includes('female-3')) return 'female-3';
    if (url.includes('female-4')) return 'female-4';
    if (url.includes('male-2')) return 'male-2';
    if (url.includes('male-3')) return 'male-3';
    if (url.includes('male-4')) return 'male-4';
    return 'male-1'; // default: corporate suit & tie
  };

  const styleKey = getStyleKey(avatarUrl);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.22, 4.4);
    camera.lookAt(0, 1.05, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key front-right light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill cyan-blue rim light (left-back)
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Soft top accent light
    const topLight = new THREE.DirectionalLight(0x818cf8, 1.0);
    topLight.position.set(0, 7, 1);
    scene.add(topLight);

    // 3. Circular Pedestal with glowing ring
    const pedestalGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.15, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x11162b,
      roughness: 0.4,
      metalness: 0.6,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.075;
    pedestal.receiveShadow = true;
    pedestalGroup.add(pedestal);

    // Glowing cyan/indigo ring on base
    const ringGeo = new THREE.TorusGeometry(1.42, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    pedestalGroup.add(ring);
    scene.add(pedestalGroup);

    // 4. Build 3D Stylized Figurine
    const characterGroup = new THREE.Group();

    // Style-specific colors & themes
    const themes: Record<
      string,
      {
        jacket: number;
        pants: number;
        shirt: number;
        tie: number;
        shoes: number;
        hair: number;
        skin: number;
        hasGlasses?: boolean;
        hasHeadphones?: boolean;
        hasPonytail?: boolean;
        hasBob?: boolean;
        hasBun?: boolean;
        hasTablet?: boolean;
        hasLaptop?: boolean;
      }
    > = {
      'male-1': {
        jacket: 0x8b6e56, // warm brown suit
        pants: 0x6d533f,
        shirt: 0xffffff,
        tie: 0xd9534f, // striped red/orange tie
        shoes: 0x4a2e18,
        hair: 0x734822,
        skin: 0xffd1b3,
      },
      'male-2': {
        jacket: 0x1e3a8a, // navy blue blazer
        pants: 0x475569,
        shirt: 0xf8fafc,
        tie: 0x0284c7,
        shoes: 0x334155,
        hair: 0x78350f,
        skin: 0xffd1b3,
      },
      'male-3': {
        jacket: 0x0f766e, // teal hoodie
        pants: 0x334155,
        shirt: 0x14b8a6,
        tie: 0x0f766e,
        shoes: 0x78350f,
        hair: 0x5c3818,
        skin: 0xffd1b3,
        hasGlasses: true,
      },
      'male-4': {
        jacket: 0x0f172a, // dark tech tee
        pants: 0x1e293b,
        shirt: 0x06b6d4,
        tie: 0x06b6d4,
        shoes: 0x0f172a,
        hair: 0x18181b,
        skin: 0xffd1b3,
        hasHeadphones: true,
      },
      'female-1': {
        jacket: 0x1e293b, // smart blazer
        pants: 0x334155,
        shirt: 0xffffff,
        tie: 0x38bdf8,
        shoes: 0x78350f,
        hair: 0x6b3a19,
        skin: 0xffd8be,
        hasPonytail: true,
      },
      'female-2': {
        jacket: 0xa855f7, // lavender knit sweater
        pants: 0x1e293b,
        shirt: 0xc084fc,
        tie: 0xa855f7,
        shoes: 0x64748b,
        hair: 0x854d0e,
        skin: 0xffd8be,
        hasBob: true,
        hasTablet: true,
      },
      'female-3': {
        jacket: 0x16a34a, // green hoodie
        pants: 0x1f2937,
        shirt: 0x22c55e,
        tie: 0x16a34a,
        shoes: 0x111827,
        hair: 0x1f2937,
        skin: 0xffd8be,
        hasGlasses: true,
        hasBun: true,
      },
      'female-4': {
        jacket: 0x2563eb, // denim jacket
        pants: 0x111827,
        shirt: 0x38bdf8,
        tie: 0x2563eb,
        shoes: 0x78350f,
        hair: 0x111827,
        skin: 0xffd8be,
        hasLaptop: true,
      },
    };

    const currentTheme = themes[styleKey] || themes['male-1'];

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: currentTheme.skin,
      roughness: 0.35,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: currentTheme.hair,
      roughness: 0.45,
      metalness: 0.1,
    });

    const jacketMat = new THREE.MeshStandardMaterial({
      color: currentTheme.jacket,
      roughness: 0.65,
      metalness: 0.05,
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: currentTheme.pants,
      roughness: 0.7,
      metalness: 0.05,
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: currentTheme.shirt,
      roughness: 0.5,
      metalness: 0.05,
    });

    const tieMat = new THREE.MeshStandardMaterial({
      color: currentTheme.tie,
      roughness: 0.3,
      metalness: 0.1,
    });

    const shoesMat = new THREE.MeshStandardMaterial({
      color: currentTheme.shoes,
      roughness: 0.3,
      metalness: 0.2,
    });

    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });

    const eyeIrisMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.1,
    });

    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // --- SHOES & FEET ---
    [-0.22, 0.22].forEach((xPos) => {
      const shoeGeo = new THREE.BoxGeometry(0.24, 0.14, 0.36);
      const shoe = new THREE.Mesh(shoeGeo, shoesMat);
      shoe.position.set(xPos, 0.07, 0.04);
      shoe.castShadow = true;
      characterGroup.add(shoe);
    });

    // --- LEGS & PANTS ---
    [-0.22, 0.22].forEach((xPos) => {
      const legGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.62, 24);
      const leg = new THREE.Mesh(legGeo, pantsMat);
      leg.position.set(xPos, 0.42, 0);
      leg.castShadow = true;
      characterGroup.add(leg);

      // Pants cuff ring
      const cuffGeo = new THREE.TorusGeometry(0.135, 0.02, 12, 24);
      const cuff = new THREE.Mesh(cuffGeo, pantsMat);
      cuff.rotation.x = Math.PI / 2;
      cuff.position.set(xPos, 0.14, 0);
      characterGroup.add(cuff);
    });

    // --- TORSO & WAIST ---
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.72, 32);
    const torso = new THREE.Mesh(torsoGeo, jacketMat);
    torso.position.set(0, 1.05, 0);
    torso.castShadow = true;
    characterGroup.add(torso);

    // Shirt collar / chest inset
    const shirtGeo = new THREE.BoxGeometry(0.26, 0.42, 0.08);
    const shirt = new THREE.Mesh(shirtGeo, shirtMat);
    shirt.position.set(0, 1.2, 0.33);
    characterGroup.add(shirt);

    // Tie or Tech Pendant
    const tieGeo = new THREE.BoxGeometry(0.1, 0.35, 0.04);
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 1.15, 0.38);
    characterGroup.add(tie);

    // Belt
    const beltGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.08, 32);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.set(0, 0.72, 0);
    characterGroup.add(belt);

    // Belt Buckle
    const buckleGeo = new THREE.BoxGeometry(0.12, 0.09, 0.04);
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 0.72, 0.33);
    characterGroup.add(buckle);

    // --- ARMS & HANDS ---
    // Left Arm (relaxed at side)
    const leftArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.55, 24);
    const leftArm = new THREE.Mesh(leftArmGeo, jacketMat);
    leftArm.position.set(-0.48, 1.05, 0);
    leftArm.rotation.z = 0.15;
    leftArm.castShadow = true;
    characterGroup.add(leftArm);

    const leftHandGeo = new THREE.SphereGeometry(0.1, 24, 24);
    const leftHand = new THREE.Mesh(leftHandGeo, skinMat);
    leftHand.position.set(-0.52, 0.74, 0);
    characterGroup.add(leftHand);

    // Right Arm (bent up with celebratory thumbs-up pose!)
    const rightUpperArmGeo = new THREE.CylinderGeometry(0.09, 0.085, 0.36, 24);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, jacketMat);
    rightUpperArm.position.set(0.48, 1.18, 0.05);
    rightUpperArm.rotation.z = -0.55;
    rightUpperArm.rotation.x = -0.2;
    characterGroup.add(rightUpperArm);

    const rightForearmGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.34, 24);
    const rightForearm = new THREE.Mesh(rightForearmGeo, jacketMat);
    rightForearm.position.set(0.65, 1.45, 0.22);
    rightForearm.rotation.z = 0.3;
    rightForearm.rotation.x = -0.8;
    characterGroup.add(rightForearm);

    // Right Hand with Thumbs-up
    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0.68, 1.62, 0.36);

    const handBase = new THREE.SphereGeometry(0.095, 24, 24);
    const rightHandMesh = new THREE.Mesh(handBase, skinMat);
    rightHandGroup.add(rightHandMesh);

    // Raised Thumb
    const thumbGeo = new THREE.CylinderGeometry(0.038, 0.042, 0.14, 16);
    const thumb = new THREE.Mesh(thumbGeo, skinMat);
    thumb.position.set(0, 0.1, 0.02);
    thumb.rotation.z = 0.15;
    rightHandGroup.add(thumb);

    characterGroup.add(rightHandGroup);

    // --- HEAD & NECK ---
    const neckGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.16, 24);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 1.44, 0);
    characterGroup.add(neck);

    // Stylized Chibi/Pixar Head
    const headGeo = new THREE.SphereGeometry(0.52, 36, 36);
    headGeo.scale(1.0, 1.05, 0.95);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 1.95, 0);
    head.castShadow = true;
    characterGroup.add(head);

    // Ears
    [-0.52, 0.52].forEach((xPos) => {
      const earGeo = new THREE.SphereGeometry(0.12, 16, 16);
      earGeo.scale(0.6, 1.0, 0.8);
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.position.set(xPos, 1.95, -0.05);
      characterGroup.add(ear);
    });

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.065, 16, 16);
    noseGeo.scale(1.1, 0.9, 1.0);
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, 1.92, 0.51);
    characterGroup.add(nose);

    // Cheerful Mouth / Smile
    const mouthGeo = new THREE.TorusGeometry(0.11, 0.025, 16, 32, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x881337 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.78, 0.49);
    mouth.rotation.x = Math.PI * 0.95;
    mouth.rotation.z = Math.PI;
    characterGroup.add(mouth);

    // Big expressive eyes
    [-0.18, 0.18].forEach((xPos) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 2.02, 0.46);

      // Sclera (White)
      const whiteGeo = new THREE.SphereGeometry(0.12, 24, 24);
      whiteGeo.scale(1.0, 1.1, 0.5);
      const eyeWhite = new THREE.Mesh(whiteGeo, eyeWhiteMat);
      eyeGroup.add(eyeWhite);

      // Iris (Warm Brown)
      const irisGeo = new THREE.SphereGeometry(0.075, 20, 20);
      irisGeo.scale(1.0, 1.0, 0.3);
      const eyeIris = new THREE.Mesh(irisGeo, eyeIrisMat);
      eyeIris.position.set(0, 0, 0.05);
      eyeGroup.add(eyeIris);

      // Pupil (Deep Black)
      const pupilGeo = new THREE.SphereGeometry(0.045, 16, 16);
      pupilGeo.scale(1.0, 1.0, 0.2);
      const eyePupil = new THREE.Mesh(pupilGeo, eyePupilMat);
      eyePupil.position.set(0, 0, 0.07);
      eyeGroup.add(eyePupil);

      // Catchlight (Glossy white spark)
      const sparkGeo = new THREE.SphereGeometry(0.022, 12, 12);
      const eyeSpark = new THREE.Mesh(sparkGeo, eyeHighlightMat);
      eyeSpark.position.set(0.025, 0.025, 0.085);
      eyeGroup.add(eyeSpark);

      // Eyebrow
      const browGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.16, 16);
      const brow = new THREE.Mesh(browGeo, hairMat);
      brow.rotation.z = xPos > 0 ? -0.2 : 0.2;
      brow.rotation.x = Math.PI / 2;
      brow.position.set(0, 0.16, 0.03);
      eyeGroup.add(brow);

      characterGroup.add(eyeGroup);
    });

    // --- STYLIZED HAIR MESHES ---
    const hairGroup = new THREE.Group();
    hairGroup.position.set(0, 2.05, 0);

    // Hair base dome
    const hairCapGeo = new THREE.SphereGeometry(0.55, 32, 32);
    hairCapGeo.scale(1.02, 1.05, 1.05);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.05, -0.06);
    hairGroup.add(hairCap);

    // Volumetric swooping hair tufts
    const tuftSpecs = [
      { pos: [0, 0.52, 0.12], rot: [0.3, 0, 0], scale: [0.34, 0.44, 0.3] },
      { pos: [0.18, 0.48, 0.1], rot: [0.2, 0.2, -0.3], scale: [0.28, 0.38, 0.26] },
      { pos: [-0.18, 0.48, 0.1], rot: [0.2, -0.2, 0.3], scale: [0.28, 0.38, 0.26] },
      { pos: [0.08, 0.58, 0.02], rot: [0.4, 0.1, -0.15], scale: [0.24, 0.36, 0.22] },
      { pos: [-0.08, 0.56, -0.05], rot: [0.35, -0.1, 0.15], scale: [0.25, 0.35, 0.22] },
    ];

    tuftSpecs.forEach((spec) => {
      const tuftGeo = new THREE.ConeGeometry(0.24, 0.55, 16);
      tuftGeo.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
      const tuft = new THREE.Mesh(tuftGeo, hairMat);
      tuft.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      tuft.rotation.set(spec.rot[0], spec.rot[1], spec.rot[2]);
      hairGroup.add(tuft);
    });

    // Special Female Hair Styles
    if (currentTheme.hasPonytail) {
      const ponyGeo = new THREE.CylinderGeometry(0.08, 0.16, 0.85, 24);
      const ponytail = new THREE.Mesh(ponyGeo, hairMat);
      ponytail.position.set(0, 0.25, -0.6);
      ponytail.rotation.x = -0.55;
      hairGroup.add(ponytail);
    } else if (currentTheme.hasBun) {
      const bunGeo = new THREE.SphereGeometry(0.28, 24, 24);
      const bun = new THREE.Mesh(bunGeo, hairMat);
      bun.position.set(0, 0.65, -0.1);
      hairGroup.add(bun);
    }

    characterGroup.add(hairGroup);

    // Optional Accessories
    if (currentTheme.hasGlasses) {
      [-0.18, 0.18].forEach((xPos) => {
        const frameGeo = new THREE.TorusGeometry(0.11, 0.018, 12, 32);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(xPos, 2.02, 0.52);
        characterGroup.add(frame);
      });
      // Bridge
      const bridgeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12);
      const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
      const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 2.02, 0.52);
      characterGroup.add(bridge);
    }

    if (currentTheme.hasHeadphones) {
      const bandGeo = new THREE.TorusGeometry(0.56, 0.035, 16, 48, Math.PI);
      const phoneMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.7 });
      const band = new THREE.Mesh(bandGeo, phoneMat);
      band.position.set(0, 2.02, -0.05);
      characterGroup.add(band);

      [-0.56, 0.56].forEach((xPos) => {
        const cupGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
        const cup = new THREE.Mesh(cupGeo, phoneMat);
        cup.rotation.z = Math.PI / 2;
        cup.position.set(xPos, 1.95, -0.05);
        characterGroup.add(cup);
      });
    }

    if (currentTheme.hasTablet) {
      const tabletGeo = new THREE.BoxGeometry(0.35, 0.48, 0.03);
      const tabletMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
      const tablet = new THREE.Mesh(tabletGeo, tabletMat);
      tablet.position.set(-0.45, 1.25, 0.3);
      tablet.rotation.set(0.3, 0.4, -0.2);
      characterGroup.add(tablet);
    }

    if (currentTheme.hasLaptop) {
      const laptopGeo = new THREE.BoxGeometry(0.42, 0.32, 0.04);
      const laptopMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      const laptop = new THREE.Mesh(laptopGeo, laptopMat);
      laptop.position.set(-0.42, 1.15, 0.2);
      laptop.rotation.set(0.2, 0.3, -0.1);
      characterGroup.add(laptop);
    }

    // Centering & scale character
    characterGroup.scale.set(0.9, 0.9, 0.9);
    characterGroup.position.set(0, 0, 0);
    scene.add(characterGroup);

    // 5. Drag-to-Rotate 360° Interaction Handlers
    let isPointerDown = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      isPointerDown = true;
      setIsDragging(true);
      setAutoRotate(false);
      lastUserInteractionTime.current = Date.now();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isPointerDown) return;
      lastUserInteractionTime.current = Date.now();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      // 360-degree horizontal rotation
      targetRotationYRef.current += deltaX * 0.012;
      // Clamped vertical tilt
      targetRotationXRef.current = Math.max(
        -0.25,
        Math.min(0.25, targetRotationXRef.current + deltaY * 0.006)
      );

      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      setIsDragging(false);
      lastUserInteractionTime.current = Date.now();
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 6. Resize Observer
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // 7. Animation Loop with Inertia, Auto-Rotation & Breathing
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Resume subtle auto-rotation if untouched for > 3.5 seconds
      if (!isPointerDown && Date.now() - lastUserInteractionTime.current > 3500) {
        targetRotationYRef.current += 0.005;
      }

      // Smooth damping interpolation (Lerp)
      currentRotationYRef.current +=
        (targetRotationYRef.current - currentRotationYRef.current) * 0.08;
      currentRotationXRef.current +=
        (targetRotationXRef.current - currentRotationXRef.current) * 0.08;

      characterGroup.rotation.y = currentRotationYRef.current;
      characterGroup.rotation.x = currentRotationXRef.current;

      // Pedestal follows Y rotation smoothly
      pedestalGroup.rotation.y = currentRotationYRef.current * 0.5;

      // Gentle floating / breathing idle animation
      characterGroup.position.y = Math.sin(time * 2.2) * 0.035;

      // Glowing pedestal ring pulse
      ringMat.opacity = 0.6 + Math.sin(time * 3) * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [styleKey]);

  const handleResetAngle = (e: React.MouseEvent) => {
    e.stopPropagation();
    targetRotationYRef.current = 0;
    targetRotationXRef.current = 0;
    lastUserInteractionTime.current = Date.now();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '420px',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        background: 'radial-gradient(circle at 50% 30%, #151a35 0%, #080a14 85%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Floating 360° Drag Hint Badge */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: 'rgba(7, 9, 19, 0.75)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--cyan)',
          fontSize: '0.72rem',
          fontWeight: 600,
          pointerEvents: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        }}
      >
        <Rotate3d size={13} className={isDragging ? 'spin-icon' : ''} />
        <span>360° Drag to Rotate</span>
      </div>

      {/* Floating Reset View Button */}
      <button
        type="button"
        onClick={handleResetAngle}
        title="Reset 360° Angle"
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(7, 9, 19, 0.75)',
          border: '1px solid var(--border-dim)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = 'var(--cyan)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-dim)';
        }}
      >
        <RefreshCw size={13} />
      </button>
    </div>
  );
};
