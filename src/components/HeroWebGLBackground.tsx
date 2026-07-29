import { useEffect, useRef } from "react";

interface HeroWebGLBackgroundProps {
  activeSlide: number;
}

export default function HeroWebGLBackground({ activeSlide }: HeroWebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeSlideRef = useRef(activeSlide);

  // Sync active slide props to ref for use inside compilation renderLoop
  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use WebGL context (with fallback to 2D in case WebGL is blocked or unsupported)
    const gl = canvas.getContext("webgl", { alpha: false, depth: false, antialias: true }) ||
               (canvas.getContext("experimental-webgl", { alpha: false, depth: false, antialias: true }) as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported; falling back to 2D context background.");
      return;
    }

    let animationFrameId = 0;

    // Guards against image.onload firing for a mount that's already been cleaned up (e.g. React
    // StrictMode's dev-only mount→cleanup→remount, or a fast Inicio→category→Inicio round-trip).
    // Without this, an orphaned onload can still fire after its own texture object was deleted;
    // bindTexture on a deleted texture silently no-ops, so the subsequent texImage2D uploads that
    // orphaned photo into whatever texture happens to still be bound from the CURRENT active
    // render loop instead — clobbering the correct, currently-displayed photo with a stale one.
    let isCancelled = false;

    // Helper to load WebGL textures with automatic flipY and crossOrigin support
    const loadTexture = (glContext: WebGLRenderingContext, url: string) => {
      const texture = glContext.createTexture();
      glContext.bindTexture(glContext.TEXTURE_2D, texture);

      // Set temporary 1x1 pixel while image is loading (solid dark navy matching background)
      const level = 0;
      const internalFormat = glContext.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = glContext.RGBA;
      const srcType = glContext.UNSIGNED_BYTE;
      const pixel = new Uint8Array([10, 14, 36, 255]);
      glContext.texImage2D(glContext.TEXTURE_2D, level, internalFormat,
                           width, height, border, srcFormat, srcType,
                           pixel);

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (isCancelled) return;
        glContext.bindTexture(glContext.TEXTURE_2D, texture);
        glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true); // Flip images vertically for correct orientation
        glContext.texImage2D(glContext.TEXTURE_2D, level, internalFormat,
                             srcFormat, srcType, image);

        // WebGL1 supports NPOT textures with CLAMP_TO_EDGE and LINEAR filters
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
      };
      image.src = url;
      return texture;
    };

    const tex0 = loadTexture(gl, "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80");
    const tex1 = loadTexture(gl, "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80");
    const tex2 = loadTexture(gl, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80");
    const tex3 = loadTexture(gl, "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&h=675&q=80");
    const tex4 = loadTexture(gl, "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80");

    // Indexed by slide number (0..4). The fragment shader only ever samples two fixed
    // texture units (old/new); which underlying photo backs each unit is decided here in
    // JS, not via GLSL branching on a slide-index uniform (some mobile GPU/driver
    // combinations mis-evaluate conditional sampler selection in fragment shaders).
    const textures = [tex0, tex1, tex2, tex3, tex4];

    // Shader Source Code
    // Vertex Shader: Standard Fullscreen Pass-through
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        // Invert Y for correct orientation matching coords
        vUv.y = 1.0 - vUv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Custom displacement map, kinetic ambient fluid, directional wipe transition, and RGB Split Chromatic Aberration
    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_velocity;
      uniform float u_intensity;
      uniform float u_wipeProgress; // 0.0 (still on old texture) to 1.0 (fully on new texture)
      uniform float u_direction;    // +1.0 sweeps left-to-right, -1.0 sweeps right-to-left

      uniform sampler2D u_texOld;
      uniform sampler2D u_texNew;

      // Pseudo-random generation for noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Simple 2D Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // Fractional Brownian Motion for complex fluid movement
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 3; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // Function to scale texture UV coordinates to fit like background-size: cover
      vec2 getCoverUV(vec2 uv, vec2 screenRes, vec2 imgRes) {
        float screenAspect = screenRes.x / screenRes.y;
        float imgAspect = imgRes.x / imgRes.y;
        vec2 newUV = uv;
        if (screenAspect > imgAspect) {
          float scale = imgAspect / screenAspect;
          newUV.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          float scale = screenAspect / imgAspect;
          newUV.x = (uv.x - 0.5) * scale + 0.5;
        }
        return newUV;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        // Dynamic cursor distance for target distortion
        vec2 mPos = u_mouse / u_resolution;
        vec2 distVec = (uv - mPos) * aspect;
        float dist = length(distVec);

        // Kinetic ripples calculation
        float ripple = sin(dist * 22.0 - u_time * 3.5) * exp(-dist * 3.8);

        // Displacement factor driven by mouse velocity and dynamic time
        vec2 displacement = vec2(0.0);
        displacement.x = fbm(uv * 4.2 + vec2(u_time * 0.12, u_time * 0.08));
        displacement.y = fbm(uv * 3.8 + vec2(-u_time * 0.08, u_time * 0.15));

        // Scale displacement by distance to cursor + current movement kinetic momentum
        float localInfluence = smoothstep(0.45, 0.0, dist);
        vec2 kineticForce = u_velocity * 0.7 * localInfluence;

        // Refraction vector combining ambient flow noise, cursor ripples and kinetic forces
        vec2 refUV = uv + (displacement - 0.5) * 0.03 + (distVec * ripple * 0.02) + kineticForce;

        // RGB Split (Chromatic Aberration) intensity proportional to instant kinetic momentum
        float splitBase = 0.004 + length(u_velocity) * 0.03;
        vec2 splitVec = vec2(splitBase, splitBase * 0.5) * (1.0 + ripple);

        // Fetch RGB channels separately with dynamic shifts (dispersion)
        float r = fbm(refUV * 3.0 + vec2(u_time * 0.02) - splitVec);
        float g = fbm(refUV * 3.0 + vec2(u_time * 0.02));
        float b = fbm(refUV * 3.0 + vec2(u_time * 0.02) + splitVec);

        // Maintain the gorgeous 4-color corporate scheme consistently across all slides (navy, blue, teal, gold)
        vec3 colorDark = vec3(10.0 / 255.0, 14.0 / 255.0, 36.0 / 255.0);
        vec3 colorBlue = vec3(18.0 / 255.0, 28.0 / 255.0, 207.0 / 255.0);
        vec3 colorTeal = vec3(13.0 / 255.0, 148.0 / 255.0, 136.0 / 255.0);
        vec3 colorGold = vec3(245.0 / 255.0, 158.0 / 255.0, 11.0 / 255.0);

        // Blend colors based on split noise channels
        vec3 mixedColor = mix(colorDark, colorBlue, r * 1.5);
        mixedColor = mix(mixedColor, colorTeal, g * 0.85);
        mixedColor = mix(mixedColor, colorGold, b * 0.22);

        // Fetch texture color with ambient-warped and aspect-ratio corrected UVs
        vec2 coverUV = getCoverUV(refUV, u_resolution, vec2(16.0, 9.0));
        vec4 texOld = texture2D(u_texOld, coverUV);
        vec4 texNew = texture2D(u_texNew, coverUV);

        // Directional wipe: a soft curtain sweeps across the screen revealing the new
        // category's photo. dirUV runs in the sweep direction (left->right or right->left).
        float dirUV = u_direction > 0.0 ? uv.x : (1.0 - uv.x);
        float edgeWidth = 0.05;
        float sweep = mix(-edgeWidth, 1.0 + edgeWidth, u_wipeProgress);
        float wipeMask = 1.0 - smoothstep(sweep - edgeWidth, sweep + edgeWidth, dirUV);
        vec4 texColor = mix(texOld, texNew, wipeMask);

        // Create atmospheric background blending
        // Let the real photo colors read clearly, with just a light dynamic fluid tint to feel alive.
        vec3 darkTexColor = texColor.rgb * vec3(0.8, 0.82, 0.92);
        darkTexColor += mixedColor * 0.1;

        vec3 baseBackground = darkTexColor;

        // Soft glowing seam that travels along the wipe boundary
        float seam = exp(-abs(dirUV - sweep) * 60.0);
        baseBackground += vec3(1.0) * seam * 0.4;

        // Highlight center cursor zone with elegant radial light
        float flare = exp(-dist * 5.0) * (0.12 + length(u_velocity) * 0.5);
        baseBackground += vec3(0.18, 0.25, 1.0) * flare;

        // Subtle ambient vignetting at edges to establish premium focus
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.45), 0.0, 1.0);
        
        gl_FragColor = vec4(baseBackground * vignette, 1.0);
      }
    `;

    // Helper functions to compile and link program
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Geometry buffer for standard screen quad [-1, -1] to [1, 1]
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Retrieve uniform locations
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uVelocityLoc = gl.getUniformLocation(program, "u_velocity");
    const uWipeProgressLoc = gl.getUniformLocation(program, "u_wipeProgress");
    const uDirectionLoc = gl.getUniformLocation(program, "u_direction");
    const uTexOldLoc = gl.getUniformLocation(program, "u_texOld");
    const uTexNewLoc = gl.getUniformLocation(program, "u_texNew");

    // Dynamic physics state for kinetic momentum
    interface PointerState {
      targetX: number;
      targetY: number;
      currentX: number;
      currentY: number;
      vx: number;
      vy: number;
      prevX: number;
      prevY: number;
      fromSlide: number;
      toSlide: number;
      direction: number;
      waveProgress: number;
      prevActiveSlide: number;
    }

    const state: PointerState = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      vx: 0,
      vy: 0,
      prevX: 0,
      prevY: 0,
      fromSlide: activeSlideRef.current,
      toSlide: activeSlideRef.current,
      direction: 1,
      waveProgress: 1.0, // Completed / silent initially
      prevActiveSlide: activeSlideRef.current
    };

    // Auto resize handling
    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Centered initial target coordinate inside container bounds
      state.targetX = rect.width * 0.5;
      state.targetY = rect.height * 0.5;
      state.currentX = state.targetX;
      state.currentY = state.targetY;
      state.prevX = state.currentX;
      state.prevY = state.currentY;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Connect mouse / touch movement patterns to state
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.targetX = e.clientX - rect.left;
      state.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        state.targetX = e.touches[0].clientX - rect.left;
        state.targetY = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let lastTime = 0;
    const renderLoop = (now: number) => {
      // Guard the very first frame: lastTime starts at 0, so without this the first delta would
      // be "now - 0" (whatever the page's elapsed time is, often 500-1000+ ms) instead of a real
      // ~16ms frame step, which could snap an in-progress wipe to completion instantly.
      const delta = lastTime === 0 ? 0 : (now - lastTime) * 0.001;
      lastTime = now;

      // Inertia update logic for silky smooth kinetic tracking
      state.currentX += (state.targetX - state.currentX) * 0.085;
      state.currentY += (state.targetY - state.currentY) * 0.085;

      // Instant velocity calculation to feed displacement intensity/dispersion
      const instantVx = state.currentX - state.prevX;
      const instantVy = state.currentY - state.prevY;
      
      // Decay kinetic speed to build realistic drag momentum
      state.vx += (instantVx - state.vx) * 0.12;
      state.vy += (instantVy - state.vy) * 0.12;

      // Keep trailing context state
      state.prevX = state.currentX;
      state.prevY = state.currentY;

      // Detect slide switch to trigger the directional wipe transition
      const targetSlide = activeSlideRef.current;
      if (state.prevActiveSlide !== targetSlide) {
        state.fromSlide = state.prevActiveSlide;
        state.toSlide = targetSlide;
        state.direction = targetSlide > state.prevActiveSlide ? 1 : -1;
        state.waveProgress = 0.0; // Trigger wipe from start
        // Small kinetic nudge in the wipe direction, for a subtle sense of motion
        state.vx += state.direction * 2.5;
        state.prevActiveSlide = targetSlide;
      }

      // Propagate the wipe progress (eased with a smoothstep curve for a natural sweep)
      if (state.waveProgress < 1.0) {
        state.waveProgress += delta * 0.85;
        if (state.waveProgress > 1.0) {
          state.waveProgress = 1.0;
        }
      }
      const easedWipeProgress = state.waveProgress * state.waveProgress * (3.0 - 2.0 * state.waveProgress);

      // Log resolution + setup viewport size
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, now * 0.001);

      // Adjust coords scale mapping to gl_FragCoord system
      const dpr = window.devicePixelRatio || 1;
      gl.uniform2f(uMouseLoc, state.currentX * dpr, (canvas.height - state.currentY * dpr));
      gl.uniform2f(uVelocityLoc, state.vx * 0.015, -state.vy * 0.015);

      // Send wipe transition specifics
      gl.uniform1f(uWipeProgressLoc, easedWipeProgress);
      gl.uniform1f(uDirectionLoc, state.direction);

      // Bind only the two textures actually needed this frame (old/new) to fixed units.
      // Deciding which photo backs each unit happens here in JS rather than via GLSL
      // branching on a slide-index uniform, to sidestep GPU/driver-specific conditional
      // sampler-selection bugs.
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[state.fromSlide]);
      gl.uniform1i(uTexOldLoc, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[state.toSlide]);
      gl.uniform1i(uTexNewLoc, 1);

      // Render fullscreen layout quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Clean up connections on unmount
    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteProgram(program);
        gl.deleteTexture(tex0);
        gl.deleteTexture(tex1);
        gl.deleteTexture(tex2);
        gl.deleteTexture(tex3);
        gl.deleteTexture(tex4);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
    </div>
  );
}
