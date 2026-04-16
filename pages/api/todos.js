import db from '../../lib/db'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY deadline ASC', [user.id])
    return res.json({ data: rows })
  }
  if (req.method === 'POST') {
    const { title, type, deadline } = req.body
    await db.query('INSERT INTO todos (user_id, title, type, deadline) VALUES (?,?,?,?)',
      [user.id, title, type, deadline || null])
    return res.json({ ok: true })
  }
  if (req.method === 'PATCH') {
    await db.query('UPDATE todos SET done = ? WHERE id = ? AND user_id = ?', [req.body.done, req.body.id, user.id])
    return res.json({ ok: true })
  }
  if (req.method === 'DELETE') {
    await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.body.id, user.id])
    return res.json({ ok: true })
  }
}