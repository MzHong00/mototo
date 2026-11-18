// Shared chibi character builder: body (chibi.glb) + swappable part GLBs (web/parts/),
// toon shading, inverted-hull outline, skin/eye recolour and blink.
// Used by index.html (play) and customize.html (customizer).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ================= catalog / state ================= */
export const SKIN_BASE = [246, 201, 176];   // skin colour baked into chibi.glb texture
export const IRIS_BASE = [200, 121, 75];    // iris colour baked into the face texture
export const CATEGORIES = ['hair', 'top', 'bottom', 'shoes'];
export const CATEGORY_LABEL = { hair: '헤어', top: '상의', bottom: '하의', shoes: '신발' };
export const PART_CATALOG = {
  hair: [
    { id: 'hair_twintail', label: '트윈테일', scalp: true, spring: true, gender: 'female' },
    { id: 'hair_male_short', label: '남자 숏컷', scalp: true, spring: true, gender: 'male' },
  ],
  top: [
    { id: 'top_tshirt', label: '티셔츠' },
    { id: 'top_shirt', label: '카라 셔츠' },
    { id: 'top_hoodie', label: '후드티' },
    { id: 'top_longtee', label: '긴팔 티' },
    { id: 'top_tank', label: '나시티' },
    { id: 'top_crop', label: '크롭티' },
    { id: 'top_stripe', label: '줄무늬 티' },
    { id: 'top_turtle', label: '터틀넥' },
    { id: 'top_cardigan', label: '가디건' },
    { id: 'top_zip', label: '집업 재킷' },
    { id: 'top_raglan', label: '라글란 티' },
    { id: 'top_sailor', label: '세일러 블라우스' },
    { id: 'top_star', label: '별 맨투맨' },
  ],
  bottom: [
    { id: 'bottom_shorts', label: '반바지' },
    { id: 'bottom_pants', label: '긴바지' },
    { id: 'bottom_skirt', label: '치마' },
  ],
  shoes: [
    { id: 'shoes_sneakers', label: '운동화' },
    { id: 'shoes_boots', label: '부츠' },
  ],
};
/** 외형: 얼굴 = 몸 텍스처 통째로 (faces/<id>_open.jpg + _closed.jpg 깜빡임).
 *  faces/<id>_iris.png = 눈 마스크 (R 눈동자, G 눈 전체) — 눈 색 바꾸기용 */
export const FACE_CATALOG = [
  { id: 'look_1', label: '동그란 눈', thumb: 'thumbs/look_1.png' },
  { id: 'look_2', label: '졸린 눈', thumb: 'thumbs/look_2.png' },
  { id: 'look_3', label: '날카로운 눈', thumb: 'thumbs/look_3.png' },
  { id: 'look_4', label: '순한 눈', thumb: 'thumbs/look_4.png' },
  { id: 'look_5', label: '굵은 눈썹', thumb: 'thumbs/look_5.png' },
];
/** 표정: 잠깐 얼굴 텍스처를 바꿈 (faces/expr_<id>.jpg) */
export const EXPRESSION_CATALOG = [
  { id: 'surprised', label: '놀람' },
  { id: 'laugh', label: '크게 웃음' },
  { id: 'cute', label: '귀여움' },
  { id: 'tired', label: '피곤' },
];
/** 성별: decides which hairstyles are offered (parts without `gender` are unisex) and the default hair */
export const GENDERS = [
  { id: 'female', label: '여자' },
  { id: 'male', label: '남자' },
];
export const DEFAULT_HAIR = { female: 'hair_twintail', male: 'hair_male_short' };
export const partFits = (item, gender) => !item.gender || item.gender === gender;
export const NONE_LABEL = { hair: '민머리', top: '없음', bottom: '없음', shoes: '없음' };
export const DEFAULT_PARTS = { hair: 'hair_twintail', top: 'top_tshirt', bottom: 'bottom_shorts', shoes: 'shoes_sneakers' };
// material that the category colour applies to; every other material keeps its own colour
const RECOLOR_MAT = { hair: 'Hair', top: 'Main', bottom: 'Main', shoes: 'Main' };
// built-in meshes of chibi.glb that the parts replace
const LEGACY_MESHES = new Set(['Hair', 'HairBangs', 'ClothShirt', 'ClothShorts', 'ClothShoes']);

export const STORAGE_KEY = 'chibiCustomize.current.v1';
export const SLOTS_KEY = 'chibiCustomize.slots.v1';

const PART_IDS = new Set(Object.values(PART_CATALOG).flat().map(p => p.id));
export const partCategory = id => CATEGORIES.find(c => PART_CATALOG[c].some(p => p.id === id)) || null;
export const isHex = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
export const rgbHex = a => '#' + a.map(v => v.toString(16).padStart(2, '0')).join('');
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const clone = o => JSON.parse(JSON.stringify(o));

/** colors[cat] === null  ->  use the part's own GLB colour ("기본"). */
export function defaultState(gender = 'female') {
  return {
    v: 2,
    gender,
    parts: { ...DEFAULT_PARTS, hair: DEFAULT_HAIR[gender] },
    face: FACE_CATALOG[0].id,
    colors: { hair: null, top: null, bottom: null, shoes: null },
    skin: rgbHex(SKIN_BASE), eyes: rgbHex(IRIS_BASE),
  };
}

