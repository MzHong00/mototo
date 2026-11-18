// 타입 선언 — character.js 는 chibi-pipeline/web/character.js 원본 사본 (scripts/sync_game.sh 로 동기화, 직접 수정 금지)
import type * as THREE from "three";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";

export type PartCategory = "hair" | "top" | "bottom" | "shoes";
export type Gender = "female" | "male";

export interface PartItem {
  id: string;
  label: string;
  scalp?: boolean;
  spring?: boolean;
  gender?: Gender;
}

export interface FaceItem {
  id: string;
  label: string;
  thumb: string;
}

export interface ExpressionItem {
  id: string;
  label: string;
}

export interface ChibiState {
  v: number;
  gender: Gender;
  parts: Record<PartCategory, string | null>;
  face: string;
  colors: Record<PartCategory, string | null>;
  skin: string;
  eyes: string;
}

export const ASSET_BASE: { url: string };
export const SKIN_BASE: [number, number, number];
export const IRIS_BASE: [number, number, number];
export const CATEGORIES: PartCategory[];
export const CATEGORY_LABEL: Record<PartCategory, string>;
export const PART_CATALOG: Record<PartCategory, PartItem[]>;
export const FACE_CATALOG: FaceItem[];
export const EXPRESSION_CATALOG: ExpressionItem[];
export const GENDERS: { id: Gender; label: string }[];
export const DEFAULT_HAIR: Record<Gender, string>;
export const NONE_LABEL: Record<PartCategory, string>;
export const DEFAULT_PARTS: Record<PartCategory, string | null>;
export const partDefaultColor: Record<string, string>;
export const outlineMat: THREE.Material;

export function partFits(item: PartItem, gender: Gender): boolean;
export function partCategory(id: string): PartCategory | null;
export function isHex(v: unknown): v is string;
export function rgbHex(a: number[]): string;
export function defaultState(gender?: Gender): ChibiState;
export function sanitizeState(s: unknown): ChibiState;
export function cloneState(s: ChibiState): ChibiState;
export function loadPart(id: string): Promise<GLTF>;
export function toonFrom(m: THREE.Material): THREE.Material;

export class Character {
  static load(url?: string): Promise<Character>;
  root: THREE.Group;
  animations: THREE.AnimationClip[];
  setPart(cat: PartCategory, id: string | null): Promise<void>;
  setColor(cat: PartCategory, hex: string | null): void;
  setSkin(hex: string): void;
  setEyes(hex: string): void;
  applyState(state: ChibiState): Promise<unknown>;
  setFace(id: string): Promise<void>;
  /** sec초 동안 표정을 보여주고 원래 얼굴로 돌아감 */
  setExpression(id: string, sec?: number): Promise<void>;
  /** 눈 깜빡임 + 머리 흔들림 — mixer.update 이후 매 프레임 호출 */
  update(dt: number): void;
}
