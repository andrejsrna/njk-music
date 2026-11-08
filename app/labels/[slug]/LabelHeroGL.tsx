"use client";

import { useEffect, useRef } from "react";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = [
  "precision highp float;",
  "uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 acc;uniform float k;",
  "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
  "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
  "float fb(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}",
  "float field(vec2 p,vec2 mm){vec2 q=vec2(fb(p*1.6+t*.06),fb(p*1.6+vec2(5.2,1.3)-t*.05));",
  "float d=length(p-mm);return fb(p*2.2+3.2*q+vec2(0.,t*.04)+.9*exp(-d*2.5)*vec2(cos(t),sin(t)));}",
  "void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=(gl_FragCoord.xy-.5*r)/r.y;",
  "float band=floor(uv.y*28.);float tk=floor(t*7.);",
  "float g=step(1.-.09*k,h(vec2(band,tk)));p.x+=g*(h(vec2(band,tk+1.))-.5)*.35*k;",
  "vec2 mm=(m-.5)*vec2(r.x/r.y,1.);",
  "float s=.012*k+g*.03*k;",
  "float fr=field(p+vec2(s,0.),mm),fg=field(p,mm),fbv=field(p-vec2(s,0.),mm);",
  "vec3 v=smoothstep(vec3(.42),vec3(.86),vec3(fr,fg,fbv));",
  "vec3 col=vec3(.02,.012,.015);",
  "col=mix(col,acc*.85,v.r*vec3(1.,.0,.0)+v.g*vec3(0.,1.,0.)+v.b*vec3(0.,0.,1.));",
  "col+=pow(v,vec3(5.))*vec3(1.,.85,.8)*.9;",
  "col*=.82+.18*sin(gl_FragCoord.y*1.6);",
  "col+=(h(gl_FragCoord.xy+t)-.5)*.06;",
  "float vg=smoothstep(1.25,.3,length((uv-.5)*vec2(1.2,1.)));col*=mix(.35,1.,vg);",
  "col=mix(col,vec3(0.),smoothstep(.55,1.,1.-uv.y)*.55);",
  "gl_FragColor=vec4(col,1.);}",
].join("\n");

function hexRGB(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Animated WebGL backdrop for the label hero. Silently renders nothing if WebGL is unavailable. */
export default function LabelHeroGL({ accent, intensity = 1 }: { accent: string; intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(["r", "t", "m", "acc", "k"].map((n) => [n, gl.getUniformLocation(pr, n)]));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(cv.clientWidth * dpr));
      const h = Math.max(1, Math.floor(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    const mouse = [0.5, 0.5];
    const target = [0.5, 0.5];
    const parent = cv.parentElement;
    const onMove = (e: PointerEvent) => {
      const rc = cv.getBoundingClientRect();
      target[0] = (e.clientX - rc.left) / rc.width;
      target[1] = 1 - (e.clientY - rc.top) / rc.height;
    };
    parent?.addEventListener("pointermove", onMove);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgb = hexRGB(accent);
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);

    const t0 = performance.now();
    let raf = 0;
    function frame(now: number) {
      raf = 0;
      mouse[0] += (target[0] - mouse[0]) * 0.06;
      mouse[1] += (target[1] - mouse[1]) * 0.06;
      gl!.uniform2f(U.r, cv!.width, cv!.height);
      gl!.uniform1f(U.t, reduce ? 12 : (now - t0) / 1000);
      gl!.uniform2f(U.m, mouse[0], mouse[1]);
      gl!.uniform3f(U.acc, rgb[0], rgb[1], rgb[2]);
      gl!.uniform1f(U.k, intensity);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      parent?.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [accent, intensity]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block h-full w-full" />;
}