// colours that were the built-in defaults of the old (v1) customizer -> treat as "기본"
const LEGACY_DEFAULT_HEX = {
  hair: ['#6f4b35', '#704b34', '#6f4b34'], shirt: ['#edf1f9', '#eef1f9'], shorts: ['#596fa0', '#59708f'], shoes: ['#997659', '#9a7659'],
};
const LEGACY_KEY = { hair: 'hair', top: 'shirt', bottom: 'shorts', shoes: 'shoes' };

/** Accepts v2 states, v1 states (colour-only presets) or garbage; always returns a valid v2 state. */
export function sanitizeState(s) {
  const out = defaultState();
  if (!s || typeof s !== 'object') return out;
  if (isHex(s.skin)) out.skin = s.skin.toLowerCase();
  if (isHex(s.eyes)) out.eyes = s.eyes.toLowerCase();
  if (FACE_CATALOG.some(f => f.id === s.face)) out.face = s.face;
  if (GENDERS.some(g => g.id === s.gender)) out.gender = s.gender;
  else {   // older saves: infer from the hairstyle
    const h = s.parts && PART_CATALOG.hair.find(p => p.id === s.parts.hair);
    if (h && h.gender) out.gender = h.gender;
  }
  const parts = s.parts && typeof s.parts === 'object' ? s.parts : {};
  const colors = s.colors && typeof s.colors === 'object' ? s.colors : null;
  for (const c of CATEGORIES) {
    const p = parts[c];
    if (typeof p === 'string' && PART_IDS.has(p) && partCategory(p) === c) out.parts[c] = p;
    if (colors) out.colors[c] = isHex(colors[c]) ? colors[c].toLowerCase() : null;
    else {
      // v1 preset: flat colour keys + boolean visibility toggles
      const lk = LEGACY_KEY[c], v = s[lk];
      if (isHex(v) && !LEGACY_DEFAULT_HEX[lk].includes(v.toLowerCase())) out.colors[c] = v.toLowerCase();
      if (parts[lk] === false) out.parts[c] = null;
    }
  }
  out.v = 2;
  return out;
}

export function readJSON(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
export function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch { return false; } }
/** null when nothing (valid) is stored */
export function loadSavedState() { const raw = readJSON(STORAGE_KEY); return raw ? sanitizeState(raw) : null; }
export function saveState(state) { return writeJSON(STORAGE_KEY, state); }

/* ================= shared materials (same look as the original viewer) ================= */
export const ramp = new THREE.DataTexture(new Uint8Array([185,185,190,255, 205,203,205,255, 245,245,245,255, 255,255,255,255]), 4, 1);
ramp.minFilter = ramp.magFilter = THREE.LinearFilter; ramp.needsUpdate = true;

export const outlineMat = new THREE.MeshBasicMaterial({ color: 0x5a3a32, side: THREE.BackSide });
outlineMat.onBeforeCompile = s => {
  s.vertexShader = s.vertexShader.replace('#include <skinning_vertex>',
    '#include <skinning_vertex>\n transformed += normalize(objectNormal) * 0.012;');
};

const COLOR_ATTR = '#if !defined(USE_COLOR) && !defined(USE_COLOR_ALPHA)\nattribute vec3 color;\n#endif\n';

// hair: thinner hull + depth offset so the outline only shows on silhouettes, never through curls/folds
export const hairLineMat = new THREE.MeshBasicMaterial({ color: 0x5a3a32, side: THREE.BackSide,
  polygonOffset: true, polygonOffsetFactor: 8, polygonOffsetUnits: 24 });
hairLineMat.onBeforeCompile = s => {
  s.vertexShader = s.vertexShader.replace('#include <skinning_vertex>',
    '#include <skinning_vertex>\n transformed += normalize(objectNormal) * 0.009;');
};
hairLineMat.customProgramCacheKey = () => 'chibi-hairline-v1';
// same, but width scaled per vertex by COLOR_0.r (baked: 0 where the hair shell is thin)
export const hairLineMatW = hairLineMat.clone();
hairLineMatW.onBeforeCompile = s => {
  s.vertexShader = COLOR_ATTR + s.vertexShader.replace('#include <skinning_vertex>',
      '#include <skinning_vertex>\n transformed += normalize(objectNormal) * 0.010 * color.r;');
};
hairLineMatW.customProgramCacheKey = () => 'chibi-hairline-w1';
if (typeof location !== 'undefined' && location.search.includes('nohl')) hairLineMat.visible = hairLineMatW.visible = false;
outlineMat.visible = hairLineMat.visible = hairLineMatW.visible = false;   // TODO 임시: 몸·머리 윤곽선도 끄기 (비교용)

/** hair strands come from a cylindrical UV: where the surface faces sideways around the head axis
 *  (curl tips) the strands smear into wood-grain rings, so fade those to the locally averaged texture. */
export function installHairShader(mat) {
  mat.onBeforeCompile = s => {
    s.vertexShader = 'varying float vTang;\n' + s.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n { vec2 r = normalize(position.xz + vec2(1e-5)); vec3 n = normalize(normal);'
      + ' vTang = abs(dot(n.xz, vec2(-r.y, r.x))) + 0.6 * max(-n.y, 0.0); }');
    s.fragmentShader = 'varying float vTang;\n' + s.fragmentShader.replace('#include <map_fragment>',
      '#ifdef USE_MAP\n vec4 sampledDiffuseColor = texture2D(map, vMapUv);\n'
      + ' vec4 hairAvg = textureLod(map, vMapUv, 6.0);\n'
      + ' sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, hairAvg.rgb, smoothstep(0.35, 0.8, vTang));\n'
      + ' diffuseColor *= sampledDiffuseColor;\n#endif');
  };
  mat.customProgramCacheKey = () => 'chibi-hair-v1';
}

