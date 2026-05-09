import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import OTP from '@/models/OTP'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectDB()
    const { email, otp, role } = await req.json()

    const record = await OTP.findOne({ email: email.toLowerCase().trim(), used: false })
    if (!record)
      return NextResponse.json({ error: 'OTP not found or already used.' }, { status: 400 })

    if (new Date() > record.expiresAt)
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })

    if (record.otp !== String(otp).trim())
      return NextResponse.json({ error: 'Invalid OTP. Please check and try again.' }, { status: 400 })

    await OTP.findByIdAndUpdate(record._id, { used: true })

    const user = await User.findOne({ email: email.toLowerCase().trim(), role })
    if (!user)
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    const token = jwt.sign(
      { email: user.email, role: user.role, name: user.name, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: { name: user.name, role: user.role, email: user.email }
    })
  } catch (err) {
    console.error('verify-otp error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
