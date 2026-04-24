import s from "./death-screen.module.scss";

interface DeathScreenProps {
  onRespawn: () => void;
}

export function DeathScreen({ onRespawn }: DeathScreenProps) {
  return (
    <div className={s.overlay}>
      <div className={s.title}>쓰러졌습니다</div>
      <div className={s.subtitle}>몬스터에게 처치당했습니다</div>
      <button onClick={onRespawn} className={s.btn}>
        부활하기
      </button>
    </div>
  );
}
