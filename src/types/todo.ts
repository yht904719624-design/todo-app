export type Priority = 'high' | 'medium' | 'low';

export type FilterStatus = 'all' | 'active' | 'completed';

export type PriorityFilter = 'all' | Priority;

export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'custom';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  important: boolean;
}

export interface TodoState {
  todos: Todo[];
  filterStatus: FilterStatus;
  filterPriority: PriorityFilter;
  sortBy: SortBy;
  searchQuery: string;
  selectedIds: string[];
  order: string[];
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; priority: Priority; dueDate: string | null } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string; priority: Priority; dueDate: string | null } }
  | { type: 'LOAD_TODOS'; payload: { todos: Todo[] } }
  | { type: 'LOAD_STATE'; payload: Partial<TodoState> }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_FILTER_STATUS'; payload: { filterStatus: FilterStatus } }
  | { type: 'SET_FILTER_PRIORITY'; payload: { filterPriority: PriorityFilter } }
  | { type: 'SET_SORT_BY'; payload: { sortBy: SortBy } }
  | { type: 'SET_SEARCH_QUERY'; payload: { searchQuery: string } }
  | { type: 'TOGGLE_SELECT'; payload: { id: string } }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'BATCH_DELETE'; payload: { ids: string[] } }
  | { type: 'BATCH_COMPLETE'; payload: { ids: string[] } }
  | { type: 'REORDER_TODOS'; payload: { order: string[] } }
  | { type: 'RESTORE_TODO'; payload: { todo: Todo; index: number } }
  | { type: 'TOGGLE_IMPORTANT'; payload: { id: string } };