export function toonFrom(m) {
  // keep the texture as loaded (colorSpace/flipY) and its baseColorFactor as tint (body factor is white)
  const mat = new THREE.MeshToonMaterial({ map: m.map || null, color: m.color, gradientMap: ramp });
  mat.name = m.name;
  return mat;
}

/* ================= spring bones (hair physics, VRM 0.x style verlet) =================
 * cfg = { chains: [{ root, stiffness, drag, gravity, hitRadius }], colliders: [{ bone, center:[x,y,z] (bind space), radius }] }
 * Each joint keeps a tail point that is integrated with inertia (1-drag), a pull back toward its rest
 * direction (stiffness) and gravity; the tail is kept at bone length and pushed out of the collider spheres,
 * then the bone is rotated to aim at it. Runs after the animation mixer every frame. */
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
class SpringBones {
  constructor(cfg, bones, skeleton, root) {
    // the hair is simulated in a frame that moves with the character root, so uneven frame deltas can
    // no longer make the tails tremble while moving. Motion is fed back as forces instead:
    // AIR = head wind proportional to the speed (tails stream back while running), INERTIA = kick when
    // speeding up / stopping / turning.
    this.root = root || null;
    this.rootPos = null; this.rootVel = new THREE.Vector3(); this.wind = new THREE.Vector3();
    this.colliders = [];
    for (const c of cfg.colliders || []) {
      const b = bones.get(c.bone); if (!b) continue;
      const i = skeleton ? skeleton.bones.indexOf(b) : -1;
      const local = new THREE.Vector3(...c.center);
      if (i >= 0) local.applyMatrix4(skeleton.boneInverses[i]);           // bind space -> bone local
      this.colliders.push({ bone: b, local, radius: c.radius, world: new THREE.Vector3() });
    }
    this.joints = [];
    for (const ch of cfg.chains || []) {
      const root = bones.get(ch.root); if (!root) continue;
      const walk = b => {
        const kid = b.children.find(k => k.isBone);
        if (!kid) return;
        b.updateMatrixWorld(true);
        const tail = kid.getWorldPosition(new THREE.Vector3());
        this.joints.push({ bone: b, rest: b.quaternion.clone(), axis: kid.position.clone().normalize(),
          len: kid.getWorldPosition(_v1).distanceTo(b.getWorldPosition(_v2)), cur: tail.clone(), prev: tail.clone(),
          stiff: ch.stiffness, drag: ch.drag, grav: ch.gravity, hit: ch.hitRadius });
        walk(kid);
      };
      walk(root);
    }
  }
  update(dt) {
    if (!this.joints.length) return;
    if (this.root && dt > 0) {
      const p = this.root.getWorldPosition(_v1);
      if (this.rootPos) {
        const move = _v2.copy(p).sub(this.rootPos);
        const vel = _v3.copy(move).divideScalar(dt);
        const kick = vel.clone().sub(this.rootVel).multiplyScalar(SpringBones.INERTIA * Math.min(dt, 0.1));
        kick.y = 0;   // jumps are already strong; keep the kick horizontal
        for (const j of this.joints) { j.cur.add(move); j.prev.add(move).add(kick); }
        this.rootVel.copy(vel);
        this.wind.set(-vel.x, 0, -vel.z).clampLength(0, SpringBones.AIR_MAX_SPEED).multiplyScalar(SpringBones.AIR);
      }
      this.rootPos = (this.rootPos || new THREE.Vector3()).copy(p);
    }
    // fixed 1/120 s steps (verlet needs a constant step) + interpolation of the leftover time
    this.acc = Math.min((this.acc || 0) + dt, 0.1);
    while (this.acc >= SpringBones.H) { this._step(SpringBones.H); this.acc -= SpringBones.H; }
    const a = this.acc / SpringBones.H;
    for (const j of this.joints) this._aim(j, _v2.copy(j.prev).lerp(j.cur, a));
  }
  _aim(j, tail) {
    const b = j.bone, wp = b.getWorldPosition(_v1);
    b.parent.getWorldQuaternion(_q1);
    const to = _v3.copy(tail).sub(wp).applyQuaternion(_q2.copy(_q1).invert()).normalize();
    b.quaternion.setFromUnitVectors(_v1.copy(j.axis).applyQuaternion(j.rest), to).multiply(j.rest);
    b.updateMatrixWorld(true);
  }
  static H = 1 / 120;
  static INERTIA = 1.0;   // how strongly a change of the character's speed swings the hair
  static AIR = 0.55;      // head wind per unit of speed
  static AIR_MAX_SPEED = 3.5;   // faster than this streams no further (game runs faster than the viewer)
  _step(dt) {
    for (const c of this.colliders) { c.bone.updateWorldMatrix(true, false); c.world.copy(c.local).applyMatrix4(c.bone.matrixWorld); }
    for (const j of this.joints) {
      const b = j.bone, wp = b.getWorldPosition(_v1);
      b.parent.getWorldQuaternion(_q1);
      // verlet: inertia + stiffness toward the rest direction + gravity
      const next = _v2.copy(j.cur).sub(j.prev).multiplyScalar(1 - j.drag).add(j.cur);
      next.addScaledVector(_v3.copy(j.axis).applyQuaternion(j.rest).applyQuaternion(_q1), j.stiff * dt);
      next.y -= j.grav * dt;
      next.addScaledVector(this.wind, dt);
      next.sub(wp).normalize().multiplyScalar(j.len).add(wp);
      for (const c of this.colliders) {
        const r = c.radius + j.hit, d = _v3.copy(next).sub(c.world), l = d.length();
        if (l < r && l > 1e-6) { next.copy(c.world).addScaledVector(d, r / l); next.sub(wp).normalize().multiplyScalar(j.len).add(wp); }
      }
      j.prev.copy(j.cur); j.cur.copy(next);
      // aim the bone at the new tail (in parent space)
      const to = _v3.copy(next).sub(wp).applyQuaternion(_q2.copy(_q1).invert()).normalize();
      const from = _v1.copy(j.axis).applyQuaternion(j.rest);
      b.quaternion.setFromUnitVectors(from, to).multiply(j.rest);
      b.updateMatrixWorld(true);
    }
  }
}

