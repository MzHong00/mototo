import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { playerPosition } from "@/game/worldState";

const CAM_MIN = 6;
const CAM_MAX = 28;
const CAM_YAW = 0;
const CAM_PITCH = 0.75;

/** 플레이어를 따라다니는 3인칭 카메라. 휠로 줌 조절 가능 */
export function FollowCamera() {
  const { camera, gl } = useThree();
  const dist = useRef(14);

  useEffect(() => {
    const canvas = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? 200 : 1;
      dist.current = Math.max(CAM_MIN, Math.min(CAM_MAX, dist.current + e.deltaY * scale * 0.01));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [gl]);

  useFrame(() => {
    const { x, y, z } = playerPosition.current;
    const d = dist.current;
    const cosP = Math.cos(CAM_PITCH);
    camera.position.set(
      x + Math.sin(CAM_YAW) * cosP * d,
      y + Math.sin(CAM_PITCH) * d,
      z + Math.cos(CAM_YAW) * cosP * d,
    );
    camera.lookAt(x, y + 1, z);
  }, -1);

  return null;
}
