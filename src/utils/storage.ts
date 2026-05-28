import type { TodoState } from '../types/todo';

const STORAGE_KEY = 'todo-app-data';

export function loadState(): Partial<TodoState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function saveState(state: TodoState): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full or unavailable — silently fail
    }
  }, 300);
}
