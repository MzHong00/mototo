import type { Gender } from "@/lib/chibi/character";

import s from "./GenderIcon.module.scss";

interface GenderIconProps {
  gender: Gender;
}

/** 성별 기호 (♀ 원 아래 십자 / ♂ 원 오른쪽 위 화살표) */
export function GenderIcon({ gender }: GenderIconProps) {
  return (
    <svg className={`${s.icon} ${s[gender]}`} viewBox="0 0 24 24" aria-hidden="true">
      {gender === "female" ? (
        <>
          <circle cx="12" cy="9" r="5" />
          <path d="M12 14v7M9 18h6" />
        </>
      ) : (
        <>
          <circle cx="10" cy="14" r="5" />
          <path d="M13.5 10.5 19 5M14 5h5v5" />
        </>
      )}
    </svg>
  );
}
