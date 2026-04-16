import db from '../../lib/db'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC', [user.id])
    return res.json({ data: rows })
  }
  if (req.method === 'POST') {
    const { title, content } = req.body
    await db.query('INSERT INTO notes (user_id, title, content) VALUES (?,?,?)', [user.id, title, content])
    return res.json({ ok: true })
  }
  if (req.method === 'DELETE') {
    await db.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [req.body.id, user.id])
    return res.json({ ok: true })
  }
}