import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  speedX: number;
  speedY: number;
  pulseSpeed: number;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      // Calculate particle density
      const particleCount = Math.floor((width * height) / 9000);
      const count = Math.max(80, Math.min(180, particleCount));

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 1.8 + 0.6; // 0.6px to 2.4px
        const maxAlpha = Math.random() * 0.7 + 0.25; // 0.25 to 0.95 opacity
        
        // Random velocity for floating space effect
        const speed = Math.random() * 0.6 + 0.2;
        const angle = Math.random() * Math.PI * 2;
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          alpha: Math.random() * maxAlpha,
          maxAlpha,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          pulseSpeed: Math.random() * 0.015 + 0.005,
        });
      }
    };

    initParticles();

    const render = () => {
      // Clear and fill dark space background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Draw particle connections (subtle constellation lines)
      const maxDistance = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.12 * particles[i].alpha;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw white particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle randomly in space
        p.x += p.speedX;
        p.y += p.speedY;

        // Subtle twinkling pulse
        p.alpha += p.pulseSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.15) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Screen wrap-around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, p.alpha))})`;
        
        if (p.radius > 1.4) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticlesBackground;
