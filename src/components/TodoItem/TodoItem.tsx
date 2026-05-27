import { useState } from 'react';
import type { Todo, Priority } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import { formatDate, isOverdue } from '../../utils/helpers';
import styles from './TodoItem.module.css';

interface Props {
  todo: Todo;
}

export function TodoItem({ todo }: Props) {
  const { dispatch } = useTodos();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '');

  function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    dispatch({
      type: 'EDIT_TODO',
      payload: {
        id: todo.id,
        text: trimmed,
        priority: editPriority,
        dueDate: editDueDate || null,
      },
    });
    setEditing(false);
  }

  function handleCancel() {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ?? '');
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  }

  const overdue = isOverdue(todo.dueDate) && !todo.completed;
  const priorityLabel = { high: '高', medium: '中', low: '低' }[todo.priority];

  if (editing) {
    return (
      <div className={styles.item}>
        <div className={styles.editRow}>
          <input
            className={styles.editInput}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div className={styles.editOptions}>
          <select
            className={styles.editSelect}
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
          >
            <option value="high">高优先级</option>
            <option value="medium">中优先级</option>
            <option value="low">低优先级</option>
          </select>
          <input
            className={styles.editDate}
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
          <div className={styles.editActions}>
            <button className={styles.saveBtn} onClick={handleSave}>
              保存
            </button>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: { id: todo.id } })}
          className={styles.checkbox}
        />
        <span className={styles.checkmark} />
      </label>

      <div className={styles.content}>
        <span className={styles.text}>{todo.text}</span>
        <div className={styles.meta}>
          <span className={`${styles.priorityBadge} ${styles[`priority${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}`]}`}>
            {priorityLabel}
          </span>
          {todo.dueDate && (
            <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
              {formatDate(todo.dueDate)}
              {overdue && ' 已过期'}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => setEditing(true)}>
          编辑
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } })}
        >
          删除
        </button>
      </div>
    </div>
  );
}
