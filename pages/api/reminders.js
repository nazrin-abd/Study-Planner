import db from '../../lib/db'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at ASC', [user.id])
    return res.json({ data: rows })
  }
  if (req.method === 'POST') {
    const { title, remind_at } = req.body
    await db.query('INSERT INTO reminders (user_id, title, remind_at) VALUES (?,?,?)', [user.id, title, remind_at])
    return res.json({ ok: true })
  }
  if (req.method === 'PATCH') {
    await db.query('UPDATE reminders SET done = ? WHERE id = ? AND user_id = ?', [req.body.done, req.body.id, user.id])
    return res.json({ ok: true })
  }
  if (req.method === 'DELETE') {
    await db.query('DELETE FROM reminders WHERE id = ? AND user_id = ?', [req.body.id, user.id])
    return res.json({ ok: true })
  }
  if (req.method === 'POST') {
  const { title, remind_at } = req.body
  if (!title || !remind_at) {
    return res.status(400).json({ error: 'Title and time are required' })
  }
  await db.query('INSERT INTO reminders (user_id, title, remind_at) VALUES (?,?,?)', [user.id, title, remind_at])
  return res.json({ ok: true })
}
}