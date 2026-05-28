import { describe, it, expect } from 'vitest';
import { todoReducer, initialState } from '../context/todoReducer';
import type { TodoState, Todo } from '../types/todo';

function makeTodo(overrides: Partial<Todo> & { id: string }): Todo {
  return {
    text: 'Test',
    completed: false,
    priority: 'medium',
    dueDate: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('todoReducer', () => {
  describe('ADD_TODO', () => {
    it('adds a new todo at the beginning', () => {
      const state: TodoState = { ...initialState };
      const next = todoReducer(state, {
        type: 'ADD_TODO',
        payload: { text: 'Buy milk', priority: 'high', dueDate: null },
      });
      expect(next.todos).toHaveLength(1);
      expect(next.todos[0].text).toBe('Buy milk');
      expect(next.todos[0].priority).toBe('high');
      expect(next.todos[0].completed).toBe(false);
    });

    it('prepends to existing todos', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1', text: 'Existing' })],
        order: ['1'],
      };
      const next = todoReducer(state, {
        type: 'ADD_TODO',
        payload: { text: 'New', priority: 'low', dueDate: '2025-06-01' },
      });
      expect(next.todos).toHaveLength(2);
      expect(next.todos[0].text).toBe('New');
      expect(next.todos[0].dueDate).toBe('2025-06-01');
      expect(next.order[0]).toBe(next.todos[0].id);
    });
  });

  describe('TOGGLE_TODO', () => {
    it('toggles completed from false to true', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1', completed: false })],
      };
      const next = todoReducer(state, { type: 'TOGGLE_TODO', payload: { id: '1' } });
      expect(next.todos[0].completed).toBe(true);
    });

    it('toggles completed from true to false', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1', completed: true })],
      };
      const next = todoReducer(state, { type: 'TOGGLE_TODO', payload: { id: '1' } });
      expect(next.todos[0].completed).toBe(false);
    });

    it('does not affect other todos', () => {
      const state: TodoState = {
        ...initialState,
        todos: [
          makeTodo({ id: '1', completed: false }),
          makeTodo({ id: '2', completed: false }),
        ],
      };
      const next = todoReducer(state, { type: 'TOGGLE_TODO', payload: { id: '1' } });
      expect(next.todos[1].completed).toBe(false);
    });
  });

  describe('DELETE_TODO', () => {
    it('removes the todo by id', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1' }), makeTodo({ id: '2' })],
        order: ['1', '2'],
      };
      const next = todoReducer(state, { type: 'DELETE_TODO', payload: { id: '1' } });
      expect(next.todos).toHaveLength(1);
      expect(next.todos[0].id).toBe('2');
      expect(next.order).toEqual(['2']);
    });

    it('removes from selectedIds if selected', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1' })],
        selectedIds: ['1'],
      };
      const next = todoReducer(state, { type: 'DELETE_TODO', payload: { id: '1' } });
      expect(next.selectedIds).toHaveLength(0);
    });
  });

  describe('EDIT_TODO', () => {
    it('updates text, priority, and dueDate', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1', text: 'Old', priority: 'low', dueDate: null })],
      };
      const next = todoReducer(state, {
        type: 'EDIT_TODO',
        payload: { id: '1', text: 'New', priority: 'high', dueDate: '2025-12-25' },
      });
      expect(next.todos[0].text).toBe('New');
      expect(next.todos[0].priority).toBe('high');
      expect(next.todos[0].dueDate).toBe('2025-12-25');
    });
  });

  describe('CLEAR_COMPLETED', () => {
    it('removes all completed todos', () => {
      const state: TodoState = {
        ...initialState,
        todos: [
          makeTodo({ id: '1', completed: true }),
          makeTodo({ id: '2', completed: false }),
          makeTodo({ id: '3', completed: true }),
        ],
        order: ['1', '2', '3'],
      };
      const next = todoReducer(state, { type: 'CLEAR_COMPLETED' });
      expect(next.todos).toHaveLength(1);
      expect(next.todos[0].id).toBe('2');
    });

    it('resets filterStatus to all', () => {
      const state: TodoState = {
        ...initialState,
        filterStatus: 'completed',
        todos: [makeTodo({ id: '1', completed: true })],
      };
      const next = todoReducer(state, { type: 'CLEAR_COMPLETED' });
      expect(next.filterStatus).toBe('all');
    });
  });

  describe('SET_FILTER_STATUS', () => {
    it('changes filterStatus', () => {
      const state = { ...initialState };
      const next = todoReducer(state, {
        type: 'SET_FILTER_STATUS',
        payload: { filterStatus: 'completed' },
      });
      expect(next.filterStatus).toBe('completed');
    });
  });

  describe('SET_FILTER_PRIORITY', () => {
    it('changes filterPriority', () => {
      const state = { ...initialState };
      const next = todoReducer(state, {
        type: 'SET_FILTER_PRIORITY',
        payload: { filterPriority: 'high' },
      });
      expect(next.filterPriority).toBe('high');
    });
  });

  describe('SET_SORT_BY', () => {
    it('changes sortBy', () => {
      const state = { ...initialState };
      const next = todoReducer(state, {
        type: 'SET_SORT_BY',
        payload: { sortBy: 'dueDate' },
      });
      expect(next.sortBy).toBe('dueDate');
    });
  });

  describe('SET_SEARCH_QUERY', () => {
    it('changes searchQuery', () => {
      const state = { ...initialState };
      const next = todoReducer(state, {
        type: 'SET_SEARCH_QUERY',
        payload: { searchQuery: 'hello' },
      });
      expect(next.searchQuery).toBe('hello');
    });
  });

  describe('LOAD_STATE', () => {
    it('merges saved state', () => {
      const state = { ...initialState };
      const next = todoReducer(state, {
        type: 'LOAD_STATE',
        payload: { filterStatus: 'active', sortBy: 'priority' },
      });
      expect(next.filterStatus).toBe('active');
      expect(next.sortBy).toBe('priority');
      expect(next.selectedIds).toEqual([]);
    });
  });

  describe('TOGGLE_SELECT', () => {
    it('adds id to selectedIds if not present', () => {
      const state: TodoState = { ...initialState, selectedIds: [] };
      const next = todoReducer(state, { type: 'TOGGLE_SELECT', payload: { id: '1' } });
      expect(next.selectedIds).toEqual(['1']);
    });

    it('removes id from selectedIds if present', () => {
      const state: TodoState = { ...initialState, selectedIds: ['1', '2'] };
      const next = todoReducer(state, { type: 'TOGGLE_SELECT', payload: { id: '1' } });
      expect(next.selectedIds).toEqual(['2']);
    });
  });

  describe('SELECT_ALL', () => {
    it('selects all todo ids', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1' }), makeTodo({ id: '2' })],
      };
      const next = todoReducer(state, { type: 'SELECT_ALL' });
      expect(next.selectedIds).toEqual(['1', '2']);
    });
  });

  describe('DESELECT_ALL', () => {
    it('clears selectedIds', () => {
      const state: TodoState = { ...initialState, selectedIds: ['1', '2'] };
      const next = todoReducer(state, { type: 'DESELECT_ALL' });
      expect(next.selectedIds).toEqual([]);
    });
  });

  describe('BATCH_DELETE', () => {
    it('removes specified todos', () => {
      const state: TodoState = {
        ...initialState,
        todos: [makeTodo({ id: '1' }), makeTodo({ id: '2' }), makeTodo({ id: '3' })],
        order: ['1', '2', '3'],
        selectedIds: ['1', '2'],
      };
      const next = todoReducer(state, { type: 'BATCH_DELETE', payload: { ids: ['1', '2'] } });
      expect(next.todos).toHaveLength(1);
      expect(next.todos[0].id).toBe('3');
      expect(next.selectedIds).toEqual([]);
      expect(next.order).toEqual(['3']);
    });
  });

  describe('BATCH_COMPLETE', () => {
    it('marks specified todos as completed', () => {
      const state: TodoState = {
        ...initialState,
        todos: [
          makeTodo({ id: '1', completed: false }),
          makeTodo({ id: '2', completed: false }),
        ],
        selectedIds: ['1'],
      };
      const next = todoReducer(state, { type: 'BATCH_COMPLETE', payload: { ids: ['1'] } });
      expect(next.todos[0].completed).toBe(true);
      expect(next.todos[1].completed).toBe(false);
      expect(next.selectedIds).toEqual([]);
    });
  });

  describe('REORDER_TODOS', () => {
    it('updates order and sets sortBy to custom', () => {
      const state: TodoState = { ...initialState, sortBy: 'createdAt' };
      const next = todoReducer(state, {
        type: 'REORDER_TODOS',
        payload: { order: ['3', '1', '2'] },
      });
      expect(next.order).toEqual(['3', '1', '2']);
      expect(next.sortBy).toBe('custom');
    });
  });
});
