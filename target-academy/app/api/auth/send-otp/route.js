import { connectDB } from '@/lib/mongodb'
import { transporter } from '@/lib/mailer'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectDB()
    const { email, role } = await req.json()
    if (!email || !role)
      return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 })

    const user = await User.findOne({ email: email.toLowerCase().trim(), role })
    if (!user)
      return NextResponse.json(
        { error: `This email is not registered as ${role}. Contact Admin.` },
        { status: 403 }
      )

    const otpCode = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await OTP.findOneAndDelete({ email: email.toLowerCase().trim() })
    await OTP.create({ email: email.toLowerCase().trim(), otp: otpCode, expiresAt })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Login OTP — Target Coaching Academy',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
          <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:30px;text-align:center">
            <h2 style="color:#fff;margin:0;font-size:22px;font-weight:700">🎓 Target Coaching Academy</h2>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px">Result Analysis System — Secure Login</p>
          </div>
          <div style="background:#ffffff;padding:32px;border:1px solid #e2e8f0;border-top:none">
            <p style="color:#1e293b;font-size:15px">Hello <strong>${user.name}</strong>,</p>
            <p style="color:#64748b;font-size:14px;line-height:1.6">Your one-time password for <strong>${role}</strong> access:</p>
            <div style="text-align:center;margin:28px 0;padding:22px;background:#f8fafc;border-radius:12px;border:2px dashed #c7d2fe">
              <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#6366f1;font-family:monospace">${otpCode}</span>
            </div>
            <p style="color:#94a3b8;font-size:12px;text-align:center">⏱ Valid for <strong>5 minutes</strong> only. Do not share this OTP.</p>
          </div>
          <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0">
            <p style="color:#cbd5e1;font-size:11px;margin:0">Target Coaching Academy · Automated Security Email · Do not reply</p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true, name: user.name })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
