"use client";

import { useEffect, useRef } from "react";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = [
  "precision highp float;",
  "uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 acc;uniform float k;uniform float cs;",
  "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
  "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
  "float lvl(float col,float cols){float x=col/cols;",
  "float bass=exp(-x*2.2)*.55;",
  "float beat=pow(.5+.5*sin(t*4.2),6.)*.35*exp(-x*3.);",
  "float v=n(vec2(col*.18,t*1.6))*.55+n(vec2(col*.6,t*3.1))*.25+bass+beat;",
  "float md=exp(-pow((x-m.x)*6.,2.))*.45*m.y;",
  "return clamp((v*.85+md)*(.55+.45*k),0.,1.);}",
  "void main(){vec2 fc=gl_FragCoord.xy;",
  "float band=floor(fc.y/r.y*26.);float tk=floor(t*6.);",
  "float g=step(1.-.07*k,h(vec2(band,tk)));",
  "fc.x+=g*(h(vec2(band,tk+2.))-.5)*r.x*.06*k;",
  "vec2 cell=floor(fc/cs);vec2 f=fract(fc/cs);",
  "float cols=floor(r.x/cs),rows=floor(r.y/cs);",
  "float L=lvl(cell.x,cols);",
  "float y=cell.y/rows;",
  "float lit=step(y,L*.92);",
  "float peak=floor(lvl(cell.x,cols)*.92*rows+1.5);",
  "float isPeak=step(abs(cell.y-peak),.5);",
  "float led=step(.14,f.x)*step(f.x,.86)*step(.14,f.y)*step(f.y,.86);",
  "vec3 hot=mix(vec3(.94,.92,.88),acc*1.15,smoothstep(.25,.75,y/max(L,.001)));",
  "vec3 col=vec3(.03,.026,.03)*led;",
  "col=mix(col,hot*led,lit);",
  "col=mix(col,vec3(1.)*led,isPeak*.9);",
  "col.r+=g*.15*k;col.b+=g*.08*k;",
  "col*=.86+.14*sin(gl_FragCoord.y*1.7);",
  "col+=(h(gl_FragCoord.xy+t)-.5)*.04;",
  "vec2 uv=gl_FragCoord.xy/r;",
  "col*=mix(.25,1.,smoothstep(.0,.6,uv.x));",
  "col*=mix(.45,1.,smoothstep(0.,.5,uv.y));",
  "gl_FragColor=vec4(col,1.);}",
].join("\n");

function hexRGB(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** LED equalizer wall for the library hero. Renders nothing if WebGL is unavailable. */
export default function MusicHeroGL({ accent }: { accent: string }) {
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
    const U = Object.fromEntries(["r", "t", "m", "acc", "k", "cs"].map((n) => [n, gl.getUniformLocation(pr, n)]));

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    const t0 = performance.now();
    function frame(now: number) {
      raf = 0;
      mouse[0] += (target[0] - mouse[0]) * 0.08;
      mouse[1] += (target[1] - mouse[1]) * 0.08;
      gl!.uniform2f(U.r, cv!.width, cv!.height);
      gl!.uniform1f(U.t, reduce ? 5 : (now - t0) / 1000);
      gl!.uniform2f(U.m, mouse[0], mouse[1]);
      gl!.uniform3f(U.acc, rgb[0], rgb[1], rgb[2]);
      gl!.uniform1f(U.k, 1);
      gl!.uniform1f(U.cs, 14 * dpr);
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

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block h-full w-full" />;
}
