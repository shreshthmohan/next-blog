// ./pages/api/login
import type { NextApiRequest, NextApiResponse } from 'next'
import { unsetAuthCookies } from 'next-firebase-auth'
import initAuth from '../../initAuth' // the module you created above
import type { Data } from './login'

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await unsetAuthCookies(req, res)
  } catch (e) {
    return res
      .status(500)
      .json({ error: `Unexpected error: ${JSON.stringify(e)}` })
  }
  return res.status(200).json({ success: true })
}

export default handler
