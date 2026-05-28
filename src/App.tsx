import { useState, useEffect, useRef, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { FilterBar } from './components/FilterBar/FilterBar';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
import { BatchBar } from './components/BatchBar/BatchBar';
import { Toast } from './components/Toast/Toast';
import type { Todo } from './types/todo';
import styles from './App.module.css';

function formatToday(): string {
  const d = new Date();
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekDay = days[d.getDay()];
  return `${month}月${day}日 ${weekDay}`;
}

function AppContent() {
  const { state, dispatch } = useTodos();
  const { theme, toggleTheme } = useTheme();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [undoInfo, setUndoInfo] = useState<{ todo: Todo; index: number } | null>(null);
  const [batchUndo, setBatchUndo] = useState<{ todos: Todo[] } | null>(null);
  const prevTodosRef = useRef<Todo[]>(state.todos);
  const today = useMemo(() => formatToday(), []);
  const completed = state.todos.filter((t) => t.completed).length;

  // Detect deleted items for undo toast
  useEffect(() => {
    const prev = prevTodosRef.current;
    const current = state.todos;

    if (prev.length === current.length + 1) {
      const deleted = prev.find((t) => !current.some((c) => c.id === t.id));
      if (deleted) {
        const idx = prev.indexOf(deleted);
        setUndoInfo({ todo: deleted, index: idx });
      }
    } else if (prev.length > current.length + 1) {
      const deleted = prev.filter((t) => !current.some((c) => c.id === t.id));
      if (deleted.length > 0) {
        setBatchUndo({ todos: deleted });
      }
    }

    prevTodosRef.current = current;
  }, [state.todos]);

  // Global Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowClearConfirm(false);
        setUndoInfo(null);
        setBatchUndo(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.app} role="main">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>我的一天</h1>
          <span className={styles.dateText}>{today}</span>
        </div>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? '切换暗色模式' : '切换亮色模式'}
        >
          {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
        </button>
      </header>

      <section aria-label="添加任务">
        <TodoForm />
      </section>

      <section aria-label="筛选和搜索">
        <FilterBar />
      </section>

      <main className={styles.main} role="list" aria-label="任务列表">
        <TodoList />
      </main>

      {state.todos.length > 0 && (
        <footer className={styles.footer}>
          <span className={styles.stats}>
            {completed > 0 && `已完成 ${completed} 项 · `}共 {state.todos.length} 项
          </span>
          {completed > 0 && (
            <button
              className={styles.clearBtn}
              onClick={() => setShowClearConfirm(true)}
            >
              清除已完成
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

      {undoInfo && (
        <Toast
          message={`已删除 "${undoInfo.todo.text}"`}
          onUndo={() => {
            dispatch({ type: 'RESTORE_TODO', payload: { todo: undoInfo.todo, index: undoInfo.index } });
            setUndoInfo(null);
          }}
          onDismiss={() => setUndoInfo(null)}
        />
      )}

      {batchUndo && (
        <Toast
          message={`已删除 ${batchUndo.todos.length} 项任务`}
          onUndo={() => {
            batchUndo.todos.forEach((todo, i) => {
              dispatch({ type: 'RESTORE_TODO', payload: { todo, index: i } });
            });
            setBatchUndo(null);
          }}
          onDismiss={() => setBatchUndo(null)}
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
