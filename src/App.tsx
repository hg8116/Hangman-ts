import "./App.css"
import { useState, useEffect, useCallback } from "react"
import words from "./wordList.json"
import HangmanDrawing from "./components/HangmanDrawing"
import HangmanWord from "./components/HangmanWord"
import Keyboard from "./components/Keyboard"

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)]
  })
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter((letter) => {
    return !wordToGuess.split("").includes(letter)
  })

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every((letter) => {
    return guessedLetters.includes(letter)
  }
  )

  const addGuessedLetter = useCallback((letter: string) => {
    if(guessedLetters.includes(letter) || isLoser || isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isWinner, isLoser])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if(!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }

  }, [guessedLetters])

  useEffect(() => {
    if(isWinner || isLoser) {
      const handler = (e: KeyboardEvent) => {
        const key = e.key
        if(key !== "Enter") return
        e.preventDefault()
        setWordToGuess(words[Math.floor(Math.random() * words.length)])
        setGuessedLetters([])
      }
      document.addEventListener("keypress", handler)
      return () => {
        document.removeEventListener("keypress", handler)
      }
    }
  }, [isWinner, isLoser])

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}>
      <div
        style={{
          fontSize: "2rem",
          textAlign: "center",
        }}>
        {isWinner && "You win!"}
        {isLoser && "You lose!"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled = {isWinner || isLoser}
          activeLetter={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App
