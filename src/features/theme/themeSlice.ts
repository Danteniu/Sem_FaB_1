import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

// Проверяем сохраненную тему в localStorage или используем системные настройки
const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
  
  if (savedTheme) {
    return savedTheme;
  }
  
  // Проверяем системные предпочтения
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Сохраняем выбор пользователя в localStorage
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme.mode;

export default themeSlice.reducer; 