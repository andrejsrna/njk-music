"use client";

import { useEffect, useRef } from "react";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = [
  "precision highp float;",
  "uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 acc;uniform float k;",
  "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
  "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
  "float disp(float x,float i,vec2 mm,float asp){",
  "float c=exp(-pow((x-.62)*3.2,2.));",
  "float md=exp(-pow((x-mm.x)*asp*4.,2.))*exp(-pow((1.-i/44.)-mm.y,2.)*14.)*1.4;",
  "float pulse=.65+.35*sin(t*2.4+i*.45);",
  "float a=n(vec2(x*9.,i*1.7+t*.9))*.65+n(vec2(x*23.,i*3.1-t*1.3))*.35;",
  "return (c*pulse+md)*pow(a,1.6)*.2*k;}",
  "void main(){vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;",
  "float band=floor(uv.y*30.);float tk=floor(t*6.);",
  "float g=step(1.-.08*k,h(vec2(band,tk)));",
  "float x=uv.x+g*(h(vec2(band,tk+3.))-.5)*.12*k;",
  "vec2 mm=m;",
  "vec3 col=vec3(.012,.01,.012);",
  "float lw=1.6/r.y;",
  "for(int j=0;j<44;j++){float i=float(j);",
  "float base=.93-i*.0185;",
  "float s=.0025*k+g*.006*k;",
  "float yR=base+disp(x+s,i,mm,asp),yG=base+disp(x,i,mm,asp),yB=base+disp(x-s,i,mm,asp);",
  "if(uv.y<yG){col=vec3(.012,.01,.012);}",
  "float front=i/44.;",
  "vec3 lc=mix(vec3(.95,.93,.9),acc*1.15,smoothstep(.02,.12,yG-base));",
  "vec3 l=vec3(1.-smoothstep(0.,lw,abs(uv.y-yR)),1.-smoothstep(0.,lw,abs(uv.y-yG)),1.-smoothstep(0.,lw,abs(uv.y-yB)));",
  "col=max(col,l*lc*(.35+.65*front));}",
  "col*=.86+.14*sin(gl_FragCoord.y*1.7);",
  "col+=(h(gl_FragCoord.xy+t)-.5)*.05;",
  "col*=smoothstep(0.,.25,uv.x)*.6+.4;",
  "gl_FragColor=vec4(col,1.);}",
].join("\n");

function hexRGB(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Joy-Division style waveform terrain for the homepage hero. Renders nothing if WebGL is unavailable. */
export default function HomeHeroGL({ accent, intensity = 1 }: { accent: string; intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false });
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
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    const mouse = [0.7, 0.5];
    const target = [0.7, 0.5];
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
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    const t0 = performance.now();
    function frame(now: number) {
      raf = 0;
      mouse[0] += (target[0] - mouse[0]) * 0.07;
      mouse[1] += (target[1] - mouse[1]) * 0.07;
      gl!.uniform2f(U.r, cv!.width, cv!.height);
      gl!.uniform1f(U.t, reduce ? 8 : (now - t0) / 1000);
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
