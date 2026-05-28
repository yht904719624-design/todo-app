import { useMemo, useCallback, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { searchTodos, filterTodos, sortTodos } from '../../utils/helpers';
import { TodoItem } from '../TodoItem/TodoItem';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './TodoList.module.css';

export function TodoList() {
  const { state, dispatch } = useTodos();
  const [dragId, setDragId] = useState<string | null>(null);

  const visibleTodos = useMemo(
    () =>
      sortTodos(
        filterTodos(
          searchTodos(state.todos, state.searchQuery),
          state.filterStatus,
          state.filterPriority,
        ),
        state.sortBy,
        state.order,
      ),
    [state.todos, state.filterStatus, state.filterPriority, state.sortBy, state.searchQuery, state.order],
  );

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!dragId || dragId === targetId) return;
      const order = [...(state.order.length > 0 ? state.order : visibleTodos.map((t) => t.id))];
      const fromIndex = order.indexOf(dragId);
      const toIndex = order.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return;
      order.splice(fromIndex, 1);
      order.splice(toIndex, 0, dragId);
      dispatch({ type: 'REORDER_TODOS', payload: { order } });
    },
    [dragId, state.order, visibleTodos, dispatch],
  );

  if (visibleTodos.length === 0) {
    return (
      <EmptyState
        hasAnyTodos={state.todos.length > 0}
        filterStatus={state.filterStatus}
      />
    );
  }

  return (
    <div className={styles.list}>
      {visibleTodos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDragActive={dragId === todo.id}
          delay={index}
          onDragStart={() => setDragId(todo.id)}
          onDragEnd={() => setDragId(null)}
          onDrop={() => handleDrop(todo.id)}
        />
      ))}
    </div>
  );
}
