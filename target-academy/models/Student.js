import mongoose from 'mongoose'

const StudentSchema = new mongoose.Schema({
  studentId:  { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  rollNo:     { type: String, required: true },
  email:      { type: String, required: true },
  department: { type: String, required: true },
  semester:   { type: String, required: true },
  marks: {
    Mathematics:   { type: Number, default: 0 },
    Science:       { type: Number, default: 0 },
    English:       { type: Number, default: 0 },
    SocialStudies: { type: Number, default: 0 },
    ComputerSci:   { type: Number, default: 0 },
    Hindi:         { type: Number, default: 0 },
  },
  totalMarks:  { type: Number, default: 0 },
  percentage:  { type: Number, default: 0 },
  grade:       { type: String, default: 'F' },
  result:      { type: String, enum: ['Pass', 'Fail'], default: 'Fail' },
  addedBy:     { type: String, default: 'admin' },
  createdAt:   { type: Date, default: Date.now },
})

export default mongoose.models.Student || mongoose.model('Student', StudentSchema)
