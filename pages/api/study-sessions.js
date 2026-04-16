import db from '../../lib/db'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM study_sessions WHERE user_id = ? ORDER BY date DESC', [user.id])
    return res.json({ data: rows })
  }
  if (req.method === 'POST') {
    const { subject, date, duration_minutes, notes } = req.body
    await db.query('INSERT INTO study_sessions (user_id, subject, date, duration_minutes, notes) VALUES (?,?,?,?,?)',
      [user.id, subject, date, duration_minutes, notes])
    return res.json({ ok: true })
  }
  if (req.method === 'DELETE') {
    await db.query('DELETE FROM study_sessions WHERE id = ? AND user_id = ?', [req.body.id, user.id])
    return res.json({ ok: true })
  }
}