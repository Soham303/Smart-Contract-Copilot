'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const TABS = ['Block stack', 'Contract graph', 'Pipeline'];
const STEPS = ['Build', 'Generate', 'Verify', 'Deploy'];
const CAPS = [
    'Blocks drop in, snap together and report their checks. Move your cursor over the scene to tilt it.',
    'Every block links to a central contract. Pulses show data moving between them.',
    'The full pipeline in one scene: build, generate code, verify, deploy.',
];

export default function HeroScene() {
    const hostRef = useRef<HTMLDivElement>(null);
    const spotRef = useRef<HTMLDivElement>(null);
    const api = useRef({ select: (_i: number) => { }, setStage: (_i: number) => { } });
    const [active, setActive] = useState(0);
    const [stageUi, setStageUi] = useState(0);
    const [noGl, setNoGl] = useState(false);

    useEffect(() => {
        const host = hostRef.current!;
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
            setNoGl(true);
            return;
        }
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mo = reduce ? 0 : 1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.set(0, 0.5, 9.5);

        /* ---------- helpers ---------- */
        const cl = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const eob = (p: number) => {
            const c1 = 1.70158, c3 = c1 + 1;
            return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
        };
        const tex = (c: HTMLCanvasElement) => {
            const t = new THREE.CanvasTexture(c);
            const cs = (THREE as any).SRGBColorSpace;
            if (cs) (t as any).colorSpace = cs;
            t.anisotropy = 4;
            return t;
        };
        const canvas2d = (w: number, h: number) => {
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            return { c, x: c.getContext('2d')! };
        };
        const rr = (x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number) => {
            x.beginPath(); x.moveTo(a + r, b);
            x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r);
            x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
        };
        const rbox = (w: number, h: number, d: number, r: number) => {
            const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
            s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
            s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
            s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
            const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, curveSegments: 8 });
            g.translate(0, 0, -d / 2);
            return g;
        };
        const mat = (c: number) =>
            new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.16, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3, emissive: c, emissiveIntensity: 0.14 });
        const label = (t: string, s: string) => {
            const { c, x } = canvas2d(512, 160);
            x.textBaseline = 'middle';
            x.fillStyle = '#0f2a24'; x.font = '700 46px ui-sans-serif,system-ui,sans-serif'; x.fillText(t, 28, 66);
            x.fillStyle = 'rgba(15,42,36,.6)'; x.font = '500 28px ui-monospace,monospace'; x.fillText(s, 28, 118);
            x.fillStyle = '#0f2a24'; x.beginPath(); x.arc(466, 56, 24, 0, 7); x.fill();
            x.strokeStyle = '#fff'; x.lineWidth = 7; x.lineCap = 'round';
            x.beginPath(); x.moveTo(455, 57); x.lineTo(464, 66); x.lineTo(479, 47); x.stroke();
            return tex(c);
        };
        const block = (t: string, s: string, col: number, w = 2.8, h = 1, d = 1.5) => {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(rbox(w, h, d, 0.22), mat(col)));
            [-0.6, 0.6].forEach((x) => {
                const st = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.1, 24), mat(col));
                st.position.set(x, h / 2 + 0.13, 0); g.add(st);
            });
            [-1, 1].forEach((s2) => {
                const o = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                o.position.set(s2 * (w / 2 + 0.1), 0, 0); g.add(o);
            });
            const p = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.88, (w * 0.88) / 3.2), new THREE.MeshBasicMaterial({ map: label(t, s), transparent: true }));
            p.position.set(0, 0, d / 2 + 0.1); g.add(p);
            return g;
        };
        const chip = (t: string) => {
            const W = 256, H = 72, { c, x } = canvas2d(W, H);
            x.fillStyle = 'rgba(255,255,255,.95)'; rr(x, 2, 2, W - 4, H - 4, 34); x.fill();
            x.strokeStyle = '#cfe6df'; x.lineWidth = 3; x.stroke();
            x.fillStyle = '#0f2a24'; x.font = '600 30px ui-monospace,monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
            x.fillText(t, W / 2, H / 2 + 1);
            const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(c), depthTest: false, transparent: true }));
            s.scale.set((W / H) * 0.5, 0.5, 1); s.renderOrder = 5;
            return s;
        };
        const shadow = () => {
            const { c, x } = canvas2d(128, 128);
            const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
            g.addColorStop(0, 'rgba(15,40,35,.45)'); g.addColorStop(1, 'rgba(15,40,35,0)');
            x.fillStyle = g; x.fillRect(0, 0, 128, 128);
            const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({ map: tex(c), transparent: true, depthWrite: false }));
            [2.4, 3.3, 4.2].forEach((r, i) => {
                const o = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.035, 96), new THREE.MeshBasicMaterial({ color: i ? 0x8b7bff : 0x0f9f82, transparent: true, opacity: 0.55 - i * 0.15, side: THREE.DoubleSide, depthWrite: false }));
                o.position.z = 0.01; m.add(o);
            });
            m.rotation.x = -Math.PI / 2; m.position.y = -2.1;
            return m;
        };

        /* ---------- lighting: soft studio reflections ---------- */
        const envS = new THREE.Scene();
        envS.background = new THREE.Color(0xdde7f0);
        ([[0, 7, 0, 0xffffff, 6], [-7, 2, 3, 0x8ff0d0, 5], [7, 1, 3, 0xffd9a8, 4], [0, -3, 6, 0xb9a8ff, 3], [-4, -4, -2, 0x6fe0ff, 3]] as number[][]).forEach(([x, y, z, c, k]) => {
            const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide }));
            m.position.set(x, y, z); m.lookAt(0, 0, 0); envS.add(m);
        });
        scene.environment = new THREE.PMREMGenerator(renderer).fromScene(envS, 0.04).texture;
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dl = new THREE.DirectionalLight(0xffffff, 2);
        dl.position.set(4, 6, 6); scene.add(dl);

        const C = { teal: 0x34d3a3, orange: 0xffa94d, blue: 0x5b9bff, violet: 0x9b7bff };
        const rig = new THREE.Group(); scene.add(rig);
        const dust = new THREE.Points(
            new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 240 }, (_, i) => (Math.random() - 0.5) * (i % 3 ? 9 : 16)), 3)),
            new THREE.PointsMaterial({ color: 0x34d3a3, size: 0.05, transparent: true, opacity: 0.7 })
        );
        rig.add(dust);

        /* ---------- concept 1: block stack ---------- */
        const g1 = new THREE.Group(); rig.add(g1); g1.add(shadow());
        const specs: [string, string, number, number][] = [
            ['Fungible Token', 'FA · SAPE', C.teal, -1.2],
            ['Mint Control', 'guardrail', C.orange, -0.05],
            ['Linear Vesting', '180d cliff', C.blue, 1.1],
        ];
        const stack = specs.map((s) => { const b = block(s[0], s[1], s[2]); b.userData.y = s[3]; g1.add(b); return b; });
        const rings = stack.map(() => {
            const r = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.03, 8, 64), new THREE.MeshBasicMaterial({ color: 0x0f9f82, transparent: true, opacity: 0 }));
            r.rotation.x = Math.PI / 2; g1.add(r); return r;
        });
        const sp = stack.map(() => {
            const n = 28;
            const g = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
            const v = Array.from({ length: n }, () => { const a = Math.random() * 6.28, s = 0.6 + Math.random() * 1.6; return [Math.cos(a) * s, (Math.random() - 0.3) * 1.5, Math.sin(a) * s]; });
            const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffc44d, size: 0.08, transparent: true, opacity: 0, depthWrite: false }));
            p.userData.v = v; g1.add(p); return p;
        });
        const orb = ['✓ compiled', 'risk 92/100', 'gas −23%', 'prover passed'].map((s) => {
            const c = chip(s); c.material.depthTest = true; c.userData.b = c.scale.clone(); g1.add(c); return c;
        });
        const anim1 = (lt: number, t: number) => {
            stack.forEach((b, i) => {
                const d = i * 0.6, p = cl((lt - d) / 0.9, 0, 1);
                b.visible = lt >= d;
                b.position.y = lerp(b.userData.y + 6, b.userData.y, eob(p));
                b.rotation.y = (1 - p) * Math.PI * 1.2;
                const rp = (lt - d - 0.8) / 0.9, r = rings[i];
                r.visible = rp > 0 && rp < 1;
                if (r.visible) { r.position.y = b.userData.y; r.scale.setScalar(1 + rp * 0.5); (r.material as THREE.MeshBasicMaterial).opacity = (1 - rp) * 0.7; }
                const q = sp[i], u = cl((lt - d - 0.82) / 0.8, 0, 1);
                q.visible = u > 0 && u < 1;
                if (q.visible) {
                    const a = q.geometry.attributes.position;
                    (q.userData.v as number[][]).forEach((w, k) => a.setXYZ(k, w[0] * u * 1.3, b.userData.y + 0.5 + w[1] * u - u * u * 0.8, w[2] * u * 0.8));
                    a.needsUpdate = true;
                    (q.material as THREE.PointsMaterial).opacity = 1 - u;
                }
            });
            orb.forEach((c, i) => {
                const k = eob(cl((lt - 2.2 - i * 0.18) / 0.6, 0, 1)), a = t * 0.35 * mo + i * 1.571;
                c.visible = k > 0.02;
                c.scale.copy(c.userData.b).multiplyScalar(Math.max(0.001, k));
                c.position.set(Math.cos(a) * 3.5, Math.sin(a * 2) * 0.35 + (i % 2 ? 0.9 : -0.3), Math.sin(a) * 1.4);
            });
            g1.position.y = Math.sin(t * 1.2) * 0.07 * mo;
        };

        /* ---------- concept 2: contract graph ---------- */
        const g2 = new THREE.Group(); rig.add(g2);
        const names = ['Token', 'Mint Gate', 'Royalty', 'Whitelist', 'Vesting', 'Owner', 'Escrow'];
        const cols = [C.teal, C.orange, C.blue, C.violet, C.teal, C.orange, C.blue];
        const nodes: { m: THREE.Mesh; c: THREE.Sprite; s: number; pos: THREE.Vector3 }[] = [];
        const mkNode = (col: number, s: number, name: string, pos: THREE.Vector3) => {
            const m = new THREE.Mesh(rbox(1, 1, 1, 0.25), mat(col)); m.position.copy(pos); g2.add(m);
            const c = chip(name); c.position.set(pos.x, pos.y + s * 0.95, pos.z); g2.add(c);
            nodes.push({ m, c, s, pos });
        };
        mkNode(0x12c28f, 1.45, 'Contract', new THREE.Vector3(0, 0, 0));
        names.forEach((n, i) => {
            const a = (i / names.length) * Math.PI * 2 + 0.3;
            mkNode(cols[i], 1, n, new THREE.Vector3(Math.cos(a) * 3.5, Math.sin(a) * 1.75, Math.sin(a * 2) * 1.2));
        });
        const lineM = (o: number) => new THREE.LineBasicMaterial({ color: 0x0f9f82, transparent: true, opacity: o });
        const pulses: { p: THREE.Mesh; a: THREE.Vector3; b: THREE.Vector3; i: number }[] = [];
        const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.025, 8, 96), new THREE.MeshBasicMaterial({ color: 0x8b7bff, transparent: true, opacity: 0.65 }));
        orbit.rotation.x = 1.2; g2.add(orbit);
        const orbit2 = orbit.clone(); orbit2.scale.setScalar(1.45);
        orbit2.material = (orbit.material as THREE.MeshBasicMaterial).clone(); (orbit2.material as THREE.MeshBasicMaterial).opacity = 0.3; g2.add(orbit2);
        const gl = canvas2d(128, 128);
        const gg = gl.x.createRadialGradient(64, 64, 0, 64, 64, 64);
        gg.addColorStop(0, 'rgba(60,220,170,.5)'); gg.addColorStop(1, 'rgba(60,220,170,0)');
        gl.x.fillStyle = gg; gl.x.fillRect(0, 0, 128, 128);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(gl.c), transparent: true, depthWrite: false }));
        halo.scale.setScalar(6); halo.renderOrder = -1; g2.add(halo);
        for (let i = 1; i < nodes.length; i++) {
            const a = nodes[0].pos, b = nodes[i].pos, nx = nodes[(i % 7) + 1].pos;
            g2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), lineM(0.5)));
            g2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([b, nx]), lineM(0.22)));
            const p = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshBasicMaterial({ color: 0x2fd9a8 }));
            p.add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0x2fd9a8, transparent: true, opacity: 0.25 })));
            g2.add(p); pulses.push({ p, a, b, i });
        }
        const anim2 = (lt: number, t: number) => {
            nodes.forEach((n, i) => {
                const k = eob(cl((lt - i * 0.1) / 0.7, 0, 1));
                n.m.scale.setScalar(Math.max(0.001, n.s * k));
                n.m.rotation.y = t * 0.4 * mo + i; n.m.rotation.x = Math.sin(t * 0.6 + i) * 0.25 * mo;
                n.c.visible = k > 0.6;
            });
            pulses.forEach((o) => {
                let u = (t * 0.35 * mo + o.i * 0.14) % 1; if (o.i % 2) u = 1 - u;
                o.p.position.lerpVectors(o.a, o.b, u); o.p.visible = lt > 1;
            });
            orbit.rotation.z = t * 0.4 * mo; orbit2.rotation.z = -t * 0.25 * mo; orbit2.rotation.x = 1.2 + Math.sin(t * 0.3) * 0.2 * mo;
            halo.scale.setScalar(6 + Math.sin(t * 1.5) * 0.4 * mo);
            g2.rotation.y = Math.sin(t * 0.25) * 0.25 * mo;
        };

        /* ---------- concept 3: pipeline ---------- */
        const g3 = new THREE.Group(); rig.add(g3); g3.add(shadow());
        const subs = [0, 1, 2, 3].map(() => { const s = new THREE.Group(); g3.add(s); return s; });
        specs.forEach((s) => { const b = block(s[0], s[1], s[2]); b.position.y = s[3]; b.scale.setScalar(0.9); subs[0].add(b); });
        const code = canvas2d(768, 480);
        code.x.fillStyle = '#0b1117'; code.x.fillRect(0, 0, 768, 480);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((k, i) => { code.x.fillStyle = k; code.x.beginPath(); code.x.arc(30 + i * 26, 30, 8, 0, 7); code.x.fill(); });
        code.x.font = '500 26px ui-monospace,Menlo,monospace'; code.x.textBaseline = 'middle';
        const L: string[][][] = [
            [['module ', '#c792ea'], ['sky_token {', '#e6edf3']],
            [['  struct ', '#c792ea'], ['AdminCap ', '#82aaff'], ['has key', '#f5b971']],
            [['  public entry fun ', '#c792ea'], ['mint(', '#7fd1b9']],
            [['    admin: &signer,', '#e6edf3']], [['    amount: u64', '#e6edf3']],
            [['  ) acquires ', '#c792ea'], ['AdminCap {', '#82aaff']],
            [['    assert!(is_admin);', '#7fd1b9']], [['    // 5% royalty', '#6b7d8f']],
            [['  }', '#e6edf3']], [['}', '#e6edf3']],
        ];
        L.forEach((ln, i) => { let px0 = 28; ln.forEach(([t, k]) => { code.x.fillStyle = k; code.x.fillText(t, px0, 84 + i * 36); px0 += code.x.measureText(t).width; }); });
        const panel = new THREE.Mesh(rbox(4.6, 2.9, 0.2, 0.2), new THREE.MeshPhysicalMaterial({ color: 0x0b1117, roughness: 0.3, clearcoat: 1 }));
        const pf = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.625), new THREE.MeshBasicMaterial({ map: tex(code.c) })); pf.position.z = 0.2;
        subs[1].add(panel, pf);
        const sh = new THREE.Shape();
        sh.moveTo(0, 1.6); sh.lineTo(1.3, 1.1); sh.lineTo(1.3, 0.1);
        sh.bezierCurveTo(1.3, -0.8, 0.6, -1.4, 0, -1.7); sh.bezierCurveTo(-0.6, -1.4, -1.3, -0.8, -1.3, 0.1);
        sh.lineTo(-1.3, 1.1); sh.closePath();
        const shield = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 5 }), mat(0x12c28f));
        shield.position.z = -0.17;
        const ck = canvas2d(256, 256);
        ck.x.strokeStyle = '#fff'; ck.x.lineWidth = 30; ck.x.lineCap = 'round'; ck.x.lineJoin = 'round';
        ck.x.beginPath(); ck.x.moveTo(60, 135); ck.x.lineTo(110, 185); ck.x.lineTo(200, 80); ck.x.stroke();
        const check = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), new THREE.MeshBasicMaterial({ map: tex(ck.c), transparent: true }));
        check.position.set(0, 0.05, 0.5);
        subs[2].add(shield, check);
        [-2.1, 0, 2.1].forEach((x, i) => {
            const m = new THREE.Mesh(rbox(1.3, 1.3, 1.3, 0.3), mat([C.teal, 0x12c28f, C.blue][i])); m.position.x = x; subs[3].add(m);
            if (i < 2) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.85, 16), mat(0x0f766e)); l.rotation.z = Math.PI / 2; l.position.x = x + 1.05; subs[3].add(l); }
        });
        const live = chip('live on testnet'); live.position.set(0, 1.45, 0); subs[3].add(live);
        const txc = chip('tx 0x8f3c…a91e'); txc.position.set(0, -1.45, 0); subs[3].add(txc);
        const scan = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.06), new THREE.MeshBasicMaterial({ color: 0x5bffc8, transparent: true, opacity: 0.85 }));
        scan.position.z = 0.22; subs[1].add(scan);
        const sc2 = scan.clone(); sc2.scale.x = 0.6; sc2.position.z = 0.55; subs[2].add(sc2);

        let stage = 0, stageT = 0;
        const sv = [1, 0, 0, 0];
        const anim3 = (t: number, dt: number) => {
            if (mo && t - stageT > 2.8) { stage = (stage + 1) % 4; stageT = t; setStageUi(stage); }
            subs.forEach((s, i) => {
                sv[i] += ((i === stage ? 1 : 0) - sv[i]) * Math.min(1, dt * 7);
                s.visible = sv[i] > 0.01; s.scale.setScalar(Math.max(0.001, sv[i]));
                s.rotation.y = (1 - sv[i]) * -1.4 + Math.sin(t * 0.8) * 0.12 * mo;
            });
            scan.position.y = Math.sin(t * 2) * 1.2 * mo; sc2.position.y = Math.sin(t * 2.2) * 1.3 * mo;
            g3.position.y = Math.sin(t * 1.2) * 0.07 * mo;
        };

        /* ---------- state, input, loop ---------- */
        const groups = [g1, g2, g3], vis = [1, 0, 0];
        let cur = 0, start = performance.now() / 1000, last = start, px = 0, py = 0, onScreen = true, raf = 0;
        api.current.select = (i: number) => {
            cur = i; start = performance.now() / 1000; setActive(i);
            if (i === 2) { stage = 0; stageT = start; setStageUi(0); }
        };
        api.current.setStage = (i: number) => { stage = i; stageT = performance.now() / 1000; setStageUi(i); };

        const onMove = (e: PointerEvent) => {
            const r = host.getBoundingClientRect();
            px = ((e.clientX - r.left) / r.width - 0.5) * 2; py = ((e.clientY - r.top) / r.height - 0.5) * 2;
            spotRef.current?.style.setProperty('--mx', e.clientX - r.left + 'px');
            spotRef.current?.style.setProperty('--my', e.clientY - r.top + 'px');
        };
        const onLeave = () => { px = py = 0; };
        host.addEventListener('pointermove', onMove);
        host.addEventListener('pointerleave', onLeave);
        const io = new IntersectionObserver((e) => { onScreen = e[0].isIntersecting; });
        io.observe(host);
        const resize = () => {
            const w = host.clientWidth, h = host.clientHeight;
            renderer.setSize(w, h, false); camera.aspect = w / h;
            camera.position.z = w < 480 ? 10.8 : w < 768 ? 9.6 : 8.8;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize); ro.observe(host); resize();

        const frame = () => {
            raf = requestAnimationFrame(frame);
            if (!onScreen) return;
            const t = performance.now() / 1000, dt = Math.min(0.05, t - last); last = t;
            groups.forEach((g, i) => {
                vis[i] += ((i === cur ? 1 : 0) - vis[i]) * Math.min(1, dt * 6);
                g.visible = vis[i] > 0.01; g.scale.setScalar(0.6 + 0.4 * vis[i]);
            });
            const lt = reduce ? 99 : t - start;
            if (g1.visible) anim1(lt, t);
            if (g2.visible) anim2(lt, t);
            if (g3.visible) anim3(t, dt);
            dust.rotation.y = t * 0.02 * mo; dust.position.y = Math.sin(t * 0.4) * 0.2 * mo;
            rig.rotation.y = lerp(rig.rotation.y, px * 0.35 * mo, 0.06);
            rig.rotation.x = lerp(rig.rotation.x, py * 0.15 * mo, 0.06);
            renderer.render(scene, camera);
        };
        frame();

        return () => {
            cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
            host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave);
            scene.traverse((o: any) => {
                o.geometry?.dispose?.();
                const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x: any) => { x.map?.dispose?.(); x.dispose?.(); });
            });
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    const pill = (on: boolean, small = false): React.CSSProperties => ({
        padding: small ? '4px 10px' : '6px 14px',
        fontSize: small ? '0.72rem' : '0.78rem',
        fontWeight: 600,
        borderRadius: '9999px',
        cursor: 'pointer',
        border: `1px solid ${on ? 'var(--primary)' : 'var(--border-strong)'}`,
        background: on ? 'var(--primary)' : 'var(--surface-container-lowest)',
        color: on ? '#ffffff' : 'var(--text-primary)',
        transition: 'all 0.15s ease',
    });

    return (
        <div
            aria-label="Interactive 3D preview"
            style={{
                width: '100%',
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md), 0 0 25px rgba(15, 118, 110, 0.06)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                ref={hostRef}
                aria-hidden="true"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: 'clamp(270px, 27vw, 330px)',
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(15, 118, 110, 0.08) 0%, rgba(248, 249, 255, 0.45) 100%)',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: 'radial-gradient(circle at 50% 55%, rgba(15,118,110,0.18), transparent 65%), radial-gradient(var(--border-subtle) 1px, transparent 1.5px) 0 0 / 20px 20px',
                        WebkitMaskImage: 'radial-gradient(closest-side, #000 70%, transparent)',
                        maskImage: 'radial-gradient(closest-side, #000 70%, transparent)',
                    }}
                />
                <div
                    ref={spotRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        opacity: 0.5,
                        background: 'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(15,118,110,0.2), transparent 70%)',
                    }}
                />
                {noGl && (
                    <p style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        3D preview needs WebGL, which is not available in this browser.
                    </p>
                )}
            </div>

            {/* Controls Bar */}
            <div
                style={{
                    padding: '12px 16px 14px',
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'var(--surface-container-low)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {TABS.map((t, i) => (
                        <button
                            key={t}
                            type="button"
                            aria-pressed={active === i}
                            onClick={() => api.current.select(i)}
                            style={pill(active === i)}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <p
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        lineHeight: 1.55,
                        maxWidth: '560px',
                        margin: 0,
                    }}
                >
                    {CAPS[active]}
                </p>

                {active === 2 && (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
                        {STEPS.map((s, i) => (
                            <button
                                key={s}
                                type="button"
                                aria-pressed={stageUi === i}
                                onClick={() => api.current.setStage(i)}
                                style={pill(stageUi === i, true)}
                            >
                                {i + 1} {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}