/* ================= part GLB cache ================= */
/** prefix for chibi.glb / faces/ / parts/ / thumbs/ (the game serves them from /chibi/) */
export const ASSET_BASE = { url: '' };
const loader = new GLTFLoader();
const ASSET_V = Date.now();   // always fetch fresh GLBs (parts are edited often)
const faceTexCache = new Map();   // faces/<name>.jpg -> Promise<Texture>
/** 얼굴 텍스처 (몸 UV: flipY=false) — 한 번 받은 건 다시 씀 */
function loadFaceTex(name) {
  if (!faceTexCache.has(name)) {
    const isMask = name.endsWith('_iris');   // 마스크는 png·색 공간 변환 없음
    const p = new THREE.TextureLoader().loadAsync(`${ASSET_BASE.url}faces/${name}.${isMask ? 'png' : 'jpg'}?v=${ASSET_V}`).then(t => {
      t.flipY = false; t.anisotropy = 8;
      if (!isMask) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
    p.catch(() => faceTexCache.delete(name));
    faceTexCache.set(name, p);
  }
  return faceTexCache.get(name);
}
const partCache = new Map();
/** sRGB hex of each part's recolourable material, filled when the part is loaded */
export const partDefaultColor = {};

export function loadPart(id) {
  if (!PART_IDS.has(id)) return Promise.reject(new Error('unknown part ' + id));
  if (!partCache.has(id)) {
    const p = loader.loadAsync(`${ASSET_BASE.url}parts/${id}.glb?v=${ASSET_V}`).then(gltf => {
      const want = RECOLOR_MAT[partCategory(id)];
      gltf.scene.traverse(o => {
        if (o.isSkinnedMesh && o.material.name === want && !partDefaultColor[id])
          partDefaultColor[id] = '#' + o.material.color.getHexString(THREE.SRGBColorSpace);
      });
      return gltf;
    });
    p.catch(() => partCache.delete(id));   // allow retry
    partCache.set(id, p);
  }
  return partCache.get(id);
}

/* ================= skin / eye recolour shader =================
 * Face is baked into the body texture (4096², flipY=false => uv*4096 == image px).
 * Done per fragment so it applies to every face map (open / closed / expression).
 *  - skin: multiply by target/base ratio. Outside the eye mask (G) every pixel is multiplied
 *    (brows/mouth/blush keep relative shade); inside it only skin-like pixels are touched.
 *  - eyes: inside the face's iris mask (faces/<id>_iris.png R), saturated non-skin pixels get the target hue with
 *    scaled saturation/value. Disabled while the closed map is shown. */
const RECOLOR_GLSL = /* glsl */`
uniform vec3 uSkinRatio; uniform vec3 uEyeHSV; uniform float uEyeOn; uniform float uIrisOn; uniform sampler2D uIrisMask;
vec3 czToS(vec3 c){ return pow(max(c, vec3(0.0)), vec3(1.0/2.2)); }
vec3 czToL(vec3 c){ return pow(max(c, vec3(0.0)), vec3(2.2)); }
vec3 czRgb2hsv(vec3 c){
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y); float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0*d + e)), d / (q.x + e), q.x);
}
vec3 czHsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 czRecolor(vec3 lin, vec2 uv){
  vec3 s = czToS(lin);
  vec2 eyeMask = texture2D(uIrisMask, uv).rg;
  float eyeBox = eyeMask.g;
  float dSkin = distance(s, vec3(${SKIN_BASE.map(v => (v / 255).toFixed(4)).join(',')}));
  float wSkin = mix(1.0, 1.0 - smoothstep(0.16, 0.32, dSkin), eyeBox);
  vec3 o = mix(s, clamp(s * uSkinRatio, 0.0, 1.0), wSkin);
  float iris = eyeMask.r;
  float wI = iris * uIrisOn * uEyeOn;
  if (wI > 0.0) {
    vec3 h = czRgb2hsv(s);
    wI *= smoothstep(0.18, 0.32, h.y) * smoothstep(0.14, 0.26, dSkin);
    vec3 nh = vec3(uEyeHSV.x, clamp(h.y * uEyeHSV.y, 0.0, 1.0), clamp(h.z * uEyeHSV.z, 0.0, 1.0));
    o = mix(o, czHsv2rgb(nh), wI);
  }
  return czToL(o);
}
`;
/* ================= 손톱 =================
 * 손에 메시를 따로 붙이지 않고 피부 셰이더에서 그림 (피부색 바뀌면 같이 바뀜, 모양이 메시 결과 상관없이 매끈).
 * build_hands.py가 잰 끝마디 축(몸 extras "nails")을 따라, 손등 쪽 각도·길이로 타원 → 살짝 밝고 분홍빛, 가장자리는 아주 조금 어둡게. */
const NAIL_N = 10;
const NAIL_GLSL = /* glsl */`
uniform vec4 uNailP[${NAIL_N}]; uniform vec4 uNailU[${NAIL_N}]; uniform vec4 uNailN[${NAIL_N}];
vec3 czNail(vec3 col, vec3 p){
  float w = 0.0, rim = 0.0;
  for (int i = 0; i < ${NAIL_N}; i++) {
    vec3 d = p - uNailP[i].xyz; float L = uNailP[i].w;
    float a = dot(d, uNailU[i].xyz);
    vec3 r = d - a * uNailU[i].xyz; float rl = length(r);
    if (L <= 0.0 || a < 0.0 || a > L * 1.8 || rl > uNailU[i].w || rl < 1e-5) continue;
    float ang = acos(clamp(dot(r / rl, uNailN[i].xyz), -1.0, 1.0));
    float x = (a - L * uNailN[i].w) / (L * 0.38), y = ang / 0.75;
    float e = x * x + y * y;
    float wi = 1.0 - smoothstep(0.82, 1.0, e);
    w = max(w, wi); rim = max(rim, wi * smoothstep(0.55, 0.9, e));
  }
  return mix(col, col * vec3(1.03, 0.99, 0.99) + vec3(0.03, 0.025, 0.025), w * (1.0 - 0.6 * rim)) * (1.0 - 0.05 * rim);
}
`;
function rgb2hsv([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h / 6) + 1) % 1, mx ? d / mx : 0, mx];
}

