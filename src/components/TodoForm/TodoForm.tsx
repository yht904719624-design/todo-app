import { useState, type FormEvent } from 'react';
import type { Priority } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import styles from './TodoForm.module.css';

export function TodoForm() {
  const { dispatch } = useTodos();
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_TODO',
      payload: {
        text: trimmed,
        priority,
        dueDate: dueDate || null,
      },
    });
    setText('');
    setPriority('medium');
    setDueDate('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          className={styles.textInput}
          type="text"
          placeholder="添加新任务..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter') handleSubmit(e);
          }}
        />
        <button className={styles.addBtn} type="submit">
          添加
        </button>
      </div>
      <div className={styles.options}>
        <div className={styles.field}>
          <label className={styles.label}>优先级</label>
          <select
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>截止日期</label>
          <input
            className={styles.dateInput}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
