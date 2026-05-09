import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  role:      { type: String, enum: ['Admin', 'Faculty'], required: true },
  addedBy:   { type: String, default: 'system' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
