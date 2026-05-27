export type Priority = 'high' | 'medium' | 'low';

export type FilterStatus = 'all' | 'active' | 'completed';

export type PriorityFilter = 'all' | Priority;

export type SortBy = 'createdAt' | 'dueDate' | 'priority';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
}

export interface TodoState {
  todos: Todo[];
  filterStatus: FilterStatus;
  filterPriority: PriorityFilter;
  sortBy: SortBy;
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; priority: Priority; dueDate: string | null } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string; priority: Priority; dueDate: string | null } }
  | { type: 'LOAD_TODOS'; payload: { todos: Todo[] } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_FILTER_STATUS'; payload: { filterStatus: FilterStatus } }
  | { type: 'SET_FILTER_PRIORITY'; payload: { filterPriority: PriorityFilter } }
  | { type: 'SET_SORT_BY'; payload: { sortBy: SortBy } };
