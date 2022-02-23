import React, { useState, useEffect } from 'react'
import { generateRandomNumber } from './genRandom'
import { checkGuess } from './checkGuess'

export function BullsAndCows({ guessLength = 4 }) {
  const [guessHistory, setGuessHistory] = useState([])
  const [guess, setGuess] = useState('')
  const [submitError, setSubmitError] = useState(false)
  const [secret, setSecret] = useState('')

  // Only to get rid of the mismatch warning.
  // Could turn off ssr for just this component
  // 👆🏽 TODO
  useEffect(() => {
    console.log('use effect running')
    setSecret(generateRandomNumber(guessLength))
  }, [guessLength])

  const submitErrorMessage = `Make a guess that has ${guessLength} digits`
  const formatHint = ({ bulls, cows }) => `${bulls}B ${cows}C`
  const checkWin = ({ bulls }) => bulls === guessLength

  const resetGame = () => {
    setGuessHistory([])
    setGuess('')
    setSubmitError(false)
    setSecret(generateRandomNumber(guessLength))
  }

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(false)
    // validate: number should be a number of 1 to guessLength digits while typing
    // other characters will be ignored
    // for guessLength = 4, /\d{0,4}/
    const uptoGuessLength = new RegExp(`^\\d{0,${guessLength}}$`)
    const guessValue = e.target.value
    const valid = uptoGuessLength.test(guessValue)

    if (valid) {
      setGuess(guessValue)
    }
  }

  const handleGuessSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSubmitError(false)

    const target = e.target as typeof e.target & {
      guess: { value: string }
    }

    const guessValue = target.guess.value
    // Can't submit if the guess isn't a number with guessLength digits
    // for guessLength = 4, /\d{4}/
    const exactlyGuessLength = new RegExp(`^\\d{${guessLength}}$`)
    const valid = exactlyGuessLength.test(guessValue)
    if (valid) {
      setGuessHistory([
        ...guessHistory,
        { value: guessValue, hint: checkGuess(secret, guessValue) },
      ])
    } else {
      setSubmitError(true)
    }
  }

  const won = guessHistory.length
    ? checkWin(guessHistory[guessHistory.length - 1].hint)
    : false

  return (
    <div>
      <div>
        {guessHistory.map((g, i) => (
          <div key={i}>
            <span>{g.value}</span>-<span>{formatHint(g.hint)}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleGuessSubmit}>
        <input
          type="number"
          placeholder={Array.from({ length: guessLength }, () => '•').join('')}
          name="guess"
          value={guess}
          onChange={handleGuessChange}
        />
        <button>Guess</button>
        <div>{submitError && submitErrorMessage}</div>
        <div>Secret: {secret}</div>
        {won && <button onClick={resetGame}>Play another around</button>}
        {won &&
          `You figured out the secret number in ${guessHistory.length} ${
            guessHistory.length === 1 ? 'try' : 'tries'
          }.`}
      </form>
    </div>
  )
}
