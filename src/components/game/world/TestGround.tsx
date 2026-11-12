import { CuboidCollider, RigidBody } from "@react-three/rapier";

// Three.js 재질은 CSS 변수 미지원 — 치비 뷰어 바닥색과 동일
const GROUND_COLOR = "#9fd18b";
const GRID_MAIN = "#6fa85e";
const GRID_SUB = "#86bf74";
const GROUND_SIZE = 200; // 바닥 한 변 길이
const GRID_DIVISIONS = 100;

/** 임시 테스트 바닥 — 첫 마을을 만들기 전까지 사용 */
export function TestGround() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[GROUND_SIZE / 2, 0.1, GROUND_SIZE / 2]} position={[0, -0.1, 0]} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshStandardMaterial color={GROUND_COLOR} />
      </mesh>
      <gridHelper
        args={[GROUND_SIZE, GRID_DIVISIONS, GRID_MAIN, GRID_SUB]}
        position={[0, 0.005, 0]}
      />
    </RigidBody>
  );
}
