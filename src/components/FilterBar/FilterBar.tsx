import type { FilterStatus, PriorityFilter, SortBy } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import styles from './FilterBar.module.css';

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' },
];

const priorityOptions: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'createdAt', label: '创建时间' },
  { value: 'dueDate', label: '截止日期' },
  { value: 'priority', label: '优先级' },
];

export function FilterBar() {
  const { state, dispatch } = useTodos();

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.btn} ${state.filterStatus === opt.value ? styles.active : ''}`}
            onClick={() =>
              dispatch({ type: 'SET_FILTER_STATUS', payload: { filterStatus: opt.value } })
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={styles.group}>
        {priorityOptions.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.btn} ${state.filterPriority === opt.value ? styles.active : ''}`}
            onClick={() =>
              dispatch({
                type: 'SET_FILTER_PRIORITY',
                payload: { filterPriority: opt.value },
              })
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      <select
        className={styles.sortSelect}
        value={state.sortBy}
        onChange={(e) =>
          dispatch({
            type: 'SET_SORT_BY',
            payload: { sortBy: e.target.value as SortBy },
          })
        }
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
