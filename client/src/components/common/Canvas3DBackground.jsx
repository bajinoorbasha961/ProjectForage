import React, { useEffect, useRef } from 'react';

const Canvas3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles array
    const numParticles = 60;
    const particles = [];
    const focalLength = 350;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100,
        radius: Math.random() * 3.5 + 1.5,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 1.2,
        color: i % 3 === 0 ? '#d8b4fe' : i % 3 === 1 ? '#c084fc' : '#a855f7',
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Dynamic 3D Polyhedron / Rings
    let angleX = 0;
    let angleY = 0;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - width / 2) * 0.0005;
      mouseY = (e.clientY - height / 2) * 0.0005;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle Lavender Radial Backlight
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 3,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
      grad.addColorStop(0.5, 'rgba(59, 7, 100, 0.08)');
      grad.addColorStop(1, 'rgba(10, 5, 24, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      angleX += 0.003 + mouseY * 0.5;
      angleY += 0.005 + mouseX * 0.5;

      const cx = width / 2;
      const cy = height / 2;

      // Draw particle nodes & 3D connections
      const projected = [];

      particles.forEach((p) => {
        p.pulse += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounce within 3D box limits
        if (Math.abs(p.x) > width * 0.8) p.vx *= -1;
        if (Math.abs(p.y) > height * 0.8) p.vy *= -1;
        if (p.z < 50 || p.z > 900) p.vz *= -1;

        // 3D rotation transformation around center
        const cosX = Math.cos(angleX * 0.2);
        const sinX = Math.sin(angleX * 0.2);
        const cosY = Math.cos(angleY * 0.2);
        const sinY = Math.sin(angleY * 0.2);

        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.z * cosX + p.y * sinX;

        let x2 = p.x * cosY + z1 * sinY;
        let z2 = z1 * cosY - p.x * sinY;

        // Perspective projection
        const scale = focalLength / (focalLength + z2 + 400);
        const projX = cx + x2 * scale;
        const projY = cy + y1 * scale;
        const alpha = Math.max(0.1, Math.min(1, scale * 1.5));

        projected.push({ x: projX, y: projY, alpha, color: p.color, scale, radius: p.radius });

        // Draw particle
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.5, p.radius * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * (0.6 + Math.sin(p.pulse) * 0.4);
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10 * scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connecting 3D lavender web lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.25 * projected[i].alpha;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = '#d8b4fe';
            ctx.globalAlpha = lineAlpha;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

export default Canvas3DBackground;
