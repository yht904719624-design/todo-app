import { useState } from 'react';
import type { Todo, Priority } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import { formatDate, isOverdue } from '../../utils/helpers';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import styles from './TodoItem.module.css';

interface Props {
  todo: Todo;
  isDragActive: boolean;
  delay: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
}

export function TodoItem({ todo, isDragActive, delay, onDragStart, onDragEnd, onDrop }: Props) {
  const { state, dispatch } = useTodos();
  const isSelected = state.selectedIds.includes(todo.id);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [editingSubtask, setEditingSubtask] = useState<{ id: string; text: string } | null>(null);

  const completed = todo.completed;

  function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    dispatch({
      type: 'EDIT_TODO',
      payload: { id: todo.id, text: trimmed, priority: editPriority, dueDate: editDueDate || null },
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

  const overdue = isOverdue(todo.dueDate) && !completed;
  const priorityLabel = { high: '高', medium: '中', low: '低' }[todo.priority];
  const subtaskCount = todo.subtasks.length;
  const subtaskCompleted = todo.subtasks.filter((s) => s.completed).length;

  function handleAddSubtask() {
    const trimmed = newSubtaskText.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_SUBTASK', payload: { parentId: todo.id, text: trimmed } });
    setNewSubtaskText('');
  }

  function handleSaveSubtaskEdit() {
    if (!editingSubtask) return;
    const trimmed = editingSubtask.text.trim();
    if (!trimmed) return;
    dispatch({
      type: 'EDIT_SUBTASK',
      payload: { parentId: todo.id, subtaskId: editingSubtask.id, text: trimmed },
    });
    setEditingSubtask(null);
  }

  if (editing) {
    return (
      <div className={styles.item} role="listitem">
        <div className={styles.editRow}>
          <input
            className={styles.editInput}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="编辑任务内容"
          />
        </div>
        <div className={styles.editOptions}>
          <select
            className={styles.editSelect}
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
            aria-label="优先级"
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
            aria-label="截止日期"
          />
          <div className={styles.editActions}>
            <button className={styles.saveBtn} onClick={handleSave}>保存</button>
            <button className={styles.cancelBtn} onClick={handleCancel}>取消</button>
          </div>
        </div>
        {showDeleteConfirm && (
          <ConfirmDialog
            message="确定要删除这条任务吗？"
            onConfirm={() => {
              dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
              setShowDeleteConfirm(false);
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.item} todo-item-enter ${completed ? styles.completed : ''} ${isSelected ? styles.selected : ''} ${isDragActive ? styles.dragging : ''}`}
        style={{ animationDelay: `${delay * 0.04}s` }}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          onDrop();
        }}
        role="listitem"
        aria-label={`${todo.text}${completed ? ' (已完成)' : ''}`}
      >
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => dispatch({ type: 'TOGGLE_SELECT', payload: { id: todo.id } })}
          className={styles.selectCheckbox}
          aria-label="选择此任务"
          tabIndex={-1}
        />

        {/* Circular completion checkbox */}
        <div
          className={`${styles.checkWrap} ${completed ? styles.checked : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: { id: todo.id } })}
          role="checkbox"
          aria-checked={completed}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              dispatch({ type: 'TOGGLE_TODO', payload: { id: todo.id } });
            }
          }}
          aria-label={completed ? '标记为未完成' : '标记为已完成'}
        >
          <div className={styles.circle}>
            <span className={styles.checkIcon}>✓</span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <span className={styles.text}>{todo.text}</span>
          <div className={styles.meta}>
            {!completed && (
              <span className={`${styles.priorityBadge} ${todo.priority === 'high' ? styles.priorityHigh : todo.priority === 'medium' ? styles.priorityMedium : styles.priorityLow}`}>
                {priorityLabel}
              </span>
            )}
            {todo.dueDate && (
              <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
                {formatDate(todo.dueDate)}
                {overdue && ' 已过期'}
              </span>
            )}
            {subtaskCount > 0 && (
              <span className={styles.subtaskHint}>
                {subtaskCompleted}/{subtaskCount} 子任务
              </span>
            )}
          </div>
        </div>

        {/* Star / Important */}
        <button
          className={`${styles.starBtn} ${todo.important ? styles.starActive : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_IMPORTANT', payload: { id: todo.id } })}
          aria-label={todo.important ? '取消重要' : '标记为重要'}
        >
          {todo.important ? '★' : '☆'}
        </button>

        {/* Subtask expand */}
        <button
          className={`${styles.expandBtn} ${subtasksExpanded ? styles.expanded : ''}`}
          onClick={() => setSubtasksExpanded(!subtasksExpanded)}
          aria-label={subtasksExpanded ? '收起子任务' : '展开子任务'}
          title={subtasksExpanded ? '收起子任务' : '展开子任务'}
        >
          {subtasksExpanded ? '▾' : '▸'}
        </button>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.editBtn}
            onClick={() => setEditing(true)}
            aria-label={`编辑 "${todo.text}"`}
          >
            编辑
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`删除 "${todo.text}"`}
          >
            删除
          </button>
        </div>

        {showDeleteConfirm && (
          <ConfirmDialog
            message="确定要删除这条任务吗？"
            onConfirm={() => {
              dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
              setShowDeleteConfirm(false);
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>

      {/* Subtask section */}
      {subtasksExpanded && (
        <div className={styles.subtaskSection}>
          {todo.subtasks.map((subtask) => (
            <div key={subtask.id} className={styles.subtaskItem}>
              <div
                className={`${styles.subtaskCheckWrap} ${subtask.completed ? styles.subtaskChecked : ''}`}
                onClick={() =>
                  dispatch({
                    type: 'TOGGLE_SUBTASK',
                    payload: { parentId: todo.id, subtaskId: subtask.id },
                  })
                }
                role="checkbox"
                aria-checked={subtask.completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch({
                      type: 'TOGGLE_SUBTASK',
                      payload: { parentId: todo.id, subtaskId: subtask.id },
                    });
                  }
                }}
              >
                <span className={styles.subtaskCheckIcon}>{subtask.completed ? '✓' : ''}</span>
              </div>

              {editingSubtask?.id === subtask.id ? (
                <input
                  className={styles.subtaskEditInput}
                  type="text"
                  value={editingSubtask.text}
                  onChange={(e) => setEditingSubtask({ ...editingSubtask, text: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveSubtaskEdit();
                    if (e.key === 'Escape') setEditingSubtask(null);
                  }}
                  onBlur={handleSaveSubtaskEdit}
                  autoFocus
                />
              ) : (
                <span
                  className={`${styles.subtaskText} ${subtask.completed ? styles.subtaskTextDone : ''}`}
                  onDoubleClick={() => setEditingSubtask({ id: subtask.id, text: subtask.text })}
                >
                  {subtask.text}
                </span>
              )}

              <button
                className={styles.subtaskDeleteBtn}
                onClick={() =>
                  dispatch({
                    type: 'DELETE_SUBTASK',
                    payload: { parentId: todo.id, subtaskId: subtask.id },
                  })
                }
                aria-label={`删除子任务 "${subtask.text}"`}
                title="删除子任务"
              >
                ×
              </button>
            </div>
          ))}

          {/* Add subtask input */}
          <div className={styles.addSubtaskRow}>
            <input
              className={styles.addSubtaskInput}
              type="text"
              placeholder="添加子任务..."
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSubtask();
              }}
            />
            <button className={styles.addSubtaskBtn} onClick={handleAddSubtask}>
              添加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
