import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
//import { useStreak } from "./StreakContext";

interface GameContextType {
    word: string,
    attempts: number,
    allowedTries: number,
    foundLetters: string[],
    hasWon: boolean,
    guessLetter: (letter: string) => void,
    resetGame: () => void,
    streak: number,
    spendStreak: (amount: number) => boolean
    shieldActive : boolean;
    activateShield: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
    const [word, setWord] = useState<string>('')
    const [attempts, setAttempts] = useState<number>(0)
    const [allowedTries] = useState<number>(9)
    const [foundLetters, setFoundLetters] = useState<string[]>([])
    const [hasWon, setHasWon] = useState<boolean>(false)
    const [streak, setStreak] = useState<number>(0)
    const [shieldActive, setShieldActive] = useState<boolean>(false)

    const activateShield = () => setShieldActive(true)

    const spendStreak = (amount: number) => {
        if (streak >= amount) {
            setStreak(streak - amount)
            return true
        }
        return false
    }

    const initGame = () => {
        fetch('https://hangman.alexischarp.fr/', {
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
            const newStreak = streak + 1
            setStreak(newStreak)
            console.log(`🔥 Streak en cours: ${newStreak}`)
        } else if (letter.length > 1 && letter != word.toLowerCase()) {
            const newAttempts = attempts + 3
            setAttempts(newAttempts)

            if (newAttempts >= allowedTries) {
                if (shieldActive) {
                    console.log("Bouclier activé")
                    setShieldActive(false)
                    setAttempts(allowedTries - 1)
                    setStreak(streak)
                    resetGame()
                } else {
                    const newStreak = 0
                    setStreak(newStreak)
                    console.log(`❌ Streak perdu: ${newStreak}`)
                }
            }
        } else {
            if (letter && !foundLetters.includes(letter)) {
                let newAttempts = attempts + 1
                setFoundLetters(prev => [...prev, letter]);
                if (!word.toLowerCase().includes(letter)) {
                    newAttempts = attempts + 1
                    setAttempts(newAttempts)
                }
                const newFoundLetters = [...foundLetters, letter]
                setFoundLetters(newFoundLetters);

                if (word.toLowerCase().split('').every(char => newFoundLetters.includes(char))) {
                    setHasWon(true)
                    const newStreak = streak + 1
                    setStreak(newStreak)
                    console.log(`🔥 Streak en cours: ${newStreak}`)
                } else if (newAttempts >= allowedTries) {
                    if (shieldActive) {
                        console.log("Bouclier activé")
                        setShieldActive(false)
                        setAttempts(allowedTries - 1)
                        setStreak(streak)
                        resetGame()
                    } else {
                        const newStreak = 0
                        setStreak(newStreak)
                        console.log(`❌ Streak perdu: ${streak}`)
                    }
                }
            }
        }
    }

    const resetGame = () => {
        setAttempts(0)
        setFoundLetters([])
        setHasWon(false)
        setShieldActive(false)
        initGame()
    };

    const value = {
        word,
        attempts,
        allowedTries,
        setAttempts,
        foundLetters,
        hasWon,
        guessLetter,
        resetGame,
        streak,
        spendStreak,
        shieldActive,
        activateShield
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