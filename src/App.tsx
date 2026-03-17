import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import { useGame } from './contexts/GameContext'
import { Shop } from './components/shop'


const KEYBOARD_ROWS = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n', '-', 'é', 'è']
]

function HangmanDrawing({ mistakes, maxMistakes }: { mistakes: number, maxMistakes: number }) {
  const step = maxMistakes > 0 ? mistakes / maxMistakes : 0;
  
  return (
    <div className="hangman-container">
      <svg viewBox="0 0 200 250" style={{ width: '100%', height: '100%' }}>
        {/* Base */}
        {step > 0 && <line x1="20" y1="230" x2="180" y2="230" className="hangman-part" />}
        {/* Pole */}
        {step > 0.16 && <line x1="60" y1="230" x2="60" y2="20" className="hangman-part" />}
        {/* Top & rope */}
        {step > 0.33 && (
          <>
            <line x1="60" y1="20" x2="140" y2="20" className="hangman-part" />
            <line x1="140" y1="20" x2="140" y2="50" className="hangman-part" />
          </>
        )}
        {/* Head */}
        {step > 0.5 && (
          <circle cx="140" cy="70" r="20" className={`hangman-part ${step >= 1 ? 'danger' : ''}`} />
        )}
        {/* Body */}
        {step > 0.66 && (
          <line x1="140" y1="90" x2="140" y2="150" className={`hangman-part ${step >= 1 ? 'danger' : ''}`} />
        )}
        {/* Arms and Legs */}
        {step > 0.83 && (
          <>
            <line x1="140" y1="110" x2="110" y2="130" className={`hangman-part ${step >= 1 ? 'danger' : ''}`} />
            <line x1="140" y1="110" x2="170" y2="130" className={`hangman-part ${step >= 1 ? 'danger' : ''}`} />
          </>
        )}
        {step >= 1 && (
          <>
            <line x1="140" y1="150" x2="120" y2="190" className={`hangman-part danger`} />
            <line x1="140" y1="150" x2="160" y2="190" className={`hangman-part danger`} />
          </>
        )}
      </svg>
    </div>
  )
}

function App() {
  const { word, attempts, allowedTries, foundLetters, hasWon, guessLetter, resetGame, streak } = useGame()

  const mistakes = attempts;
  const maxMistakes = allowedTries;
  

  // Effects
  useEffect(() => {
    if (hasWon) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#6366f1', '#f59e0b']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#6366f1', '#f59e0b']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [hasWon]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasWon || mistakes >= maxMistakes) return;
      const key = e.key.toLowerCase();
      // accept accents
      if (/^[a-z-éè]$/.test(key)) {
        guessLetter(key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guessLetter, hasWon, mistakes, maxMistakes]);

  // Shake effect
  useEffect(() => {
    if (mistakes > 0 && mistakes < maxMistakes && !hasWon) {
      document.body.classList.remove('shake-animation');
      void document.body.offsetWidth; // Trigger reflow
      document.body.classList.add('shake-animation');
    }
  }, [mistakes, maxMistakes, hasWon]);

  const isGameOver = hasWon === false && mistakes >= maxMistakes;

  return (
    <>
      {hasWon && <div className="win-overlay" />}
      {isGameOver && <div className="loss-overlay" />}
      <div className={`blood-splatter ${isGameOver ? 'active' : ''}`} />

      <div className="app-container">
        <h1>Le Pendu</h1>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '48rem' }}>
          <div className="stats-container">
            <div className="stat-badge">
              <span>Streak :</span>
              <span style={{color: 'var(--primary)'}}>
                {streak}
              </span>
            </div>
            <div className="stat-badge">
              <span>Lettres :</span>
              <span style={{color: 'var(--primary)'}}>
                {word ? [...new Set(word.toLowerCase().split(''))].filter(char => foundLetters.includes(char)).length : 0} / {word ? [...new Set(word.toLowerCase().split(''))].length : 0}
              </span>
            </div>
            <div className={`stat-badge ${mistakes >= maxMistakes - 1 ? 'danger' : ''}`}>
              <span>Erreurs :</span>
              <span>{mistakes} / {maxMistakes}</span>
            </div>
          </div>

          <HangmanDrawing mistakes={mistakes} maxMistakes={maxMistakes} />

          <div className="word-display">
            {word.split('').map((char, i) => {
              const upperChar = char.toLowerCase();
              const isRevealed = foundLetters.includes(upperChar);
              const isMissed = isGameOver && !isRevealed;

              return (
                <div 
                  key={i} 
                  className={`letter-box ${!isRevealed && !isGameOver ? 'empty' : ''} ${isRevealed ? 'revealed' : ''} ${isMissed ? 'missed' : ''}`}
                >
                  {isRevealed || isGameOver ? upperChar : ''}
                </div>
              );
            })}
          </div>

          {hasWon || isGameOver ? (
            <div className={`game-over-message ${hasWon ? 'win' : 'loss'}`}>
              <h2>{hasWon ? 'Victoire !' : 'Défaite...'}</h2>
              {isGameOver && <p style={{marginBottom: '1rem', fontSize: '1.25rem'}}>Le mot était : <strong>{word.toUpperCase()}</strong></p>}
              <button onClick={resetGame} style={{marginTop: '1rem'}}>
                Rejouer
              </button>
            </div>
          ) : (
            <div className="keyboard">
              {KEYBOARD_ROWS.map((row, i) => (
                <div key={i} className="keyboard-row">
                  {row.map((key) => {
                    const isGuessed = foundLetters.includes(key);
                    const isCorrect = isGuessed && word.toLowerCase().includes(key);
                    const isIncorrect = isGuessed && !word.toLowerCase().includes(key);

                    return (
                      <button
                        key={key}
                        className={`key ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                        onClick={() => guessLetter(key)}
                        disabled={isGuessed}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        <Shop />
      </div>
    </>
  )
}

export default App
