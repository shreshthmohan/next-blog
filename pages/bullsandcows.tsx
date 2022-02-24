import { NextPage } from 'next'
import { BullsAndCows } from 'components/BullsAndCows'
import BNCCustomLayout from 'components/BullsAndCows/BNCCustomLayout'

const BNC: NextPage = () => {
  return (
    <BNCCustomLayout
      title="Bulls and Cows Game"
      description="A guessing game with hints at each step."
    >
      <BullsAndCows />
    </BNCCustomLayout>
  )
}

export default BNC
