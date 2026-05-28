import { useTodos } from '../../hooks/useTodos';
import styles from './BatchBar.module.css';

export function BatchBar() {
  const { state, dispatch } = useTodos();
  const count = state.selectedIds.length;

  if (count === 0) return null;

  return (
    <div className={styles.bar}>
      <span className={styles.info}>已选择 {count} 项</span>
      <div className={styles.actions}>
        <button
          className={styles.completeBtn}
          onClick={() =>
            dispatch({ type: 'BATCH_COMPLETE', payload: { ids: state.selectedIds } })
          }
        >
          标记完成
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() =>
            dispatch({ type: 'BATCH_DELETE', payload: { ids: state.selectedIds } })
          }
        >
          删除
        </button>
        <button
          className={styles.cancelBtn}
          onClick={() => dispatch({ type: 'DESELECT_ALL' })}
        >
          取消选择
        </button>
      </div>
    </div>
  );
}
