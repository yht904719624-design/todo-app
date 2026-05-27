import { useTodos } from './hooks/useTodos';
import { TodoProvider } from './context/TodoContext';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { FilterBar } from './components/FilterBar/FilterBar';
import styles from './App.module.css';

function AppContent() {
  const { state, dispatch } = useTodos();
  const remaining = state.todos.filter((t) => !t.completed).length;
  const completed = state.todos.filter((t) => t.completed).length;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todo</h1>
      </header>

      <TodoForm />

      <FilterBar />

      <main className={styles.main}>
        <TodoList />
      </main>

      {state.todos.length > 0 && (
        <footer className={styles.footer}>
          <span className={styles.stats}>
            {remaining} 项未完成 / 共 {state.todos.length} 项
          </span>
          {completed > 0 && (
            <button
              className={styles.clearBtn}
              onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            >
              清除已完成 ({completed})
            </button>
          )}
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
