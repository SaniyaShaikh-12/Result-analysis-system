import jwt from 'jsonwebtoken'

export function verifyToken(req) {
  const header = req.headers.get('authorization') || ''
  const token = header.replace('Bearer ', '').trim()
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export function calcResult(marks) {
  const vals = Object.values(marks)
  const total = vals.reduce((a, b) => a + b, 0)
  const max = vals.length * 100
  const pct = parseFloat(((total / max) * 100).toFixed(1))
  let grade = 'F'
  if (pct >= 90) grade = 'A'
  else if (pct >= 75) grade = 'B'
  else if (pct >= 60) grade = 'C'
  else if (pct >= 40) grade = 'D'
  return {
    totalMarks: total,
    percentage: pct,
    grade,
    result: pct >= 40 ? 'Pass' : 'Fail',
  }
}
