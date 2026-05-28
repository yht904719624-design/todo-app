import { useEffect } from 'react';
import styles from './Toast.module.css';

interface Props {
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, undoLabel = '撤销', onUndo, onDismiss, duration = 3000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.toast}>
        <span className={styles.message}>{message}</span>
        {onUndo && (
          <button
            className={styles.undoBtn}
            onClick={() => {
              onUndo();
              onDismiss();
            }}
            aria-label={undoLabel}
          >
            {undoLabel}
          </button>
        )}
      </div>
    </div>
  );
}
