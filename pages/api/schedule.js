import db from '../../lib/db'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM schedule WHERE user_id = ?', [user.id])
    return res.json({ data: rows })
  }
  if (req.method === 'POST') {
    const { subject, day, start_time, end_time } = req.body
    await db.query('INSERT INTO schedule (user_id, subject, day, start_time, end_time) VALUES (?,?,?,?,?)',
      [user.id, subject, day, start_time, end_time])
    return res.json({ ok: true })
  }
  if (req.method === 'DELETE') {
    await db.query('DELETE FROM schedule WHERE id = ? AND user_id = ?', [req.body.id, user.id])
    return res.json({ ok: true })
  }
}