/* ================= Character ================= */
export class Character {
  /** Loads chibi.glb and returns a Character (no parts attached yet; call applyState). */
  static async load(url = ASSET_BASE.url + 'chibi.glb') {
    const gltf = await loader.loadAsync(url + (url.includes('?') ? '' : `?v=${ASSET_V}`));
    return new Character(gltf);
  }

  constructor(gltf) {
    this.root = gltf.scene;
    this.animations = gltf.animations;
    this.uniforms = {
      uSkinRatio: { value: new THREE.Vector3(1, 1, 1) },
      uEyeHSV: { value: new THREE.Vector3(0, 1, 1) },
      uEyeOn: { value: 0 },
      uIrisOn: { value: 1 },
      uIrisMask: { value: Object.assign(new THREE.DataTexture(new Uint8Array(4), 1, 1), { needsUpdate: true }) },   // 얼굴 고르기 전엔 눈 색 바꾸기 없음
      // scalp paint under hair styles that don't fully cover the big chibi skull: rgb = colour, w = on
      uScalp: { value: new THREE.Vector4(0, 0, 0, 0) },
      // hide body skin that is covered by clothing (bind-space: y up). x=lo y, y=hi y, z=max |x|, w=on
      uHideA: { value: new THREE.Vector4(0, 0, 0, 0) },   // bottom
      uHideB: { value: new THREE.Vector4(0, 0, 0, 0) },   // top
      uHideC: { value: new THREE.Vector4(0, 0, 0, 0) },   // 소매 속 팔: x=|x| 시작, y=|x| 끝, z=아래 y, w=on (위 y는 1.48)
      uNailP: { value: Array.from({ length: NAIL_N }, () => new THREE.Vector4()) },   // 끝마디 밑동 가운데 xyz, 손끝까지 길이(0 = 없음)
      uNailU: { value: Array.from({ length: NAIL_N }, () => new THREE.Vector4()) },   // 손끝 방향, 손가락 반지름 한계
      uNailN: { value: Array.from({ length: NAIL_N }, () => new THREE.Vector4()) },   // 손톱 쪽 방향, 손톱 가운데 위치(길이 비율)
    };
    this.bodyLineMat = outlineMat.clone();
    this._installHide(this.bodyLineMat, true);
    this.faceMat = null; this.openMap = null; this.closedMap = null; this.blinkT = 2.5;
    this.faceId = null; this.exprMap = null; this.exprT = 0;   // 지금 얼굴 외형, 표정 텍스처·남은 시간(초)
    this.bones = new Map();
    this.attachParent = this.root;
    this.slots = {};          // cat -> { id, meshes: [{ mesh, line }] } (line: hair outline, else null)
    this.partIds = { hair: null, top: null, bottom: null, shoes: null };
    this.colors = { hair: null, top: null, bottom: null, shoes: null };
    this._token = { hair: 0, top: 0, bottom: 0, shoes: 0 };
    // layering: the part of the bottom that is covered by the top (above the top's hem) is pulled
    // slightly inward so long tops don't z-fight / intersect with wide bottoms (skirt).
    this.layerU = { uShrinkY: { value: 1e3 }, uShrink: { value: 0.15 }, uLayerC: { value: new THREE.Vector2(0, 0) } };

    this.root.traverse(o => { if (o.isBone) this.bones.set(o.name, o); });
    this.extraBones = {};   // cat -> bones a part added to the skeleton (hair joints)
    this.springs = {};      // cat -> SpringBones
    const skinned = [];
    this.root.traverse(o => { if (o.isSkinnedMesh) skinned.push(o); });
    this.mainSkeleton = skinned.length ? skinned[0].skeleton : null;
    for (const o of skinned) {
      if (LEGACY_MESHES.has(o.name)) { o.removeFromParent(); continue; }   // replaced by parts
      o.castShadow = true;
      const mat = toonFrom(o.material);
      o.material = mat;
      if (mat.map) {
        this.faceMat = mat; this.openMap = mat.map; this.attachParent = o.parent;
        this._installRecolor(mat);
        this._initNails(o);
      }
      const line = new THREE.SkinnedMesh(o.geometry, mat.map ? this.bodyLineMat : outlineMat);
      line.bind(o.skeleton, o.bindMatrix);
      o.parent.add(line);
    }
  }

