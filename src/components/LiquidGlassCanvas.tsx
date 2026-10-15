import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidGlassCanvasProps {
  className?: string;
  intensity?: number;
}

export const LiquidGlassCanvas: React.FC<LiquidGlassCanvasProps> = ({
  className = '',
  intensity = 1.0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseTargetRef = useRef<{ x: number; y: number; click: number }>({ x: 0.5, y: 0.5, click: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isHeadless,
      alpha: true,
      stencil: false,
      depth: false,
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // Liquid Glass Displacement Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_intensity;

      // Simplex-inspired organic wave function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        // Distance to pointer/touch
        vec2 mouseDelta = (uv - u_mouse) * aspect;
        float mouseDist = length(mouseDelta);
        float mouseRipple = exp(-mouseDist * 4.5) * 0.12 * sin(mouseDist * 28.0 - u_time * 3.5);

        // Viscous fluid displacement waves (Wabi glass flow)
        float t = u_time * 0.35;
        vec2 p = uv * 3.2;

        float n1 = snoise(p + vec2(t * 0.4, -t * 0.25));
        float n2 = snoise(p * 2.1 - vec2(-t * 0.3, t * 0.45));
        float n3 = snoise(p * 4.0 + vec2(n1, n2) * 1.5);

        // Normal displacement vector
        vec2 displacement = vec2(n1 * 0.5 + n2 * 0.3 + n3 * 0.2, n2 * 0.5 - n1 * 0.3);
        displacement += (mouseDelta / (mouseDist + 0.001)) * mouseRipple * 1.8;
        displacement *= u_intensity * 0.065;

        // Chromatic Dispersion (Optical glass refraction RGB split)
        float dispersion = 0.018 * u_intensity;
        vec2 uvR = uv + displacement * (1.0 + dispersion);
        vec2 uvG = uv + displacement;
        vec2 uvB = uv + displacement * (1.0 - dispersion);

        // Cinegobetti deep cinematic palette: Midnight Navy (#090A0F), Deep Plum/Violet (#2E1065), Amber/Gold Glow (#F59E0B)
        vec3 colorDark = vec3(0.035, 0.039, 0.058);    // #090A0F
        vec3 colorViolet = vec3(0.24, 0.08, 0.45);    // Rich Cinema Purple
        vec3 colorCyan = vec3(0.06, 0.28, 0.48);      // Deep Teal/Cyan
        vec3 colorAmber = vec3(0.85, 0.55, 0.15);     // Cinematic Gold

        // Base gradient with chromatic shift
        float gradR = sin(uvR.x * 2.5 + t * 0.5) * 0.5 + 0.5;
        float gradG = sin(uvG.x * 2.5 + t * 0.5) * 0.5 + 0.5;
        float gradB = sin(uvB.x * 2.5 + t * 0.5) * 0.5 + 0.5;

        float r = mix(colorDark.r, colorViolet.r, gradR) + sin(uvR.y * 3.0 - t * 0.7) * 0.08;
        float g = mix(colorDark.g, colorCyan.g, gradG) + cos(uvG.y * 2.8 + t * 0.6) * 0.06;
        float b = mix(colorDark.b, colorViolet.b, gradB) + sin(uvB.x * 3.2 + t * 0.4) * 0.12;

        vec3 fluidColor = vec3(r, g, b);

        // Add specular liquid sheen / caustic highlights
        float sheen = pow(max(0.0, n3 * 0.5 + 0.5), 5.0) * 0.35;
        float rim = pow(1.0 - length(uv - 0.5) * 1.1, 2.0) * 0.25;

        // Subtle amber accent caustics in highlights
        fluidColor += colorAmber * sheen * 0.8;
        fluidColor += vec3(0.9, 0.95, 1.0) * pow(sheen, 2.0) * 0.4;
        fluidColor += rim * 0.08;

        // Vignette
        float vignette = 1.0 - smoothstep(0.4, 1.3, length((uv - 0.5) * aspect));
        fluidColor *= vignette;

        gl_FragColor = vec4(fluidColor, 0.95);
      }
    `;

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_intensity: { value: intensity },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse & Touch interaction
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseTargetRef.current.x = THREE.MathUtils.clamp(x, 0, 1);
      mouseTargetRef.current.y = THREE.MathUtils.clamp(y, 0, 1);
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      renderer.setSize(newW, newH);
      uniforms.u_resolution.value.set(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Render loop with exponential damping
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // In headless test mode, advance time in controlled steps
      uniforms.u_time.value += dt;

      // Smooth mouse damping
      const curX = uniforms.u_mouse.value.x;
      const curY = uniforms.u_mouse.value.y;
      uniforms.u_mouse.value.x += (mouseTargetRef.current.x - curX) * Math.min(1.0, dt * 5.0);
      uniforms.u_mouse.value.y += (mouseTargetRef.current.y - curY) * Math.min(1.0, dt * 5.0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [intensity]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      data-testid="liquid-glass-canvas"
    />
  );
};
