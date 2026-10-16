import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Plane } from 'ogl';

interface SilkProps {
  className?: string;
  speed?: number;
  sheenIntensity?: number;
}

export const Silk: React.FC<SilkProps> = ({
  className = '',
  speed = 0.5,
  sheenIntensity = 0.38,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHeadless = Boolean(
      (navigator as any).webdriver || /HeadlessChrome/i.test(navigator.userAgent)
    );

    if (isReducedMotion || isHeadless) {
      return;
    }

    let renderer: Renderer | null = null;
    let animationFrameId: number;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      const gl = renderer.gl;
      container.appendChild(gl.canvas);
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.top = '0';
      gl.canvas.style.left = '0';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.pointerEvents = 'none';

      const camera = new Camera(gl, { fov: 45 });
      camera.position.z = 2.4;

      const scene = new Transform();
      const geometry = new Plane(gl, { width: 3.6, height: 2.6, widthSegments: 44, heightSegments: 34 });

      const vertex = /* glsl */ `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;

        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float wave1 = sin(pos.x * 2.0 + uTime * 0.75) * cos(pos.y * 1.6 + uTime * 0.45) * 0.14;
          float wave2 = sin(pos.x * 3.8 - uTime * 0.35 + pos.y * 2.2) * 0.06;
          pos.z += wave1 + wave2;

          vElevation = pos.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragment = /* glsl */ `
        precision highp float;
        uniform float uTime;
        uniform float uSheen;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Deep obsidian black #050506
          vec3 baseColor = vec3(0.02, 0.02, 0.024);
          // Sleek dark graphite surface #0B0B0E
          vec3 surfaceColor = vec3(0.045, 0.045, 0.055);
          // Refined champagne accent #D4B679
          vec3 champagne = vec3(0.831, 0.714, 0.474);

          float mixFactor = smoothstep(-0.16, 0.16, vElevation);
          vec3 color = mix(baseColor, surfaceColor, mixFactor);

          // Liquid specular glint
          float specular = pow(max(0.0, vElevation * 3.6 + 0.42), 3.2);
          color += champagne * specular * uSheen * 0.42;

          gl_FragColor = vec4(color, 0.9);
        }
      `;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uSheen: { value: sheenIntensity },
        },
        transparent: true,
      });

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      const resize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.perspective({ aspect: width / height });
      };

      window.addEventListener('resize', resize);
      resize();

      let lastTime = performance.now();
      const update = (now: number) => {
        const delta = (now - lastTime) * 0.001;
        lastTime = now;
        program.uniforms.uTime.value += delta * speed;
        renderer?.render({ scene, camera });
        animationFrameId = requestAnimationFrame(update);
      };

      animationFrameId = requestAnimationFrame(update);

      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
        if (gl.canvas.parentElement) {
          gl.canvas.parentElement.removeChild(gl.canvas);
        }
      };
    } catch (e) {
      console.warn('WebGL initialization fallback:', e);
    }
  }, [speed, sheenIntensity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(212, 182, 121, 0.07), rgba(5, 5, 6, 0.99))',
      }}
    />
  );
};
