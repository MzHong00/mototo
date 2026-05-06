import { useEffect } from "react";

import { useToast } from "@/hooks/useToast";

import type React from "react";

import s from "./Toast.module.scss";

const TOAST_TTL_MS = 3000;

export function Toast() {
  const { toasts, remove } = useToast();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => remove(toasts[0].id), TOAST_TTL_MS);
    return () => clearTimeout(timer);
  }, [toasts, remove]);

  if (toasts.length === 0) return null;

  return (
    <div className={s.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${s.toast} ${s[t.type]}`}
          style={{ "--ttl": `${TOAST_TTL_MS - 300}ms` } as React.CSSProperties}
          onClick={() => remove(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
