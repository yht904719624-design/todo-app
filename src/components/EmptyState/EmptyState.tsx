import type { FilterStatus } from '../../types/todo';
import styles from './EmptyState.module.css';

interface Props {
  hasAnyTodos: boolean;
  filterStatus: FilterStatus;
}

export function EmptyState({ hasAnyTodos, filterStatus }: Props) {
  let message: string;
  if (!hasAnyTodos) {
    message = '还没有任务，在上方添加一个吧！';
  } else if (filterStatus === 'active') {
    message = '所有任务都已完成！';
  } else if (filterStatus === 'completed') {
    message = '还没有已完成的任务。';
  } else {
    message = '没有匹配的任务。';
  }

  return (
    <div className={styles.empty}>
      <div className={styles.icon}>📋</div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
