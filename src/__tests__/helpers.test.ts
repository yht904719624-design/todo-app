import { describe, it, expect } from 'vitest';
import { searchTodos, filterTodos, sortTodos, isOverdue, formatDate } from '../utils/helpers';
import type { Todo } from '../types/todo';

function makeTodo(overrides: Partial<Todo> & { id: string }): Todo {
  return {
    text: 'Test',
    completed: false,
    priority: 'medium',
    dueDate: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    important: false,
    ...overrides,
  };
}

describe('searchTodos', () => {
  const todos: Todo[] = [
    makeTodo({ id: '1', text: 'Buy milk' }),
    makeTodo({ id: '2', text: 'Write code' }),
    makeTodo({ id: '3', text: 'buy eggs' }),
  ];

  it('returns all todos when query is empty', () => {
    expect(searchTodos(todos, '')).toHaveLength(3);
    expect(searchTodos(todos, '   ')).toHaveLength(3);
  });

  it('filters by case-insensitive match', () => {
    const result = searchTodos(todos, 'buy');
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(['1', '3']);
  });

  it('returns empty when no match', () => {
    expect(searchTodos(todos, 'xyz')).toHaveLength(0);
  });
});

describe('filterTodos', () => {
  const todos: Todo[] = [
    makeTodo({ id: '1', completed: false, priority: 'high' }),
    makeTodo({ id: '2', completed: true, priority: 'medium' }),
    makeTodo({ id: '3', completed: false, priority: 'low' }),
  ];

  it('returns all when both filters are all', () => {
    const result = filterTodos(todos, 'all', 'all');
    expect(result).toHaveLength(3);
  });

  it('filters by active status', () => {
    const result = filterTodos(todos, 'active', 'all');
    expect(result).toHaveLength(2);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it('filters by completed status', () => {
    const result = filterTodos(todos, 'completed', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by priority', () => {
    const result = filterTodos(todos, 'all', 'high');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('combines status and priority filters', () => {
    const result = filterTodos(todos, 'active', 'low');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });
});

describe('sortTodos', () => {
  const todos: Todo[] = [
    makeTodo({ id: '1', createdAt: '2025-01-01T00:00:00.000Z', priority: 'low' }),
    makeTodo({ id: '2', createdAt: '2025-03-01T00:00:00.000Z', priority: 'high' }),
    makeTodo({ id: '3', createdAt: '2025-02-01T00:00:00.000Z', priority: 'medium' }),
  ];

  it('sorts by createdAt descending', () => {
    const result = sortTodos(todos, 'createdAt');
    expect(result[0].id).toBe('2');
    expect(result[2].id).toBe('1');
  });

  it('sorts by priority (high first)', () => {
    const result = sortTodos(todos, 'priority');
    expect(result[0].priority).toBe('high');
    expect(result[1].priority).toBe('medium');
    expect(result[2].priority).toBe('low');
  });

  it('sorts by dueDate with null dates at end', () => {
    const withDates: Todo[] = [
      makeTodo({ id: '1', dueDate: null }),
      makeTodo({ id: '2', dueDate: '2025-06-01T00:00:00.000Z' }),
      makeTodo({ id: '3', dueDate: '2025-01-01T00:00:00.000Z' }),
    ];
    const result = sortTodos(withDates, 'dueDate');
    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('1');
  });

  it('sorts by custom order', () => {
    const result = sortTodos(todos, 'custom', ['3', '1', '2']);
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  it('returns unchanged for custom sort without order', () => {
    const result = sortTodos(todos, 'custom');
    expect(result).toHaveLength(3);
  });
});

describe('isOverdue', () => {
  it('returns false for null date', () => {
    expect(isOverdue(null)).toBe(false);
  });

  it('returns true for a past date', () => {
    expect(isOverdue('2020-01-01')).toBe(true);
  });

  it('returns false for a future date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isOverdue(future.toISOString())).toBe(false);
  });
});

describe('formatDate', () => {
  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('formats date in zh-CN locale', () => {
    const result = formatDate('2025-12-25T00:00:00.000Z');
    expect(result).toContain('2025');
    expect(result).toContain('12');
    expect(result).toContain('25');
  });
});
