import { connectDB } from '@/lib/mongodb'
import Student from '@/models/Student'
import { transporter } from '@/lib/mailer'
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

export async function POST(req) {
  try {
    const user = authUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { studentId } = await req.json()
    const s = await Student.findById(studentId)
    if (!s) return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    if (!s.email) return NextResponse.json({ error: 'Student has no email address.' }, { status: 400 })

    const gradeColors = { A: '#6366f1', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444' }
    const gc = gradeColors[s.grade] || '#6366f1'
    const subjectNames = {
      Mathematics: 'Mathematics', Science: 'Science', English: 'English',
      SocialStudies: 'Social Studies', ComputerSci: 'Computer Science', Hindi: 'Hindi'
    }
    const totalMax = Object.keys(s.marks).length * 100

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: s.email,
      subject: `📋 Result Declared — ${s.name} | Sem ${s.semester} | ${s.result}`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:620px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12)">

          <!-- HEADER -->
          <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6,#6366f1);padding:36px 32px;text-align:center">
            <div style="font-size:36px;margin-bottom:8px">🎓</div>
            <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px">Target Coaching Academy</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;letter-spacing:0.5px">OFFICIAL RESULT NOTIFICATION</p>
            <div style="margin-top:14px;display:inline-block;background:rgba(255,255,255,0.15);padding:6px 20px;border-radius:20px">
              <span style="color:#fff;font-size:13px;font-weight:600">Semester ${s.semester} Examination</span>
            </div>
          </div>

          <!-- BODY -->
          <div style="background:#ffffff;padding:32px">
            <p style="font-size:16px;color:#1e293b;margin-bottom:6px">Dear <strong>${s.name}</strong>,</p>
            <p style="color:#64748b;font-size:14px;line-height:1.7;margin-bottom:24px">
              Your result for <strong>Semester ${s.semester}</strong> has been officially declared. 
              Please find your complete academic performance report below.
            </p>

            <!-- RESULT HIGHLIGHT -->
            <div style="text-align:center;margin:24px 0;padding:24px;background:${s.result==='Pass'?'linear-gradient(135deg,#dcfce7,#bbf7d0)':'linear-gradient(135deg,#fee2e2,#fecaca)'};border-radius:14px;border:2px solid ${s.result==='Pass'?'#86efac':'#fca5a5'}">
              <div style="font-size:40px;margin-bottom:6px">${s.result==='Pass'?'🏆':'📚'}</div>
              <div style="font-size:32px;font-weight:800;color:${s.result==='Pass'?'#16a34a':'#dc2626'}">${s.result}</div>
              <div style="font-size:15px;color:${s.result==='Pass'?'#15803d':'#b91c1c'};margin-top:4px;font-weight:600">${s.percentage}% — Grade ${s.grade}</div>
            </div>

            <!-- STUDENT DETAILS -->
            <div style="background:#f8fafc;border-radius:12px;padding:22px;margin:20px 0;border:1px solid #e2e8f0">
              <h3 style="margin:0 0 14px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8">Student Details</h3>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:7px 0;color:#64748b;font-size:13px;width:140px">Student ID</td><td style="padding:7px 0;font-weight:600;color:#1e293b;font-size:13px">${s.studentId}</td></tr>
                <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Roll Number</td><td style="padding:7px 0;font-weight:600;color:#1e293b;font-size:13px">${s.rollNo}</td></tr>
                <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Department</td><td style="padding:7px 0;font-weight:600;color:#1e293b;font-size:13px">${s.department}</td></tr>
                <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Total Marks</td><td style="padding:7px 0;font-weight:700;color:#1e293b;font-size:15px">${s.totalMarks} / ${totalMax}</td></tr>
                <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Percentage</td><td style="padding:7px 0;font-weight:700;color:#1e293b;font-size:15px">${s.percentage}%</td></tr>
                <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Grade</td><td style="padding:7px 0"><span style="background:${gc}20;color:${gc};padding:4px 14px;border-radius:20px;font-weight:700;font-size:13px">${s.grade}</span></td></tr>
              </table>
            </div>

            <!-- SUBJECT MARKS -->
            <h3 style="color:#1e293b;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:14px">Subject-wise Performance</h3>
            <table style="width:100%;border-collapse:collapse">
              ${Object.entries(s.marks.toObject ? s.marks.toObject() : s.marks).map(([sub, mark]) => `
                <tr style="border-bottom:1px solid #f1f5f9">
                  <td style="padding:10px 0;color:#475569;font-size:13px;width:150px">${subjectNames[sub] || sub}</td>
                  <td style="padding:10px 0;font-weight:700;color:#1e293b;font-size:14px">${mark}<span style="color:#94a3b8;font-weight:400;font-size:12px">/100</span></td>
                  <td style="padding:10px 0 10px 14px">
                    <div style="background:#e2e8f0;border-radius:4px;height:7px;width:120px">
                      <div style="background:${mark>=40?'linear-gradient(90deg,#3b82f6,#6366f1)':'#ef4444'};width:${mark}%;height:7px;border-radius:4px"></div>
                    </div>
                  </td>
                  <td style="padding:10px 0;text-align:right"><span style="font-size:11px;color:${mark>=40?'#16a34a':'#dc2626'};font-weight:600">${mark>=40?'✓ Pass':'✗ Fail'}</span></td>
                </tr>`).join('')}
            </table>
          </div>

          <!-- FOOTER -->
          <div style="background:#f1f5f9;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0">
            <p style="color:#64748b;font-size:13px;margin:0;font-weight:500">Target Coaching Academy</p>
            <p style="color:#94a3b8;font-size:11px;margin:5px 0 0">This is an official automated result notification. Please do not reply to this email.</p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-result error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
