import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext.tsx'
import { StreakProvider } from './contexts/StreakContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <StreakProvider>
        <App />
      </StreakProvider>
    </GameProvider>
  </StrictMode>,
)