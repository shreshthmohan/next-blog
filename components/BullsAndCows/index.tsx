import React, { useState, useEffect } from 'react'
import { generateRandomNumber } from './genRandom'
import { checkGuess } from './checkGuess'

const formatHint = ({ bulls, cows }) => `${bulls}B ${cows}C`

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
      setGuess('')
    } else {
      setSubmitError(true)
    }
  }

  // const won = true
  const won = guessHistory.length
    ? checkWin(guessHistory[guessHistory.length - 1].hint)
    : false

  return (
    // TODO bullsandcows layout: bg-lime-50 at top level
    <div className="font-mono text-gray-700 w-[24rem] max-w-[100vw] px-4 box-border">
      <div className="text-center py-4">
        {guessHistory.map((g, i) => (
          <div key={i}>
            <span>{g.value}</span>
            {' · '}
            <span>{formatHint(g.hint)}</span>
          </div>
        ))}
      </div>
      <form className="flex flex-col" onSubmit={handleGuessSubmit}>
        <div className="flex justify-between">
          {!won && (
            <input
              className="font-mono w-full text-gray-700 font-bold py-2 border-solid border border-gray-300 rounded-full shadow-sm placeholder-gray-200 focus:outline-none hover:shadow-inner focus:shadow-inner focus:ring-lime-500 focus:border-lime-500 text-xl text-center"
              type="number"
              placeholder={Array.from({ length: guessLength }, () => '•').join(
                '',
              )}
              name="guess"
              value={guess}
              onChange={handleGuessChange}
            />
          )}
        </div>
        {!won && (
          <button className="font-sans mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-lg hover:shadow-md text-xl font-bold text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">
            Guess
          </button>
        )}
        <div className=" mt-2 font-bold text-sm text-center text-red-500">
          {submitError && submitErrorMessage}
        </div>
        {won && (
          <span className="text-sm text-center font-bold">{`You figured out the secret number in ${
            guessHistory.length
          } ${guessHistory.length === 1 ? 'try' : 'tries'}!`}</span>
        )}
        {won && (
          <button
            className="font-sans mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-lg hover:shadow-md text-xl font-bold text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            onClick={resetGame}
          >
            Play another around
          </button>
        )}
      </form>
    </div>
  )
}
