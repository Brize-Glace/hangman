import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [word, setWord] = useState<string>('')
  const [attempts, setAttempts] = useState<number>(0)
  const [allowedTries] = useState<number>(15)
  const [foundLetters, setFoundLetters] = useState<string[]>([])
  const [hasWon, setHasWon] = useState<boolean>(false)

  useEffect(() => {
    fetch('http://localhost:3333/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        locale: 'fr-FR'
      })
    })
      .then((response: Response) => response.json())
      .then((data: { word: string }) => setWord(data.word))
      .catch((error) => console.error(error))
  }, [])

  return (
    <>
      <h1>Le Pendu</h1>
      <p>Il vous reste {allowedTries - attempts} essais</p>
      <div>
        {word.split('').map((char, i) => (
          <span key={i}>{foundLetters.includes(char.toLocaleLowerCase()) ? char : '_ '}</span>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('letter') as HTMLInputElement;
        let letter = input.value.toLowerCase();
        if (letter.length > 1 && letter === word.toLowerCase()) {
          const wordGuessed = letter
          wordGuessed.split('').map((char) => (
            setFoundLetters(prev => [...prev, char])
          ))
          setHasWon(true)
        } else if (letter.length > 1 && letter != word.toLowerCase()) {
          setAttempts(prev => prev + 3)
        } else {
          if (letter && !foundLetters.includes(letter)) {
            setFoundLetters(prev => [...prev, letter]);
            if (!word.toLowerCase().includes(letter)) {
              setAttempts(prev => prev + 1)
            }
            const newFoundLetters = [...foundLetters, letter]
            setFoundLetters(newFoundLetters);

            if (word.toLowerCase().split('').every(char => newFoundLetters.includes(char))) {
              setHasWon(true)
            }
          }
        }
        input.value = '';
      }}>
        <input type="text" name='letter' maxLength={word.length} required autoComplete='off' disabled={attempts >= allowedTries || hasWon} />
        <button type='submit' disabled={attempts >= allowedTries || hasWon}>Valider</button>
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
