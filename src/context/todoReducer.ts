import type { TodoState, TodoAction } from '../types/todo';
import { generateId } from '../utils/helpers';

export const initialState: TodoState = {
  todos: [],
  filterStatus: 'all',
  filterPriority: 'all',
  sortBy: 'createdAt',
  searchQuery: '',
  selectedIds: [],
  order: [],
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO': {
      const id = generateId();
      const todo = {
        id,
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority,
        dueDate: action.payload.dueDate,
        createdAt: new Date().toISOString(),
        important: false,
        subtasks: [],
      };
      return {
        ...state,
        todos: [todo, ...state.todos],
        order: [id, ...state.order],
      };
    }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, completed: !t.completed } : t,
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload.id),
        selectedIds: state.selectedIds.filter((id) => id !== action.payload.id),
        order: state.order.filter((id) => id !== action.payload.id),
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                text: action.payload.text,
                priority: action.payload.priority,
                dueDate: action.payload.dueDate,
              }
            : t,
        ),
      };

    case 'LOAD_TODOS':
      return { ...state, todos: action.payload.todos };

    case 'LOAD_STATE':
      return { ...state, ...action.payload, selectedIds: [] };

    case 'CLEAR_COMPLETED': {
      const completedIds = new Set(state.todos.filter((t) => t.completed).map((t) => t.id));
      return {
        ...state,
        todos: state.todos.filter((t) => !t.completed),
        filterStatus: 'all',
        selectedIds: [],
        order: state.order.filter((id) => !completedIds.has(id)),
      };
    }

    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload.filterStatus };

    case 'SET_FILTER_PRIORITY':
      return { ...state, filterPriority: action.payload.filterPriority };

    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload.sortBy };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload.searchQuery };

    case 'TOGGLE_SELECT':
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload.id)
          ? state.selectedIds.filter((id) => id !== action.payload.id)
          : [...state.selectedIds, action.payload.id],
      };

    case 'SELECT_ALL': {
      const visibleIds = new Set(state.todos.map((t) => t.id));
      return { ...state, selectedIds: [...visibleIds] };
    }

    case 'DESELECT_ALL':
      return { ...state, selectedIds: [] };

    case 'BATCH_DELETE':
      return {
        ...state,
        todos: state.todos.filter((t) => !action.payload.ids.includes(t.id)),
        selectedIds: [],
        order: state.order.filter((id) => !action.payload.ids.includes(id)),
      };

    case 'BATCH_COMPLETE':
      return {
        ...state,
        todos: state.todos.map((t) =>
          action.payload.ids.includes(t.id) ? { ...t, completed: true } : t,
        ),
        selectedIds: [],
      };

    case 'REORDER_TODOS':
      return { ...state, order: action.payload.order, sortBy: 'custom' };

    case 'RESTORE_TODO': {
      const restoredTodos = [...state.todos];
      restoredTodos.splice(action.payload.index, 0, action.payload.todo);
      const restoredOrder = [...state.order];
      restoredOrder.splice(action.payload.index, 0, action.payload.todo.id);
      return { ...state, todos: restoredTodos, order: restoredOrder };
    }

    case 'TOGGLE_IMPORTANT':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, important: !t.important } : t,
        ),
      };

    case 'ADD_SUBTASK':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: [
                  ...t.subtasks,
                  {
                    id: generateId(),
                    text: action.payload.text,
                    completed: false,
                  },
                ],
              }
            : t,
        ),
      };

    case 'TOGGLE_SUBTASK': {
      const updatedTodos = state.todos.map((t) => {
        if (t.id !== action.payload.parentId) return t;
        const subtasks = t.subtasks.map((s) =>
          s.id === action.payload.subtaskId ? { ...s, completed: !s.completed } : s,
        );
        const allCompleted = subtasks.length > 0 && subtasks.every((s) => s.completed);
        return { ...t, subtasks, completed: allCompleted };
      });
      return { ...state, todos: updatedTodos };
    }

    case 'DELETE_SUBTASK':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: t.subtasks.filter((s) => s.id !== action.payload.subtaskId),
              }
            : t,
        ),
      };

    case 'EDIT_SUBTASK':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === action.payload.subtaskId ? { ...s, text: action.payload.text } : s,
                ),
              }
            : t,
        ),
      };

    default:
      return state;
  }
}
