import { createPortal } from 'react-dom';
import styles from './ConfirmDialog.module.css';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return createPortal(
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            确定
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
