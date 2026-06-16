import s from "./GameLogo.module.scss";

interface GameLogoProps {
  size?: "sm" | "md" | "lg";
}

export function GameLogo({ size = "md" }: GameLogoProps) {
  return (
    <div className={`${s.logo} ${s[size]}`}>
      <img src="/images/logo.png" alt="" className={s.logoImg} aria-hidden="true" />
      <span className={s.logoText}>MOTOTO</span>
    </div>
  );
}
