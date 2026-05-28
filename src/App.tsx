import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { FilterBar } from './components/FilterBar/FilterBar';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
import { BatchBar } from './components/BatchBar/BatchBar';
import styles from './App.module.css';

function AppContent() {
  const { state, dispatch } = useTodos();
  const { theme, toggleTheme } = useTheme();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const remaining = state.todos.filter((t) => !t.completed).length;
  const completed = state.todos.filter((t) => t.completed).length;

  return (
    <div className={styles.app} style={state.selectedIds.length > 0 ? { paddingBottom: '4rem' } : undefined}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todo</h1>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title={theme === 'light' ? '切换暗色模式' : '切换亮色模式'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
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
              onClick={() => setShowClearConfirm(true)}
            >
              清除已完成 ({completed})
            </button>
          )}
        </footer>
      )}

      <BatchBar />

      {showClearConfirm && (
        <ConfirmDialog
          message={`确定要清除所有已完成任务吗？（${completed} 条）`}
          onConfirm={() => {
            dispatch({ type: 'CLEAR_COMPLETED' });
            setShowClearConfirm(false);
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