  // GLSL: paint the back of the skull (behind the ears, above a jagged nape line) in a shaded hair colour.
  // bind space: y up, -z = back of the head.
  static SCALP_GLSL = `
 if (uScalp.w > 0.5) {
   float az = atan(vRest.x, -vRest.z);
   float edge = 1.505 + 0.035 * abs(sin(az * 7.0)) + 0.06 * smoothstep(0.0, 1.2, abs(az));
   // hairline: nape edge at the back, rising to the crown-front at the forehead/temples
   float hl = mix(2.16, edge, smoothstep(-0.25, 0.10, -vRest.z));
   float w = smoothstep(hl - 0.008, hl + 0.008, vRest.y)
           * (1.0 - smoothstep(0.36, 0.40, abs(vRest.x)) * (1.0 - smoothstep(1.78, 1.82, vRest.y)));
   diffuseColor.rgb = mix(diffuseColor.rgb, uScalp.rgb, w);
 }`;

  // GLSL: discard body fragments inside the clothing-covered boxes
  static HIDE_VS = ['varying vec3 vRest;\n', '#include <begin_vertex>\n vRest = position;'];
  static HIDE_FS = 'varying vec3 vRest; uniform vec4 uHideA; uniform vec4 uHideB; uniform vec4 uHideC;\n';
  static HIDE_DISCARD = '\n if (uHideA.w > 0.5 && vRest.y > uHideA.x && vRest.y < uHideA.y && abs(vRest.x) < uHideA.z) discard;'
    + '\n if (uHideB.w > 0.5 && vRest.y > uHideB.x && vRest.y < uHideB.y && abs(vRest.x) < uHideB.z) discard;'
    + '\n if (uHideC.w > 0.5 && abs(vRest.x) > uHideC.x && abs(vRest.x) < uHideC.y && vRest.y > uHideC.z && vRest.y < 1.48) discard;';
  _hideShader(s) {
    s.uniforms.uHideA = this.uniforms.uHideA; s.uniforms.uHideB = this.uniforms.uHideB; s.uniforms.uHideC = this.uniforms.uHideC;
    s.vertexShader = Character.HIDE_VS[0] + s.vertexShader.replace('#include <begin_vertex>', Character.HIDE_VS[1]);
    s.fragmentShader = Character.HIDE_FS + s.fragmentShader.replace('#include <clipping_planes_fragment>',
      '#include <clipping_planes_fragment>' + Character.HIDE_DISCARD);
  }
  _installHide(mat, outline) {
    mat.onBeforeCompile = s => {
      this._hideShader(s);
      if (outline) s.vertexShader = s.vertexShader.replace('#include <skinning_vertex>',
        '#include <skinning_vertex>\n transformed += normalize(objectNormal) * 0.012;');
    };
    mat.customProgramCacheKey = () => outline ? 'chibi-hide-outline-v2' : 'chibi-hide-v2';
  }
  _updateHide() {
    const B = { bottom_shorts: [0.53, 0.80, 0.40], bottom_pants: [0.19, 0.80, 0.40] }[this.partIds.bottom];
    const A = this.uniforms.uHideA.value, T = this.uniforms.uHideB.value;
    if (B && this.slots.bottom) A.set(B[0], B[1], B[2], 1); else A.set(0, 0, 0, 0);
    // 상의 밑단(크롭티처럼 짧은 옷)보다 아래 몸은 숨기지 않음
    // 민소매는 진동둘레로 옆구리·겨드랑이가 보여서 숨기는 폭을 좁힘 (안 그러면 구멍이 뚫려 보임)
    const sleeveless = this.slots.top && this._topSleeveX() < 0.38;
    if (this.partIds.top && this.slots.top) T.set(Math.max(0.86, this._topHemY() + 0.05), 1.30, sleeveless ? 0.19 : 0.30, 1); else T.set(0, 0, 0, 0);
    // 소매 속 팔 피부도 숨김 (팔을 크게 굽히면 소매 밖으로 살이 비침). 민소매(소매 끝 < 0.38)는 어깨가 보여서 뺌
    const C = this.uniforms.uHideC.value, sx = this.slots.top ? this._topSleeveX() : 0;
    if (sx > 0.38) C.set(0.29, sx - 0.035, 1.10, 1); else C.set(0, 0, 0, 0);
  }

  _topSleeveX() {   // bind-space |x| of the sleeve end (T-pose arms along x)
    let mx = 0;
    for (const { mesh } of (this.slots.top ? this.slots.top.meshes : [])) {
      const g = mesh.geometry; if (!g.boundingBox) g.computeBoundingBox();
      mx = Math.max(mx, g.boundingBox.max.x, -g.boundingBox.min.x);
    }
    return mx;
  }

  _topHemY() {   // bind-space Y of the top's hem (parts share the body's rest pose, Y up)
    let minY = Infinity;
    for (const { mesh } of (this.slots.top ? this.slots.top.meshes : [])) {
      const g = mesh.geometry; if (!g.boundingBox) g.computeBoundingBox();
      minY = Math.min(minY, g.boundingBox.min.y);
    }
    return minY;
  }

