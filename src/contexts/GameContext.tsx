import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface GameContextType {
    word: string,
    attempts: number,
    allowedTries: number,
    foundLetters: string[],
    hasWon: boolean,
    guessLetter: (letter: string) => void,
    resetGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
    const [word, setWord] = useState<string>('')
    const [attempts, setAttempts] = useState<number>(0)
    const [allowedTries] = useState<number>(15)
    const [foundLetters, setFoundLetters] = useState<string[]>([])
    const [hasWon, setHasWon] = useState<boolean>(false)

    const initGame = () => {
        fetch('http://localhost:3333/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                locale: 'fr-FR'
            })
        })
            .then(res => res.json())
            .then(data => setWord(data.word))
            .catch(error => console.error(error))
    };

    useEffect(() => {
        initGame()
    }, [])

    const guessLetter = (letter: string) => {
        if (letter.length > 1 && letter === word.toLocaleLowerCase()) {
            const wordGuessed = letter
            wordGuessed.split('').forEach((char) => (
                setFoundLetters(prev => [...prev, char])))
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
    }

    const resetGame = () => {
        setAttempts(0)
        setFoundLetters([])
        setHasWon(false)
        initGame()
    };

    const value = {
        word,
        attempts,
        allowedTries,
        foundLetters,
        hasWon,
        guessLetter,
        resetGame
    }

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    )
}

//ASTUCE: Créer un hook perso pour éviter d'importer useContext partout
export function useGame() {
    const context = useContext(GameContext)
    if (!context) {
        throw new Error('useGame must be used within a GameProvider')
    }
    return context
}