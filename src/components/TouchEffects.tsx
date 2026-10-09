import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  isShiuli: boolean;
  rotation: number;
  rotSpeed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const TouchEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let animId: number;

    const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#ea580c', '#ffffff'];

    const spawnTouchBurst = (x: number, y: number) => {
      // 1. Golden sacred ripple ring
      ripples.push({
        x,
        y,
        radius: 10,
        maxRadius: 65,
        alpha: 0.85,
      });

      // 2. Burst of golden spark & shiuli particles
      const count = window.innerWidth < 768 ? 10 : 16;
      for (let i = 0; i < count; i++) {
        const angle = (i * (360 / count) * Math.PI) / 180 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.5 + 1.5;
        const isShiuli = Math.random() > 0.65;
        const maxLife = Math.random() * 30 + 35;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: isShiuli ? Math.random() * 5 + 4 : Math.random() * 3.5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife,
          isShiuli,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 6,
        });
      }
    };

    // Global listener for touch and mouse clicks
    const handlePointerDown = (e: PointerEvent) => {
      spawnTouchBurst(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.2;
        r.alpha *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(250, 204, 21, ${r.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Render & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // Gentle gravity
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;

        if (p.isShiuli) {
          // Mini Shiuli flower
          const petals = 5;
          for (let k = 0; k < petals; k++) {
            ctx.save();
            ctx.rotate((k * (360 / petals) * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(0, p.size * 0.7, p.size * 0.35, p.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.restore();
          }
          // Orange core
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#ea580c';
          ctx.fill();
        } else {
          // Golden sparkle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
};
