import { useRef } from "react";

import { useControlsStore } from "@/stores/controlsStore";
import { useDraggable } from "@/hooks/useDraggable";
import { ACTION_LABELS, getKeyDisplay } from "@/constants/controls";

import type { ActionKey } from "@/stores/controlsStore";

import styles from "./KeySettings.module.scss";

interface KeySettingsProps {
  onClose: () => void;
}

export function KeySettings({ onClose }: KeySettingsProps) {
  const bindings = useControlsStore((s) => s.bindings);
  const swap = useControlsStore((s) => s.swap);
  const reset = useControlsStore((s) => s.reset);
  const dragSource = useRef<ActionKey | null>(null);
  const { pos, onHeaderMouseDown } = useDraggable(Math.max(0, window.innerWidth / 2 - 200), 80);

  const actions = Object.keys(ACTION_LABELS) as ActionKey[];

  return (
    <div className={styles.panel} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.header} onMouseDown={onHeaderMouseDown}>
        <span className={styles.title}>키 설정</span>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.hint}>키 배지를 드래그해서 다른 액션에 드롭하면 키가 교환됩니다.</p>

        <div className={styles.list}>
          {actions.map((action) => (
            <div key={action} className={styles.row}>
              <span className={styles.label}>{ACTION_LABELS[action]}</span>
              <div
                className={styles.keyBadge}
                draggable
                onDragStart={() => {
                  dragSource.current = action;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragSource.current && dragSource.current !== action) {
                    swap(dragSource.current, action);
                  }
                  dragSource.current = null;
                }}
              >
                {getKeyDisplay(bindings[action])}
              </div>
            </div>
          ))}
        </div>

        <button className={styles.resetBtn} onClick={reset}>
          기본값으로 초기화
        </button>
      </div>
    </div>
  );
}
