import Mace from 'components/Charts/Mace'
import MetaHead from 'components/MetaHead'
import { NextPage } from 'next'

const Happiness: NextPage = () => {
  const meta = {
    title: 'Happiness Economics',
    description:
      "How does change in a country's GDP affect the happiness of its citizens",
  }
  return (
    <div className="min-h-full font-sans">
      <MetaHead {...meta} />
      <Mace />
    </div>
  )
}
export default Happiness