  _installLayer(mat) {
    const U = this.layerU;
    mat.onBeforeCompile = s => {
      Object.assign(s.uniforms, U);
      // radial (not along normal: parts are solidified shells with inward-facing inner walls)
      s.vertexShader = 'uniform float uShrinkY; uniform float uShrink; uniform vec2 uLayerC;\n' + s.vertexShader
        .replace('#include <begin_vertex>',
          '#include <begin_vertex>\n transformed.xz = uLayerC + (transformed.xz - uLayerC) * (1.0 - uShrink * smoothstep(uShrinkY, uShrinkY + 0.03, position.y));');
    };
    mat.customProgramCacheKey = () => 'chibi-layer';
  }

  _updateLayer() {
    const minY = this._topHemY();
    this.layerU.uShrinkY.value = Number.isFinite(minY) ? minY - 0.02 : 1e3;
  }

  /** 손톱 자리: 끝마디 뼈의 bind 자세(몸 메시 좌표 = 셰이더 vRest) 위치·방향 */
  _initNails(mesh) {
    let o = mesh, list = null;
    while (o && !list) { if (o.userData && o.userData.nails) list = JSON.parse(o.userData.nails); o = o.parent; }
    if (!list) return;
    const U = this.uniforms;
    list.slice(0, NAIL_N).forEach((m, i) => {
      U.uNailP.value[i].set(...m.p, m.L);
      U.uNailU.value[i].set(...m.u, m.r);
      U.uNailN.value[i].set(...m.n, 0.48);
    });
  }

  _installRecolor(mat) {
    const U = this.uniforms;
    mat.onBeforeCompile = s => {
      Object.assign(s.uniforms, U);
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec4 uScalp;\n' + RECOLOR_GLSL + NAIL_GLSL)
        .replace('#include <map_fragment>', '#include <map_fragment>\n#ifdef USE_MAP\n diffuseColor.rgb = czRecolor(diffuseColor.rgb, vMapUv);\n#endif\n diffuseColor.rgb = czNail(diffuseColor.rgb, vRest);\n' + Character.SCALP_GLSL);
      this._hideShader(s);
    };
    mat.customProgramCacheKey = () => 'chibi-recolor-v6';
  }

  /* ---------- parts ---------- */
  /** Attach part `id` (or null = none) to category `cat`. Latest call per category wins. */
  async setPart(cat, id) {
    const tok = ++this._token[cat];
    this.partIds[cat] = id;
    if (!id) { this._clear(cat); return; }
    let gltf;
    try { gltf = await loadPart(id); }
    catch (e) { console.warn('파츠 로드 실패:', id, e); if (tok === this._token[cat]) this._clear(cat); return; }
    const item = PART_CATALOG[cat] && PART_CATALOG[cat].find(p => p.id === id);
    let springCfg = null;
    if (item && item.spring) {
      try { springCfg = await (await fetch(`${ASSET_BASE.url}parts/${id}.spring.json?v=${ASSET_V}`)).json(); }
      catch (e) { console.warn('스프링 설정 로드 실패:', id, e); }
    }
    if (tok !== this._token[cat]) return;      // superseded
    this._clear(cat);
    this._addPartBones(gltf.scene, cat);
    const meshes = [];
    gltf.scene.traverse(src => {
      if (!src.isSkinnedMesh) return;
      // rebuild the part skeleton out of the MAIN character's bones (same order as the part)
      const bones = src.skeleton.bones.map(b => this.bones.get(b.name));
      if (bones.some(b => !b)) { console.warn('본 이름 불일치:', id); return; }
      const skel = new THREE.Skeleton(bones, src.skeleton.boneInverses.map(m => m.clone()));
      const mat = toonFrom(src.material);
      mat.side = src.material.side;   // parts are authored double-sided (thin pocket/hem/skirt shells)
      mat.userData.base = mat.color.clone();
      mat.userData.recolor = src.material.name === RECOLOR_MAT[cat];
      if (cat === 'hair' && src.geometry.attributes.color) installHairShader(mat);   // cylindrical-UV hair only
      if (cat === 'bottom') {
        this._installLayer(mat);
        if (!src.geometry.boundingBox) src.geometry.computeBoundingBox();
        const bb = src.geometry.boundingBox;
        this.layerU.uLayerC.value.set((bb.min.x + bb.max.x) / 2, (bb.min.z + bb.max.z) / 2);
      }
      const mesh = new THREE.SkinnedMesh(src.geometry, mat);
      mesh.name = src.name; mesh.castShadow = true; mesh.frustumCulled = false;
      mesh.bind(skel, src.bindMatrix.clone());
      this.attachParent.add(mesh);
      // outline only for hair — on clothes/shoes the inverted hull showed through hems and openings as extra lines
      let line = null;
      if (cat === 'hair') {
        line = new THREE.SkinnedMesh(src.geometry, src.geometry.attributes.color ? hairLineMatW : hairLineMat);
        line.frustumCulled = false;
        line.bind(skel, src.bindMatrix.clone());
        this.attachParent.add(line);
      }
      meshes.push({ mesh, line });
    });
    this.slots[cat] = { id, meshes };
    if (springCfg) this.springs[cat] = new SpringBones(springCfg, this.bones, this.mainSkeleton, this.root);
    this._applyColor(cat);
    if (cat === 'top') this._updateLayer();
    this._updateHide();
  }

