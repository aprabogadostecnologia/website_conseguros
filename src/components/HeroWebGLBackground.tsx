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
               canvas.getContext("experimental-webgl", { alpha: false, depth: false, antialias: true });

    if (!gl) {
      console.warn("WebGL not supported; falling back to 2D context background.");
      return;
    }

    let animationFrameId = 0;

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
    const tex3 = loadTexture(gl, "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80");
    const tex4 = loadTexture(gl, "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80");
    
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

    // Fragment Shader: Custom displacement map, kinetic wave generator, portal vortex transition, and RGB Split Chromatic Aberration
    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_velocity;
      uniform float u_intensity;
      uniform float u_slide; // Interpolated slide float val (0.0 to 4.0)
      uniform float u_wave;  // Transition shockwave magnitude (0.0 to 1.0)

      uniform sampler2D u_tex0;
      uniform sampler2D u_tex1;
      uniform sampler2D u_tex2;
      uniform sampler2D u_tex3;
      uniform sampler2D u_tex4;

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

      vec4 getTextureColor(vec2 uv, float slide) {
        vec4 c0 = texture2D(u_tex0, uv);
        vec4 c1 = texture2D(u_tex1, uv);
        vec4 c2 = texture2D(u_tex2, uv);
        vec4 c3 = texture2D(u_tex3, uv);
        vec4 c4 = texture2D(u_tex4, uv);

        if (slide < 1.0) {
          return mix(c0, c1, slide);
        } else if (slide < 2.0) {
          return mix(c1, c2, slide - 1.0);
        } else if (slide < 3.0) {
          return mix(c2, c3, slide - 2.0);
        } else {
          return mix(c3, c4, clamp(slide - 3.0, 0.0, 1.0));
        }
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        
        // Dynamic cursor distance for target distortion
        vec2 mPos = u_mouse / u_resolution;
        vec2 distVec = (uv - mPos) * aspect;
        float dist = length(distVec);

        // Center point for the portal vortex
        vec2 center = vec2(0.5, 0.5);
        vec2 dirToCenter = uv - center;
        float distToCenter = length(dirToCenter * aspect);

        // Transition sine bump: peaks at 1.0 exactly at 50% transition progress
        float transitionFactor = sin(u_wave * 3.14159265);

        // 1. Portal Swirl/Vortex Distortion
        float angle = atan(dirToCenter.y, dirToCenter.x);
        
        // Intensity of vortex swirl based on distance to center and transition factor
        float swirl = transitionFactor * 5.0 * (1.0 / (distToCenter + 0.12));
        float newAngle = angle + swirl;

        // 2. Portal Zoom/Implosion Transition
        // Sucks coordinates in at center, and stretches them out when transition peaks
        float zoom = 1.0 - transitionFactor * 0.45 * (1.0 - smoothstep(0.0, 0.95, distToCenter));
        
        vec2 warpedDir = vec2(cos(newAngle), sin(newAngle)) * distToCenter * zoom;
        vec2 portalUV = center + warpedDir / aspect;

        // Kinetic ripples calculation
        float ripple = sin(dist * 22.0 - u_time * 3.5) * exp(-dist * 3.8);
        
        // Displacement factor driven by mouse velocity and dynamic time
        vec2 displacement = vec2(0.0);
        displacement.x = fbm(portalUV * 4.2 + vec2(u_time * 0.12, u_time * 0.08));
        displacement.y = fbm(portalUV * 3.8 + vec2(-u_time * 0.08, u_time * 0.15));
        
        // Scale displacement by distance to cursor + current movement kinetic momentum
        float localInfluence = smoothstep(0.45, 0.0, dist);
        vec2 kineticForce = u_velocity * 1.8 * localInfluence;

        // 3. Circular Portal Boundary Ring (replaces original shockwave displacement)
        float ringRadius = transitionFactor * 0.75;
        float ringWidth = 0.09;
        float portalRing = smoothstep(ringRadius - ringWidth, ringRadius, distToCenter) *
                           smoothstep(ringRadius + ringWidth, ringRadius, distToCenter);
                           
        vec2 shockDisplacement = normalize(dirToCenter) * portalRing * 0.12 * (1.0 - u_wave);
        
        // Refraction vector combining portal warp, flow noise, cursor ripples, kinetic forces, and portal shock displacement
        vec2 refUV = portalUV + (displacement - 0.5) * 0.045 + (distVec * ripple * 0.03) + kineticForce + shockDisplacement;

        // RGB Split (Chromatic Aberration) intensity proportional to instant kinetic momentum and portal shock
        float splitBase = 0.006 + length(u_velocity) * 0.065 + portalRing * 0.045;
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

        // Fetch texture color with warped and aspect-ratio corrected UVs
        vec2 coverUV = getCoverUV(refUV, u_resolution, vec2(16.0, 9.0));
        vec4 texColor = getTextureColor(coverUV, u_slide);

        // Create atmospheric background blending
        // Maintain extreme premium high contrast by multiplying with dark overlay,
        // and inject some dynamic shader fluid colors to make it feel fully alive.
        vec3 darkTexColor = texColor.rgb * vec3(0.18, 0.22, 0.35);
        darkTexColor += mixedColor * 0.45;

        // Slide 0.0 starts with subtle nebula, slides > 0.0 fully transition to high-detail category visual
        float textureBlend = mix(0.15, 1.0, smoothstep(0.0, 1.0, u_slide));
        vec3 baseBackground = mix(mixedColor, darkTexColor, textureBlend);

        // 4. Portal Ring Neon Glow Overlay
        // Glowing blend of gold/orange and bright cyan/blue during portal transit
        vec3 ringGlowColor = mix(vec3(0.0, 148.0 / 255.0, 255.0 / 255.0), vec3(245.0 / 255.0, 158.0 / 255.0, 11.0 / 255.0), transitionFactor);
        baseBackground += ringGlowColor * portalRing * 1.8;

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
    const uSlideLoc = gl.getUniformLocation(program, "u_slide");
    const uWaveLoc = gl.getUniformLocation(program, "u_wave");

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
      currentSlide: number;
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
      currentSlide: activeSlideRef.current,
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
      const delta = (now - lastTime) * 0.001;
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

      // Smooth Slide transition value tracking
      const targetSlide = activeSlideRef.current;
      state.currentSlide += (targetSlide - state.currentSlide) * 0.065;

      // Detect slide switch to trigger shockwave
      if (state.prevActiveSlide !== targetSlide) {
        state.waveProgress = 0.0; // Trigger wave from start
        // Boost kinetic velocity heavily to simulate shock momentum dispersion
        state.vx += (targetSlide > state.prevActiveSlide ? 4.5 : -4.5);
        state.vy += 3.0;
        state.prevActiveSlide = targetSlide;
      }

      // Propagate transition shockwave
      if (state.waveProgress < 1.0) {
        state.waveProgress += delta * 0.85; // Speed adjustment for sliding
        if (state.waveProgress > 1.0) {
          state.waveProgress = 1.0;
        }
      }

      // Log resolution + setup viewport size
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, now * 0.001);
      
      // Adjust coords scale mapping to gl_FragCoord system
      const dpr = window.devicePixelRatio || 1;
      gl.uniform2f(uMouseLoc, state.currentX * dpr, (canvas.height - state.currentY * dpr));
      gl.uniform2f(uVelocityLoc, state.vx * 0.015, -state.vy * 0.015);
      
      // Send slider specifics
      gl.uniform1f(uSlideLoc, state.currentSlide);
      gl.uniform1f(uWaveLoc, state.waveProgress);

      // Bind textures to respective texture units and supply uniforms
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex0);
      gl.uniform1i(gl.getUniformLocation(program, "u_tex0"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex1);
      gl.uniform1i(gl.getUniformLocation(program, "u_tex1"), 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, tex2);
      gl.uniform1i(gl.getUniformLocation(program, "u_tex2"), 2);

      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, tex3);
      gl.uniform1i(gl.getUniformLocation(program, "u_tex3"), 3);

      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, tex4);
      gl.uniform1i(gl.getUniformLocation(program, "u_tex4"), 4);

      // Render fullscreen layout quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Clean up connections on unmount
    return () => {
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
