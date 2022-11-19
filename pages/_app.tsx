import '../styles/globals.css'
import 'components/BullsAndCows/styles.css'
import type { AppProps } from 'next/app'
import initAuth from '../initAuth'

initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
