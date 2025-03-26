import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { 
  selectTodos, 
  selectStatus, 
  selectError, 
  fetchTodos, 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  editTodo,
  clearCompleted 
} from './todosSlice';
import TodoItem from './TodoItem';
import '../../App.css';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="todo-app">
      <h1>Список задач</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавить новую задачу"
          className="todo-input"
        />
        <button type="submit" className="add-button">Добавить</button>
      </form>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Активные
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Завершенные
        </button>
        <button 
          onClick={() => dispatch(clearCompleted())}
          className="clear-completed"
        >
          Очистить завершенные
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo}
              onToggle={() => dispatch(toggleTodo(todo.id))}
              onDelete={() => dispatch(deleteTodo(todo.id))}
              onEdit={(text) => dispatch(editTodo({ id: todo.id, text }))}
            />
          ))
        ) : (
          <li className="empty-message">Нет задач для отображения</li>
        )}
      </ul>
    </div>
  );
};

export default TodoList; 