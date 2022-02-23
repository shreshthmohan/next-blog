import Container from 'components/Container'
import { NextPage } from 'next'
import { BullsAndCows } from 'components/BullsAndCows'

const BNC: NextPage = () => {
  return (
    <Container
      title="Bulls and Cows Game"
      description="A guessing game with hints at each step."
    >
      <h1 className="font-sans mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl ">
        Bulls and Cows
      </h1>
      <BullsAndCows />
    </Container>
  )
}

export default BNC
