import { getUserFromRequest } from '../../../lib/auth'
import { startCron } from '../../../lib/cron'

startCron() // starts once, ignored after that

export default function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Not logged in' })
  res.status(200).json({ username: user.username, id: user.id })
}