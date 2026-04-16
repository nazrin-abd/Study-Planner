import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const SECRET = process.env.JWT_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { identifier, password } = req.body // identifier = email or username

  if (!identifier || !password)
    return res.status(400).json({ error: 'All fields are required' })

  try {
    // Find user by email or username
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    )

    if (users.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' })

    const user = users[0]

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' })

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: '7d' }
    )

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; Path=/`)

    res.status(200).json({ message: 'Logged in', username: user.username })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}