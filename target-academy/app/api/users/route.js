import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

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
    if (!user || user.role !== 'Admin')
      return NextResponse.json({ error: 'Admin access only.' }, { status: 403 })
    await connectDB()
    const users = await User.find().sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const user = authUser(req)
    if (!user || user.role !== 'Admin')
      return NextResponse.json({ error: 'Admin access only.' }, { status: 403 })
    await connectDB()
    const body = await req.json()
    if (!body.name || !body.email || !body.role)
      return NextResponse.json({ error: 'Name, email and role are required.' }, { status: 400 })
    const newUser = await User.create({ ...body, addedBy: user.email })
    return NextResponse.json(newUser, { status: 201 })
  } catch (err) {
    if (err.code === 11000)
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 400 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const user = authUser(req)
    if (!user || user.role !== 'Admin')
      return NextResponse.json({ error: 'Admin access only.' }, { status: 403 })
    await connectDB()
    const { id } = await req.json()
    await User.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
