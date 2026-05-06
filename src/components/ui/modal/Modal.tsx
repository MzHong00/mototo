import { useModal } from "@/hooks/useModal";

import s from "./Modal.module.scss";

const DEFAULT_CONFIRM = "확인";
const DEFAULT_CANCEL = "취소";

export function Modal() {
  const { modal, close } = useModal();

  if (!modal) return null;

  const handleConfirm = () => modal.onConfirm();
  const handleCancel = () => {
    modal.onCancel?.();
    close();
  };

  return (
    <div className={s.overlay} onClick={handleCancel}>
      <div className={s.panel} onClick={(e) => e.stopPropagation()}>
        <div className={s.title}>{modal.title}</div>
        {modal.subtitle && <div className={s.subtitle}>{modal.subtitle}</div>}
        <div className={s.actions}>
          <button className={s.confirmBtn} onClick={handleConfirm}>
            {modal.confirmLabel ?? DEFAULT_CONFIRM}
          </button>
          <button className={s.cancelBtn} onClick={handleCancel}>
            {modal.cancelLabel ?? DEFAULT_CANCEL}
          </button>
        </div>
      </div>
    </div>
  );
}
