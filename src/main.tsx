import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
)


{/* 

  <div style={{ fontSize: '2rem', margin: '20px 0', letterSpacing: '0.5rem' }}>
        {word.split('').map((char, i) => (
          <span key={i}>{foundLetters.includes(char.toLowerCase()) ? char : '_'}</span>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('letter') as HTMLInputElement;
        const letter = input.value.toLowerCase();
        if (letter && !foundLetters.includes(letter)) {
          setFoundLetters(prev => [...prev, letter]);
          if (!word.toLowerCase().includes(letter)) {
            setAttempts(prev => prev + 1);
          }
        }
        input.value = '';
      }}>
        <input type="text" name="letter" maxLength={1} required autoComplete="off" disabled={attempts >= 10} />
        <button type="submit" disabled={attempts >= 10}>Valider</button>
      </form>
  
  */}