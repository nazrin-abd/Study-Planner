export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Max-Age=0; Path=/')
  res.status(200).json({ message: 'Logged out' })
}