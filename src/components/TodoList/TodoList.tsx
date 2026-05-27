import { useMemo } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { filterTodos, sortTodos } from '../../utils/helpers';
import { TodoItem } from '../TodoItem/TodoItem';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './TodoList.module.css';

export function TodoList() {
  const { state } = useTodos();

  const visibleTodos = useMemo(
    () => sortTodos(filterTodos(state.todos, state.filterStatus, state.filterPriority), state.sortBy),
    [state.todos, state.filterStatus, state.filterPriority, state.sortBy],
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
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
