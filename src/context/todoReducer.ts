import type { TodoState, TodoAction } from '../types/todo';
import { generateId } from '../utils/helpers';

export const initialState: TodoState = {
  todos: [],
  filterStatus: 'all',
  filterPriority: 'all',
  sortBy: 'createdAt',
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO': {
      const todo = {
        id: generateId(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority,
        dueDate: action.payload.dueDate,
        createdAt: new Date().toISOString(),
      };
      return { ...state, todos: [todo, ...state.todos] };
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

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter((t) => !t.completed),
      };

    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload.filterStatus };

    case 'SET_FILTER_PRIORITY':
      return { ...state, filterPriority: action.payload.filterPriority };

    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload.sortBy };

    default:
      return state;
  }
}
