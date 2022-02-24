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
    <div className="bulls-and-cows box-border font-mono  text-gray-700">
      <div className="py-4">
        {guessHistory.map((g, i) => (
          <div className="text-xl" key={i}>
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
              className="w-full rounded-full border border-solid border-gray-300 py-2 text-center font-mono text-xl font-bold text-gray-700 placeholder-gray-200 shadow-sm hover:shadow-inner focus:border-lime-500 focus:shadow-inner focus:outline-none focus:ring-lime-500 "
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
          <button className="mt-2 flex w-full justify-center rounded-full border border-transparent bg-lime-500 py-2 px-4 text-center font-sans text-xl font-bold text-white shadow-lg hover:bg-lime-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 ">
            Guess
          </button>
        )}
        <div className=" mt-2 text-sm font-bold text-red-500">
          {submitError && submitErrorMessage}
        </div>
        {won && (
          <span className="text-sm font-bold">{`You figured out the secret number in ${
            guessHistory.length
          } ${guessHistory.length === 1 ? 'try' : 'tries'}!`}</span>
        )}
        {won && (
          <button
            className="mt-2 flex w-full justify-center rounded-full border border-transparent bg-lime-500 py-2 px-4 font-sans text-xl font-bold text-white shadow-lg hover:bg-lime-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            onClick={resetGame}
          >
            Play another around
          </button>
        )}
      </form>
    </div>
  )
}
