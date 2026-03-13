import './App.css'
import { useGame } from './contexts/GameContext'

function App() {
  const { word, attempts, allowedTries, foundLetters, hasWon, guessLetter, resetGame } = useGame()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem('letter') as HTMLInputElement;

    guessLetter(input.value.toLowerCase())

    input.value = ''
  }
  return (
    <>
      <h1>Le Pendu</h1>
      <p>Il vous reste {allowedTries - attempts} essais</p>
      <div>
        {word.split('').map((char, i) => (
          <span key={i}>{foundLetters.includes(char.toLocaleLowerCase()) ? char : '_ '}</span>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name='letter' maxLength={word.length} required autoComplete='off' disabled={attempts >= allowedTries || hasWon} />
        { hasWon === true || attempts >= allowedTries ? (
          <button onClick={resetGame}>Recommencer</button>
        ) : (
          <button type='submit' disabled={attempts >= allowedTries || hasWon}>Valider</button>
        )}
      </form>
      {hasWon && (
        <p>VOUS AVEZ GAGNé!!!!!</p>
      )} 
      { hasWon === false && attempts >= allowedTries && (
        <p>VOUS AVEZ PERDUUUUUU!!!!! La réponse était {word}</p>
      )}
    </>
  )
}

export default App
