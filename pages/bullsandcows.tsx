import Container from 'components/Container'
import { NextPage } from 'next'
import { BullsAndCows } from 'components/BullsAndCows'

const BNC: NextPage = () => {
  return (
    <Container>
      <BullsAndCows />
    </Container>
  )
}

export default BNC
