import type { Todo, Priority, FilterStatus, PriorityFilter, SortBy } from '../types/todo';

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(isoString: string | null): string {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function sortTodos(todos: Todo[], sortBy: SortBy, order?: string[]): Todo[] {
  if (sortBy === 'custom' && order) {
    const indexMap = new Map(order.map((id, i) => [id, i]));
    const sorted = [...todos];
    sorted.sort((a, b) => {
      const ai = indexMap.get(a.id) ?? Infinity;
      const bi = indexMap.get(b.id) ?? Infinity;
      return ai - bi;
    });
    return sorted;
  }
  const sorted = [...todos];
  // Important items first
  sorted.sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
  switch (sortBy) {
    case 'createdAt':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case 'priority':
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    default:
      return sorted;
  }
}

export function searchTodos(todos: Todo[], query: string): Todo[] {
  if (!query.trim()) return todos;
  const lower = query.toLowerCase();
  return todos.filter((t) => t.text.toLowerCase().includes(lower));
}

export function filterTodos(
  todos: Todo[],
  status: FilterStatus,
  priority: PriorityFilter,
): Todo[] {
  let result = todos;
  if (status === 'active') {
    result = result.filter((t) => !t.completed);
  } else if (status === 'completed') {
    result = result.filter((t) => t.completed);
  }
  if (priority !== 'all') {
    result = result.filter((t) => t.priority === priority);
  }
  return result;
}
