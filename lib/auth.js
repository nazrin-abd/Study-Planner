import jwt from 'jsonwebtoken'

export function getUserFromRequest(req) {
  try {
    // Try both ways to get the cookie
    const cookieHeader = req.headers.cookie || ''
    const token = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1]

    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}