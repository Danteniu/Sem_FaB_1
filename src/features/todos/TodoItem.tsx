import React, { useState } from 'react';
import { Todo } from './todosSlice';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  // Форматирование даты создания
  const formattedDate = new Date(todo.createdAt).toLocaleString('ru', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <button type="submit" className="save-button">Сохранить</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => {
              setEditText(todo.text);
              setIsEditing(false);
            }}
          >
            Отмена
          </button>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={onToggle}
            className="todo-checkbox"
          />
          <div className="todo-content">
            <span className="todo-text">{todo.text}</span>
            <span className="todo-date">{formattedDate}</span>
          </div>
          <div className="todo-actions">
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Редактировать
            </button>
            <button onClick={onDelete} className="delete-button">
              Удалить
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem; 