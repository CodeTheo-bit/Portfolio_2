/**
 * Ferrofluid — React Bits component implementation for Vanilla JavaScript + CSS
 * Shader, math, and uniforms are an exact 1:1 match of the React Bits <Ferrofluid /> component.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initFerrofluid = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MAX_COLORS = 8;

  const hexToRGB = hex => {
    const c = hex.replace('#', '').padEnd(6, '0');
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    return [r, g, b];
  };

  const prepColors = input => {
    const base = (input && input.length ? input : ['#c6b4e5', '#ffffff', '#923847']).slice(0, MAX_COLORS);
    const count = base.length;
    const arr = [];
    for (let i = 0; i < MAX_COLORS; i++) {
      arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
    }
    const avg = [0, 0, 0];
    for (let i = 0; i < count; i++) {
      avg[0] += arr[i][0];
      avg[1] += arr[i][1];
      avg[2] += arr[i][2];
    }
    avg[0] /= count;
    avg[1] /= count;
    avg[2] /= count;
    return { arr, count, avg };
  };

  const flowVec = d => {
    switch (d) {
      case 'up':
        return [0, 1];
      case 'down':
        return [0, -1];
      case 'left':
        return [-1, 0];
      case 'right':
        return [1, 0];
      default:
        return [0, -1];
    }
  };

  const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  const FRAGMENT_SHADER = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uMouseColor;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = iTime;

  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);

  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }

  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);

  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

  function initFerrofluid(container, options = {}) {
    if (!container) return null;

    const config = Object.assign({
      colors: ['#c6b4e5', '#ffffff', '#923847'],
      speed: 0.2,
      scale: 1,
      turbulence: 0.15,
      fluidity: 0.11,
      rimWidth: 0.12,
      sharpness: 1.6,
      shimmer: 1.2,
      glow: 1.21,
      flowDirection: 'left',
      opacity: 1,
      mouseInteraction: false,
      mouseStrength: 1,
      mouseRadius: 0.55,
      mouseDampening: 0.15,
      paused: false
    }, options);

    const canvas = document.createElement('canvas');
    canvas.className = 'ferrofluid-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false
    }) || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('WebGL not supported for Ferrofluid');
      return null;
    }

    gl.clearColor(0, 0, 0, 0);

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Ferrofluid shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Ferrofluid program linking error:', gl.getProgramInfoLog(program));
      return null;
    }

    gl.useProgram(program);

    // Full-screen Triangle with UV coordinates (exact equivalent to OGL Triangle)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 2, 0, 0, 2]),
      gl.STATIC_DRAW
    );
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // Prepare color array
    const { arr, count, avg } = prepColors(config.colors);

    // Uniform locations
    const uLocs = {
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iMouse: gl.getUniformLocation(program, 'iMouse'),
      iTime: gl.getUniformLocation(program, 'iTime'),
      uColor0: gl.getUniformLocation(program, 'uColor0'),
      uColor1: gl.getUniformLocation(program, 'uColor1'),
      uColor2: gl.getUniformLocation(program, 'uColor2'),
      uColor3: gl.getUniformLocation(program, 'uColor3'),
      uColor4: gl.getUniformLocation(program, 'uColor4'),
      uColor5: gl.getUniformLocation(program, 'uColor5'),
      uColor6: gl.getUniformLocation(program, 'uColor6'),
      uColor7: gl.getUniformLocation(program, 'uColor7'),
      uColorCount: gl.getUniformLocation(program, 'uColorCount'),
      uMouseColor: gl.getUniformLocation(program, 'uMouseColor'),
      uFlow: gl.getUniformLocation(program, 'uFlow'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
      uScale: gl.getUniformLocation(program, 'uScale'),
      uTurbulence: gl.getUniformLocation(program, 'uTurbulence'),
      uFluidity: gl.getUniformLocation(program, 'uFluidity'),
      uRimWidth: gl.getUniformLocation(program, 'uRimWidth'),
      uSharpness: gl.getUniformLocation(program, 'uSharpness'),
      uShimmer: gl.getUniformLocation(program, 'uShimmer'),
      uGlow: gl.getUniformLocation(program, 'uGlow'),
      uOpacity: gl.getUniformLocation(program, 'uOpacity'),
      uMouseEnabled: gl.getUniformLocation(program, 'uMouseEnabled'),
      uMouseStrength: gl.getUniformLocation(program, 'uMouseStrength'),
      uMouseRadius: gl.getUniformLocation(program, 'uMouseRadius')
    };

    // Set static uniforms
    gl.uniform3fv(uLocs.uColor0, arr[0]);
    gl.uniform3fv(uLocs.uColor1, arr[1]);
    gl.uniform3fv(uLocs.uColor2, arr[2]);
    gl.uniform3fv(uLocs.uColor3, arr[3]);
    gl.uniform3fv(uLocs.uColor4, arr[4]);
    gl.uniform3fv(uLocs.uColor5, arr[5]);
    gl.uniform3fv(uLocs.uColor6, arr[6]);
    gl.uniform3fv(uLocs.uColor7, arr[7]);
    gl.uniform1i(uLocs.uColorCount, count);
    gl.uniform3fv(uLocs.uMouseColor, avg);

    const flow = flowVec(config.flowDirection);
    gl.uniform2f(uLocs.uFlow, flow[0], flow[1]);
    gl.uniform1f(uLocs.uSpeed, config.speed);
    gl.uniform1f(uLocs.uScale, config.scale);
    gl.uniform1f(uLocs.uTurbulence, config.turbulence);
    gl.uniform1f(uLocs.uFluidity, config.fluidity);
    gl.uniform1f(uLocs.uRimWidth, config.rimWidth);
    gl.uniform1f(uLocs.uSharpness, config.sharpness);
    gl.uniform1f(uLocs.uShimmer, config.shimmer);
    gl.uniform1f(uLocs.uGlow, config.glow);
    gl.uniform1f(uLocs.uOpacity, config.opacity);
    gl.uniform1f(uLocs.uMouseEnabled, config.mouseInteraction ? 1.0 : 0.0);
    gl.uniform1f(uLocs.uMouseStrength, config.mouseStrength);
    gl.uniform1f(uLocs.uMouseRadius, config.mouseRadius);

    let animationId = null;
    let isRunning = true;
    let mouseTarget = [0, 0];
    let mouseCurrent = [0, 0];
    let lastTime = 0;
    let dpr = 1;
    let width = 0;
    let height = 0;

    function resize() {
      if (!container) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const wCSS = container.clientWidth || window.innerWidth;
      const hCSS = container.clientHeight || window.innerHeight;

      width = Math.floor(wCSS * dpr);
      height = Math.floor(hCSS * dpr);

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform3f(uLocs.iResolution, width, height, 1.0);
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      const sc = dpr || 1;
      const x = (e.clientX - rect.left) * sc;
      const y = (rect.height - (e.clientY - rect.top)) * sc;
      mouseTarget = [x, y];
      if (config.mouseDampening <= 0) {
        mouseCurrent = [x, y];
        gl.uniform2f(uLocs.iMouse, x, y);
      }
    }

    if (config.mouseInteraction) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    function loop(t) {
      if (!isRunning || config.paused) return;

      gl.uniform1f(uLocs.iTime, t * 0.001);

      if (config.mouseInteraction && config.mouseDampening > 0) {
        if (!lastTime) lastTime = t;
        const dt = (t - lastTime) / 1000;
        lastTime = t;
        const tau = Math.max(1e-4, config.mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        mouseCurrent[0] += (mouseTarget[0] - mouseCurrent[0]) * factor;
        mouseCurrent[1] += (mouseTarget[1] - mouseCurrent[1]) * factor;
        gl.uniform2f(uLocs.iMouse, mouseCurrent[0], mouseCurrent[1]);
      } else {
        lastTime = t;
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);

    return {
      pause() {
        config.paused = true;
      },
      resume() {
        config.paused = false;
        animationId = requestAnimationFrame(loop);
      },
      setGlow(val) {
        config.glow = val;
        gl.uniform1f(uLocs.uGlow, val);
      },
      setOptions(opts = {}) {
        Object.assign(config, opts);
        if (opts.glow !== undefined) gl.uniform1f(uLocs.uGlow, opts.glow);
        if (opts.speed !== undefined) gl.uniform1f(uLocs.uSpeed, opts.speed);
        if (opts.scale !== undefined) gl.uniform1f(uLocs.uScale, opts.scale);
        if (opts.opacity !== undefined) gl.uniform1f(uLocs.uOpacity, opts.opacity);
        if (opts.shimmer !== undefined) gl.uniform1f(uLocs.uShimmer, opts.shimmer);
        if (opts.sharpness !== undefined) gl.uniform1f(uLocs.uSharpness, opts.sharpness);
      },
      destroy() {
        isRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
        if (config.mouseInteraction) {
          window.removeEventListener('pointermove', onPointerMove);
        }
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  return initFerrofluid;
});
