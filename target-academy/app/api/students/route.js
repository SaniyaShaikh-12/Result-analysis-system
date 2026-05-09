import { connectDB } from '@/lib/mongodb'
import Student from '@/models/Student'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

function calcResult(marks) {
  const vals = Object.values(marks)
  const total = vals.reduce((a, b) => a + b, 0)
  const max = vals.length * 100
  const pct = parseFloat(((total / max) * 100).toFixed(1))
  let grade = 'F'
  if (pct >= 90) grade = 'A'
  else if (pct >= 75) grade = 'B'
  else if (pct >= 60) grade = 'C'
  else if (pct >= 40) grade = 'D'
  return { totalMarks: total, percentage: pct, grade, result: pct >= 40 ? 'Pass' : 'Fail' }
}

function authUser(req) {
  try {
    const header = req.headers.get('authorization') || ''
    const token = header.replace('Bearer ', '').trim()
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch { return null }
}

export async function GET(req) {
  try {
    const user = authUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { searchParams } = new URL(req.url)
    const filter = {}
    const dept = searchParams.get('dept')
    const sem = searchParams.get('sem')
    const q = searchParams.get('q')
    if (dept) filter.department = dept
    if (sem) filter.semester = sem
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { rollNo: { $regex: q, $options: 'i' } }
    ]
    const students = await Student.find(filter).sort({ createdAt: -1 })
    return NextResponse.json(students)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const user = authUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const body = await req.json()
    if (!body.studentId || !body.name || !body.rollNo || !body.email)
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    const calculated = calcResult(body.marks)
    const student = await Student.create({ ...body, ...calculated, addedBy: user.email })
    return NextResponse.json(student, { status: 201 })
  } catch (err) {
    if (err.code === 11000)
      return NextResponse.json({ error: 'Student ID already exists.' }, { status: 400 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
