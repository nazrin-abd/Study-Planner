import db from '../../../lib/db'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, email, password } = req.body

  // Basic validation
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required' })

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'Invalid email format' })

  try {
    // Check if username or email already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    )
    if (existing.length > 0)
      return res.status(409).json({ error: 'Email or username already taken' })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    )

    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}