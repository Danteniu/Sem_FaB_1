import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from './app/hooks'
import { selectTheme, toggleTheme } from './features/theme/themeSlice'
import TodoList from './features/todos/TodoList'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  
  // Применяем тему к документу
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="App">
      <div className="theme-switch-container">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="theme-switch"
        >
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
        </button>
      </div>
      <TodoList />
    </div>
  )
}

export default App
