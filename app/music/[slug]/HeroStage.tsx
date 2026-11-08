"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = [
  "precision highp float;",
  "uniform vec2 r;uniform float t;uniform vec2 m;uniform vec2 c;uniform float sz;uniform vec3 acc;uniform float k;uniform float e;",
  "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
  "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
  "void main(){vec2 uv=gl_FragCoord.xy/r;",
  "float band=floor(uv.y*30.);float tk=floor(t*6.);",
  "float g=step(1.-.07*k*(1.+e),h(vec2(band,tk)));",
  "vec2 fc=gl_FragCoord.xy;fc.x+=g*(h(vec2(band,tk+3.))-.5)*r.x*.08*k;",
  "vec2 p=(fc-c*r)/r.y;",
  "vec2 mm=(m-c)*vec2(r.x/r.y,1.);",
  "float d=length(p);float a=atan(p.y,p.x);vec2 dir=vec2(cos(a),sin(a));",
  "float mInf=exp(-pow(length(dir*d-mm),2.)*6.)*(.5+e*.5);",
  "vec3 col=vec3(.012,.01,.012);",
  "float lw=1.8/r.y;float amp=(.035+.05*e)*k;",
  "float s=(.004+.01*e)*k+g*.01*k;",
  "for(int j=0;j<30;j++){float i=float(j);",
  "float base=sz*.62+i*.024*(1.+.15*e*sin(t*3.+i));",
  "float pulse=.6+.4*sin(t*(2.+e*3.)-i*.35);",
  "vec2 q=dir*(1.6+i*.08)+vec2(i*1.31,t*(.5+e*.9));",
  "float nv=n(q*1.7)*.7+n(q*4.3)*.3;",
  "float rr=base+amp*pow(nv,1.5)*pulse*(1.+i*.05)+mInf*.06;",
  "float lR=1.-smoothstep(0.,lw,abs(d+s-rr)),lG=1.-smoothstep(0.,lw,abs(d-rr)),lB=1.-smoothstep(0.,lw,abs(d-s-rr));",
  "float hot=smoothstep(.4,.85,nv*pulse);",
  "vec3 lc=mix(vec3(.93,.9,.87),acc*1.2,hot);",
  "float fade=1.-i/34.;",
  "col=max(col,vec3(lR,lG,lB)*lc*fade);}",
  "col+=acc*.12*exp(-d*3.)*(.4+e);",
  "col*=.85+.15*sin(gl_FragCoord.y*1.7);",
  "col+=(h(gl_FragCoord.xy+t)-.5)*.05;",
  "col=mix(col,vec3(0.),smoothstep(.4,1.,1.-uv.y)*.4);",
  "gl_FragColor=vec4(col,1.);}",
].join("\n");

function hexRGB(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const Ctx = createContext<{ playing: boolean; setPlaying: (v: boolean) => void }>({ playing: false, setPlaying: () => {} });
export const useStage = () => useContext(Ctx);

/** Hero with a WebGL ring field centred on the cover. Playing the preview raises the energy of the rings. */
export default function HeroStage({ accent, left, cover }: { accent: string; left: ReactNode; cover: ReactNode }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

  useEffect(() => {
    const cv = cvRef.current;
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
    const U = Object.fromEntries(["r", "t", "m", "c", "sz", "acc", "k", "e"].map((n) => [n, gl.getUniformLocation(pr, n)]));

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

    const mouse = [0.5, 0.5];
    const target = [0.5, 0.5];
    let energy = 0;
    const parent = cv.parentElement;
    const onMove = (ev: PointerEvent) => {
      const rc = cv.getBoundingClientRect();
      target[0] = (ev.clientX - rc.left) / rc.width;
      target[1] = 1 - (ev.clientY - rc.top) / rc.height;
    };
    parent?.addEventListener("pointermove", onMove);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgb = hexRGB(accent);
    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    const t0 = performance.now();
    function frame(now: number) {
      raf = 0;
      mouse[0] += (target[0] - mouse[0]) * 0.07;
      mouse[1] += (target[1] - mouse[1]) * 0.07;
      energy += ((playingRef.current ? 1 : 0) - energy) * 0.04;
      const rc = cv!.getBoundingClientRect();
      let cx = 0.72, cy = 0.5, sz = 0.3;
      if (coverRef.current && rc.width > 0) {
        const cr = coverRef.current.getBoundingClientRect();
        cx = (cr.left + cr.width / 2 - rc.left) / rc.width;
        cy = 1 - (cr.top + cr.height / 2 - rc.top) / rc.height;
        sz = cr.width / rc.height;
      }
      gl!.uniform2f(U.r, cv!.width, cv!.height);
      gl!.uniform1f(U.t, reduce ? 6 : (now - t0) / 1000);
      gl!.uniform2f(U.m, mouse[0], mouse[1]);
      gl!.uniform2f(U.c, cx, cy);
      gl!.uniform1f(U.sz, sz);
      gl!.uniform3f(U.acc, rgb[0], rgb[1], rgb[2]);
      gl!.uniform1f(U.k, 1);
      gl!.uniform1f(U.e, energy);
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
  }, [accent]);

  return (
    <Ctx.Provider value={{ playing, setPlaying }}>
      <section className="relative flex min-h-[760px] flex-col overflow-hidden bg-[#050405] lg:min-h-[860px]">
        <canvas ref={cvRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1360px] flex-1 flex-wrap-reverse items-center gap-14 px-5 pb-16 pt-10 sm:px-8">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">{left}</div>
          <div className="flex flex-[1_1_340px] justify-center">
            <div ref={coverRef} className="relative aspect-square w-[min(100%,400px)] border-2 border-[#F4F1EC] bg-[#110F12]" style={{ boxShadow: `14px 14px 0 ${accent}` }}>
              {cover}
            </div>
          </div>
        </div>
      </section>
    </Ctx.Provider>
  );
}
