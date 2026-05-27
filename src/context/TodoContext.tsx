import { createContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { TodoState, TodoAction } from '../types/todo';
import { todoReducer, initialState } from './todoReducer';
import { loadTodos, saveTodos } from '../utils/storage';

interface TodoContextValue {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    const saved = loadTodos();
    if (saved.length > 0) {
      dispatch({ type: 'LOAD_TODOS', payload: { todos: saved } });
    }
  }, []);

  useEffect(() => {
    saveTodos(state.todos);
  }, [state.todos]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
