import { createContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { TodoState, TodoAction } from '../types/todo';
import { todoReducer, initialState } from './todoReducer';
import { loadState, saveState } from '../utils/storage';

interface TodoContextValue {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState, () => {
    const saved = loadState();
    if (saved) {
      return { ...initialState, ...saved };
    }
    return initialState;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
