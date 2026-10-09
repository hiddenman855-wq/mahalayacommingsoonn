import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface FlameColorOption {
  id: string;
  name: string;
  hex: string;
  innerHex: string;
  auraHex: string;
}

interface PradipCanvas3DProps {
  isLit: boolean;
  color: FlameColorOption;
  flameSize?: number; // 0 to 1
}

export const PradipCanvas3D: React.FC<PradipCanvas3DProps> = ({
  isLit,
  color,
  flameSize = 1,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flameGroupRef = useRef<THREE.Group | null>(null);
  const flamePointLightRef = useRef<THREE.PointLight | null>(null);
  const flameOuterMeshRef = useRef<THREE.Mesh | null>(null);
  const flameInnerMeshRef = useRef<THREE.Mesh | null>(null);
  const flameAuraMeshRef = useRef<THREE.Mesh | null>(null);
  const pradipGroupRef = useRef<THREE.Group | null>(null);
  const embersRef = useRef<THREE.Points | null>(null);

  // Interaction dragging rotation
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const rotationVelocityRef = useRef(0.003);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 1.2, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Environmental Studio Lighting for Realistic Antique Brass
    const ambientLight = new THREE.AmbientLight(0xfff1db, 0.6);
    scene.add(ambientLight);

    // Directional Key Light (Warm golden sunrise)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    // Cool rim light for brass edge separation
    const rimLight = new THREE.DirectionalLight(0x8899bb, 0.8);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Soft warm fill light
    const fillLight = new THREE.DirectionalLight(0xbb6622, 0.7);
    fillLight.position.set(0, -2, 4);
    scene.add(fillLight);

    // 4. Ground Plane with Alpana / Terracotta Pattern
    const groundGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.08, 48);

    // Generate canvas texture for circular Bengali Alpana pattern
    const alpanaCanvas = document.createElement('canvas');
    alpanaCanvas.width = 512;
    alpanaCanvas.height = 512;
    const actx = alpanaCanvas.getContext('2d');
    if (actx) {
      // Terracotta base
      actx.fillStyle = '#2d1109';
      actx.fillRect(0, 0, 512, 512);

      // Concentric circles
      actx.strokeStyle = 'rgba(255, 235, 205, 0.55)';
      actx.lineWidth = 3;
      actx.beginPath();
      actx.arc(256, 256, 240, 0, Math.PI * 2);
      actx.stroke();
      actx.beginPath();
      actx.arc(256, 256, 180, 0, Math.PI * 2);
      actx.stroke();
      actx.beginPath();
      actx.arc(256, 256, 110, 0, Math.PI * 2);
      actx.stroke();

      // Radiating alpana lotus petals
      for (let i = 0; i < 16; i++) {
        actx.save();
        actx.translate(256, 256);
        actx.rotate((i * Math.PI) / 8);
        actx.fillStyle = 'rgba(255, 240, 220, 0.45)';
        actx.beginPath();
        actx.ellipse(0, 140, 14, 32, 0, 0, Math.PI * 2);
        actx.fill();
        actx.restore();
      }
    }
    const alpanaTexture = new THREE.CanvasTexture(alpanaCanvas);
    const groundMat = new THREE.MeshStandardMaterial({
      map: alpanaTexture,
      roughness: 0.85,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.04;
    scene.add(groundMesh);

    // 5. 3D Traditional Bengali Brass Pradip (Diya) Model
    const pradipGroup = new THREE.Group();
    pradipGroupRef.current = pradipGroup;
    scene.add(pradipGroup);

    // Brass PBR Material
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xdfb14e,
      roughness: 0.28,
      metalness: 0.88,
    });

    // Tier 1: Circular Fluted Pedestal Base
    const basePlateGeo = new THREE.CylinderGeometry(1.2, 1.45, 0.16, 36);
    const basePlate = new THREE.Mesh(basePlateGeo, brassMat);
    basePlate.position.y = 0.08;
    pradipGroup.add(basePlate);

    const baseRingGeo = new THREE.TorusGeometry(1.15, 0.07, 16, 36);
    const baseRing = new THREE.Mesh(baseRingGeo, brassMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.18;
    pradipGroup.add(baseRing);

    // Tier 2: Lower Bell Dome
    const bellDomeGeo = new THREE.CylinderGeometry(0.55, 1.05, 0.35, 32);
    const bellDome = new THREE.Mesh(bellDomeGeo, brassMat);
    bellDome.position.y = 0.35;
    pradipGroup.add(bellDome);

    // Tier 3: Turned Fluted Central Brass Stem
    const stemGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.85, 24);
    const stem = new THREE.Mesh(stemGeo, brassMat);
    stem.position.y = 0.9;
    pradipGroup.add(stem);

    // Stem Center Ring
    const stemRingGeo = new THREE.TorusGeometry(0.32, 0.06, 16, 24);
    const stemRing = new THREE.Mesh(stemRingGeo, brassMat);
    stemRing.rotation.x = Math.PI / 2;
    stemRing.position.y = 0.9;
    pradipGroup.add(stemRing);

    // Tier 4: Upper Collar
    const upperCollarGeo = new THREE.CylinderGeometry(0.65, 0.25, 0.3, 32);
    const upperCollar = new THREE.Mesh(upperCollarGeo, brassMat);
    upperCollar.position.y = 1.45;
    pradipGroup.add(upperCollar);

    // Tier 5: Brass Diya Oil Basin Bowl
    const bowlOuterGeo = new THREE.CylinderGeometry(1.35, 0.65, 0.42, 36);
    const bowlOuter = new THREE.Mesh(bowlOuterGeo, brassMat);
    bowlOuter.position.y = 1.75;
    pradipGroup.add(bowlOuter);

    // Bowl Lip Rim
    const bowlLipGeo = new THREE.TorusGeometry(1.35, 0.08, 16, 36);
    const bowlLip = new THREE.Mesh(bowlLipGeo, brassMat);
    bowlLip.rotation.x = Math.PI / 2;
    bowlLip.position.y = 1.95;
    pradipGroup.add(bowlLip);

    // Inner Oil Pool (Ghee / Mustard Oil)
    const oilGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.05, 32);
    const oilMat = new THREE.MeshStandardMaterial({
      color: 0x9e6a12,
      roughness: 0.1,
      metalness: 0.2,
    });
    const oilMesh = new THREE.Mesh(oilGeo, oilMat);
    oilMesh.position.y = 1.88;
    pradipGroup.add(oilMesh);

    // Center Sacred Finial / Wick Column
    const centerFinialGeo = new THREE.ConeGeometry(0.3, 0.6, 24);
    const centerFinial = new THREE.Mesh(centerFinialGeo, brassMat);
    centerFinial.position.y = 2.15;
    pradipGroup.add(centerFinial);

    // Cotton Wick (সলতে) with charred tip
    const wickGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.26, 12);
    const wickMat = new THREE.MeshStandardMaterial({
      color: 0x2b1c10,
      roughness: 0.9,
    });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.set(0, 2.45, 0);
    pradipGroup.add(wick);

    // 6. REALISTIC 3D ANIMATED FLAME SYSTEM
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 2.58, 0);
    flameGroupRef.current = flameGroup;
    pradipGroup.add(flameGroup);

    // PointLight casting dynamic light spill from the flame
    const flamePointLight = new THREE.PointLight(color.hex, 2.4, 6.5);
    flamePointLight.position.set(0, 0.35, 0);
    flameGroup.add(flamePointLight);
    flamePointLightRef.current = flamePointLight;

    // Custom teardrop flame geometry
    const createFlameGeometry = (radius: number, height: number) => {
      const geom = new THREE.ConeGeometry(radius, height, 20, 20, false);
      const pos = geom.attributes.position;
      // Morph cone into smooth teardrop fire shape
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const normY = (y + height / 2) / height; // 0 (base) to 1 (tip)
        // Bulge slightly at lower third
        const bulge = Math.sin(normY * Math.PI) * 0.45 + 0.65;
        pos.setX(i, pos.getX(i) * bulge);
        pos.setZ(i, pos.getZ(i) * bulge);
      }
      geom.computeVertexNormals();
      return geom;
    };

    // Outer Flame Envelope Mesh
    const flameOuterGeo = createFlameGeometry(0.34, 0.9);
    const flameOuterMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color.hex),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const flameOuterMesh = new THREE.Mesh(flameOuterGeo, flameOuterMat);
    flameOuterMesh.position.y = 0.42;
    flameGroup.add(flameOuterMesh);
    flameOuterMeshRef.current = flameOuterMesh;

    // Inner White-Hot Core Mesh
    const flameInnerGeo = createFlameGeometry(0.18, 0.55);
    const flameInnerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color.innerHex),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const flameInnerMesh = new THREE.Mesh(flameInnerGeo, flameInnerMat);
    flameInnerMesh.position.y = 0.25;
    flameGroup.add(flameInnerMesh);
    flameInnerMeshRef.current = flameInnerMesh;

    // Outer Volumetric Aura / Glow Plane
    const auraGeo = new THREE.PlaneGeometry(1.6, 1.6);
    // Create soft radial aura texture
    const auraCanvas = document.createElement('canvas');
    auraCanvas.width = 128;
    auraCanvas.height = 128;
    const auraCtx = auraCanvas.getContext('2d');
    if (auraCtx) {
      const grad = auraCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.3, 'rgba(255, 220, 120, 0.5)');
      grad.addColorStop(0.7, 'rgba(240, 140, 30, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      auraCtx.fillStyle = grad;
      auraCtx.fillRect(0, 0, 128, 128);
    }
    const auraTexture = new THREE.CanvasTexture(auraCanvas);
    const auraMat = new THREE.MeshBasicMaterial({
      map: auraTexture,
      transparent: true,
      opacity: 0.7,
      color: new THREE.Color(color.auraHex),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flameAuraMesh = new THREE.Mesh(auraGeo, auraMat);
    flameAuraMesh.position.y = 0.45;
    flameGroup.add(flameAuraMesh);
    flameAuraMeshRef.current = flameAuraMesh;

    // Rising Golden Embers / Holy Sparks
    const emberCount = 28;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberSpeeds = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 0.3;
      emberPositions[i * 3 + 1] = 0.3 + Math.random() * 0.9;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      emberSpeeds[i] = 0.015 + Math.random() * 0.025;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

    const emberMat = new THREE.PointsMaterial({
      color: new THREE.Color(color.hex),
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    flameGroup.add(embers);
    embersRef.current = embers;

    // Initial lit visibility
    flameGroup.visible = isLit;

    // 7. Touch & Mouse Drag Rotation Interaction
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      prevMouseXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !pradipGroupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMouseXRef.current;
      prevMouseXRef.current = clientX;
      pradipGroupRef.current.rotation.y += deltaX * 0.008;
      rotationVelocityRef.current = deltaX * 0.002;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    domElement.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    domElement.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle continuous turntable rotation when not dragging
      if (!isDraggingRef.current && pradipGroupRef.current) {
        rotationVelocityRef.current *= 0.98;
        if (Math.abs(rotationVelocityRef.current) < 0.002) {
          rotationVelocityRef.current = 0.0025;
        }
        pradipGroupRef.current.rotation.y += rotationVelocityRef.current;
      }

      // Realistic 3D Organic Flame Flickering & Oscillation
      if (flameGroupRef.current && flameGroupRef.current.visible) {
        // Natural fire flicker math
        const flickerX = Math.sin(time * 18) * 0.05 + Math.sin(time * 35) * 0.02;
        const flickerZ = Math.cos(time * 22) * 0.05 + Math.cos(time * 41) * 0.02;
        const stretchY = 1 + Math.sin(time * 26) * 0.08 + Math.sin(time * 11) * 0.04;

        if (flameOuterMeshRef.current) {
          flameOuterMeshRef.current.rotation.x = flickerX * 0.8;
          flameOuterMeshRef.current.rotation.z = flickerZ * 0.8;
          flameOuterMeshRef.current.scale.set(1 + flickerZ * 0.3, stretchY, 1 + flickerX * 0.3);
        }

        if (flameInnerMeshRef.current) {
          flameInnerMeshRef.current.rotation.x = flickerX * 0.4;
          flameInnerMeshRef.current.rotation.z = flickerZ * 0.4;
          flameInnerMeshRef.current.scale.set(1, stretchY * 0.95, 1);
        }

        if (flameAuraMeshRef.current) {
          // Keep aura facing camera
          flameAuraMeshRef.current.quaternion.copy(camera.quaternion);
          const auraPulse = 1 + Math.sin(time * 15) * 0.06;
          flameAuraMeshRef.current.scale.set(auraPulse, auraPulse, auraPulse);
        }

        // Dynamic light flickering on brass surface and floor
        if (flamePointLightRef.current) {
          flamePointLightRef.current.intensity = 2.2 + Math.sin(time * 20) * 0.4 + Math.sin(time * 42) * 0.2;
        }

        // Rising embers animation
        if (embersRef.current) {
          const positions = embersRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < emberCount; i++) {
            positions[i * 3 + 1] += emberSpeeds[i];
            positions[i * 3] += Math.sin(time * 10 + i) * 0.003;
            // Reset when reaching top
            if (positions[i * 3 + 1] > 1.3) {
              positions[i * 3 + 1] = 0.3;
              positions[i * 3] = (Math.random() - 0.5) * 0.2;
              positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
            }
          }
          embersRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      domElement.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Flame Visibility & Scale on isLit and flameSize changes
  useEffect(() => {
    if (flameGroupRef.current) {
      flameGroupRef.current.visible = isLit;
      flameGroupRef.current.scale.set(flameSize, flameSize, flameSize);
    }
  }, [isLit, flameSize]);

  // Update Real-time Realistic 3D Flame Colors
  useEffect(() => {
    if (!flameGroupRef.current) return;

    if (flameOuterMeshRef.current) {
      const mat = flameOuterMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(color.hex);
    }

    if (flameInnerMeshRef.current) {
      const mat = flameInnerMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(color.innerHex);
    }

    if (flameAuraMeshRef.current) {
      const mat = flameAuraMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(color.auraHex);
    }

    if (flamePointLightRef.current) {
      flamePointLightRef.current.color.set(color.hex);
    }

    if (embersRef.current) {
      const mat = embersRef.current.material as THREE.PointsMaterial;
      mat.color.set(color.hex);
    }
  }, [color]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[360px] sm:min-h-[440px] md:min-h-[480px] cursor-grab active:cursor-grabbing select-none"
    />
  );
};
