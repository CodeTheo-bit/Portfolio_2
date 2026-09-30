/**
 * LightRays - WebGL Volumetric Light Rays Effect
 * Pure Vanilla WebGL implementation of the OGL LightRays shader component
 * Zero dependencies, ultra lightweight, vivid volumetric illumination & mouse-interactive.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initLightRays = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULT_OPTIONS = {
    raysOrigin: 'top-center',
    raysColor: '#f5f0e8',    // Off-white / golden luminous rays
    raysSpeed: 0.9,
    lightSpread: 1.25,
    rayLength: 2.5,
    pulsating: true,
    fadeDistance: 1.2,
    saturation: 1.2,
    followMouse: true,
    mouseInfluence: 0.22,
    noiseAmount: 0.03,
    distortion: 0.05,
    lightMode: false
  };

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
      ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
      : [1.0, 1.0, 1.0];
  }

  function getAnchorAndDir(origin, w, h) {
    const outside = 0.15;
    switch (origin) {
      case 'top-left':
        return { anchor: [0, -outside * h], dir: [0.2, 1] };
      case 'top-right':
        return { anchor: [w, -outside * h], dir: [-0.2, 1] };
      case 'left':
        return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
      case 'right':
        return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
      case 'bottom-left':
        return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-center':
        return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-right':
        return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
      case 'top-center':
      default:
        return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
  }

  const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  const FRAGMENT_SHADER = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float lightMode;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.3, 1.0);
  float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.55 + 0.25 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.40 + 0.25 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  // Boost beam contrast and vibrancy
  fragColor = (rays1 * 0.65 + rays2 * 0.55) * 1.8;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.2 + brightness * 0.8;
  fragColor.y *= 0.35 + brightness * 0.65;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  vec3 rgb = fragColor.rgb * raysColor * 2.2;
  float alpha = clamp(max(rgb.r, max(rgb.g, rgb.b)) * 1.4, 0.0, 0.95);

  if (lightMode > 0.5) {
    vec3 mapped = vec3(1.0) - exp(-max(rgb, vec3(0.0)) * 1.5);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    vec3 ink = mix(hue * 0.25, hue * 0.72, energy);
    fragColor = vec4(mix(vec3(1.0), ink, energy), 1.0);
  } else {
    fragColor = vec4(rgb, alpha);
  }
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('LightRays shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('LightRays program link error:', gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  function initLightRays(containerSelector, userOptions = {}) {
    const container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!container) {
      console.warn('LightRays: Container element not found:', containerSelector);
      return null;
    }

    const opts = Object.assign({}, DEFAULT_OPTIONS, userOptions);

    let isDestroyed = false;
    let isPaused = false;
    let animationId = null;
    let observer = null;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'light-rays-canvas';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';

    container.innerHTML = '';
    container.appendChild(canvas);

    // Initialize WebGL Context with Alpha
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true
    }) || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('LightRays: WebGL not supported on this device/browser.');
      return null;
    }

    // Compile Program
    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return null;

    gl.useProgram(program);

    // Set Up Full-Screen Triangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         3.0, -1.0,
        -1.0,  3.0
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform Locations
    const uLocations = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      rayPos: gl.getUniformLocation(program, 'rayPos'),
      rayDir: gl.getUniformLocation(program, 'rayDir'),
      raysColor: gl.getUniformLocation(program, 'raysColor'),
      raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
      lightSpread: gl.getUniformLocation(program, 'lightSpread'),
      rayLength: gl.getUniformLocation(program, 'rayLength'),
      pulsating: gl.getUniformLocation(program, 'pulsating'),
      fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
      saturation: gl.getUniformLocation(program, 'saturation'),
      mousePos: gl.getUniformLocation(program, 'mousePos'),
      mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
      noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
      distortion: gl.getUniformLocation(program, 'distortion'),
      lightMode: gl.getUniformLocation(program, 'lightMode')
    };

    // State Variables
    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    function applyOptions() {
      if (isDestroyed || !gl) return;
      gl.useProgram(program);

      const rgb = hexToRgb(opts.raysColor);
      gl.uniform3f(uLocations.raysColor, rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(uLocations.raysSpeed, opts.raysSpeed);
      gl.uniform1f(uLocations.lightSpread, opts.lightSpread);
      gl.uniform1f(uLocations.rayLength, opts.rayLength);
      gl.uniform1f(uLocations.pulsating, opts.pulsating ? 1.0 : 0.0);
      gl.uniform1f(uLocations.fadeDistance, opts.fadeDistance);
      gl.uniform1f(uLocations.saturation, opts.saturation);
      gl.uniform1f(uLocations.mouseInfluence, opts.mouseInfluence);
      gl.uniform1f(uLocations.noiseAmount, opts.noiseAmount);
      gl.uniform1f(uLocations.distortion, opts.distortion);
      gl.uniform1f(uLocations.lightMode, opts.lightMode ? 1.0 : 0.0);
    }

    function resize() {
      if (isDestroyed || !container || !gl) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const wCSS = container.clientWidth || container.parentElement?.clientWidth || window.innerWidth;
      const hCSS = container.clientHeight || container.parentElement?.clientHeight || window.innerHeight;

      width = Math.max(10, Math.floor(wCSS * dpr));
      height = Math.max(10, Math.floor(hCSS * dpr));

      canvas.width = width;
      canvas.height = height;

      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.uniform2f(uLocations.iResolution, width, height);

      const { anchor, dir } = getAnchorAndDir(opts.raysOrigin, width, height);
      gl.uniform2f(uLocations.rayPos, anchor[0], anchor[1]);
      gl.uniform2f(uLocations.rayDir, dir[0], dir[1]);
    }

    function handleMouseMove(e) {
      if (!opts.followMouse || isDestroyed || !container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.width || window.innerWidth || 1);
      const y = (e.clientY - rect.top) / (rect.height || window.innerHeight || 1);
      mouse.x = Math.max(0, Math.min(1, x));
      mouse.y = Math.max(0, Math.min(1, y));
    }

    // Render Loop
    function render(t) {
      if (isDestroyed) return;

      if (!isPaused) {
        gl.useProgram(program);
        gl.uniform1f(uLocations.iTime, t * 0.001);

        if (opts.followMouse && opts.mouseInfluence > 0) {
          const smoothing = 0.92;
          smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
          smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
          gl.uniform2f(uLocations.mousePos, smoothMouse.x, smoothMouse.y);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      animationId = requestAnimationFrame(render);
    }

    // Setup Listeners
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('load', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intersection Observer (pause offscreen)
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        isPaused = !entry.isIntersecting;
      }, { threshold: 0.02 });
      observer.observe(container);
    }

    // Initial setup with safe next-tick trigger
    resize();
    applyOptions();
    requestAnimationFrame(resize);
    setTimeout(resize, 100);
    setTimeout(resize, 500);

    animationId = requestAnimationFrame(render);

    // Controller Object
    const controller = {
      canvas,
      container,
      options: opts,
      setOptions(newOpts) {
        Object.assign(opts, newOpts);
        resize();
        applyOptions();
      },
      toggle(enable) {
        if (typeof enable === 'boolean') {
          isPaused = !enable;
        } else {
          isPaused = !isPaused;
        }
        canvas.style.display = isPaused ? 'none' : 'block';
        return !isPaused;
      },
      destroy() {
        if (isDestroyed) return;
        isDestroyed = true;

        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }

        window.removeEventListener('resize', resize);
        window.removeEventListener('load', resize);
        window.removeEventListener('mousemove', handleMouseMove);

        if (observer) {
          observer.disconnect();
          observer = null;
        }

        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) loseContext.loseContext();
        }

        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };

    return controller;
  }

  return initLightRays;
});