  /** bones of the part that the main skeleton lacks (e.g. hair joint chains) are cloned under their parent */
  _addPartBones(scene, cat) {
    const made = this.extraBones[cat] = [];
    let pending = [];
    scene.traverse(o => { if (o.isBone && !this.bones.has(o.name)) pending.push(o); });
    for (let guard = 0; pending.length && guard < 64; guard++) {
      pending = pending.filter(b => {
        const parent = b.parent && this.bones.get(b.parent.name);
        if (!parent) return true;
        const nb = new THREE.Bone(); nb.name = b.name;
        nb.position.copy(b.position); nb.quaternion.copy(b.quaternion); nb.scale.copy(b.scale);
        parent.add(nb); nb.updateMatrixWorld(true);
        this.bones.set(b.name, nb); made.push(nb);
        return false;
      });
    }
  }

  _clear(cat) {
    delete this.springs[cat];
    for (const b of this.extraBones[cat] || []) { b.removeFromParent(); this.bones.delete(b.name); }
    this.extraBones[cat] = [];
    const s = this.slots[cat];
    if (!s) return;
    for (const { mesh, line } of s.meshes) { mesh.removeFromParent(); line?.removeFromParent(); mesh.material.dispose(); }
    delete this.slots[cat];
    if (cat === 'hair') this._updateScalp();
    if (cat === 'top') this._updateLayer();
    this._updateHide();
  }

  /** hex = '#rrggbb' or null (= the part's own colour) */
  setColor(cat, hex) { this.colors[cat] = isHex(hex) ? hex.toLowerCase() : null; this._applyColor(cat); }
  _applyColor(cat) {
    const s = this.slots[cat]; if (!s) return;
    for (const { mesh } of s.meshes) {
      const m = mesh.material;
      if (!m.userData.recolor) continue;
      if (this.colors[cat]) m.color.set(this.colors[cat]); else m.color.copy(m.userData.base);
    }
    if (cat === 'hair') this._updateScalp();
  }

  _updateScalp() {
    const s = this.slots.hair, U = this.uniforms.uScalp.value;
    const item = s && PART_CATALOG.hair.find(p => p.id === s.id);
    const m = s && s.meshes.map(x => x.mesh.material).find(mm => mm.userData.recolor);
    if (!item || !item.scalp || !m) { U.w = 0; return; }
    U.set(m.color.r * 0.5, m.color.g * 0.5, m.color.b * 0.5, 1);
  }

  setSkin(hex) {
    const t = hexRgb(hex);
    this.uniforms.uSkinRatio.value.set(t[0] / SKIN_BASE[0], t[1] / SKIN_BASE[1], t[2] / SKIN_BASE[2]);
  }
  setEyes(hex) {
    const t = hexRgb(hex), base = rgb2hsv(IRIS_BASE), tgt = rgb2hsv(t);
    this.uniforms.uEyeOn.value = hex.toLowerCase() === rgbHex(IRIS_BASE) ? 0 : 1;
    this.uniforms.uEyeHSV.value.set(tgt[0], Math.max(tgt[1], 0.05) / base[1], Math.max(tgt[2], 0.12) / base[2]);
  }

  /** Apply a full (sanitized) state. Resolves when all parts are attached. */
  applyState(state) {
    const s = sanitizeState(state);
    this.setSkin(s.skin); this.setEyes(s.eyes);
    for (const c of CATEGORIES) this.colors[c] = s.colors[c];
    const face = s.face === this.faceId ? null : this.setFace(s.face);
    return Promise.all([face, ...CATEGORIES.map(c =>
      this.slots[c] && this.slots[c].id === s.parts[c] && this.partIds[c] === s.parts[c]
        ? (this._applyColor(c), null)
        : this.setPart(c, s.parts[c]))]);
  }

  /** 얼굴 외형 바꾸기 — 뜬 눈·감은 눈 텍스처 + 눈동자 위치 */
  async setFace(id) {
    const item = FACE_CATALOG.find(f => f.id === id) || FACE_CATALOG[0];
    this.faceId = item.id;
    const [open, closed, iris] = await Promise.all(['open', 'closed', 'iris'].map(k => loadFaceTex(`${item.id}_${k}`)));
    if (this.faceId !== item.id || !this.faceMat) return;   // 그사이 다른 얼굴을 골랐음
    this.openMap = open; this.closedMap = closed;
    this.faceMat.map = this.exprMap || open;
    this.uniforms.uIrisMask.value = iris;
  }

  /** 표정을 sec초 동안 보여주고 원래 얼굴로 돌아감 */
  async setExpression(id, sec = 2) {
    if (!EXPRESSION_CATALOG.some(e => e.id === id)) return;
    const tex = await loadFaceTex(`expr_${id}`);
    this.exprMap = tex; this.exprT = sec;
  }

  /** 표정(있으면) 또는 깜빡임 + 뜬 눈 텍스처일 때만 눈 색 바꾸기 */
  update(dt) {
    if (this.faceMat && this.exprMap) {
      this.exprT -= dt;
      if (this.exprT <= 0) this.exprMap = null;
      const want = this.exprMap || this.openMap;
      if (this.faceMat.map !== want) this.faceMat.map = want;
    } else if (this.faceMat && this.closedMap) {
      this.blinkT -= dt;
      const want = this.blinkT < 0.12 ? this.closedMap : this.openMap;
      if (this.faceMat.map !== want) this.faceMat.map = want;
      if (this.blinkT < 0) this.blinkT = 2 + Math.random() * 3;
    }
    this.uniforms.uIrisOn.value = this.faceMat && this.faceMat.map === this.openMap ? 1 : 0;
    for (const k in this.springs) this.springs[k].update(dt);
  }
}

export { clone as cloneState };
