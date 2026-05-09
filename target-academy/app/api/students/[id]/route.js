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

export async function PUT(req, { params }) {
  try {
    const user = authUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const body = await req.json()
    const calculated = calcResult(body.marks)
    const student = await Student.findByIdAndUpdate(
      params.id,
      { ...body, ...calculated },
      { new: true }
    )
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    return NextResponse.json(student)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = authUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'Admin')
      return NextResponse.json({ error: 'Only Admin can delete students.' }, { status: 403 })
    await connectDB()
    await Student.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
