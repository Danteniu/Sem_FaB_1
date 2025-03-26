import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};

// Имитация API запроса для получения задач
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    // Загрузка из localStorage, если данные есть
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos) as Todo[];
    }
    
    // В реальном приложении здесь был бы запрос к API
    return [] as Todo[];
  }
);

// Сохранение задач в localStorage
const saveTodosToLocalStorage = (todos: Todo[]) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newTodo);
      saveTodosToLocalStorage(state.items);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodosToLocalStorage(state.items);
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
        saveTodosToLocalStorage(state.items);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      saveTodosToLocalStorage(state.items);
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
      saveTodosToLocalStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Произошла ошибка при загрузке задач';
      });
  },
});

export const { addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted } = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.items;
export const selectTodoById = (state: RootState, todoId: string) => 
  state.todos.items.find(todo => todo.id === todoId);
export const selectStatus = (state: RootState) => state.todos.status;
export const selectError = (state: RootState) => state.todos.error;

export default todosSlice.reducer; 