import { useState, useRef, useEffect, useCallback } from 'react';
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
  { value: 'custom', label: '自定义' },
];

export function FilterBar() {
  const { state, dispatch } = useTodos();
  const [localQuery, setLocalQuery] = useState(state.searchQuery);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedDispatch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: { searchQuery: value } });
      }, 200);
    },
    [dispatch],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleSearchChange(value: string) {
    setLocalQuery(value);
    debouncedDispatch(value);
  }

  return (
    <div className={styles.bar}>
      <input
        ref={searchRef}
        className={styles.searchInput}
        type="text"
        placeholder="搜索任务... (Ctrl+K)"
        value={localQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

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
