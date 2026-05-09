import mongoose from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually
const envPath = path.resolve('.env.local')
const envFile = fs.readFileSync(envPath, 'utf8')
envFile.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) return
  const key = trimmed.slice(0, eqIdx).trim()
  const val = trimmed.slice(eqIdx + 1).trim()
  process.env[key] = val
})

if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USERNAME')) {
  console.error('❌ ERROR: Please update MONGODB_URI in .env.local with your real MongoDB Atlas connection string!')
  process.exit(1)
}

console.log('🔗 Connecting to MongoDB...')
await mongoose.connect(process.env.MONGODB_URI)
console.log('✅ Connected!')

const UserSchema = new mongoose.Schema({
  name: String, email: String, role: String, addedBy: String,
  createdAt: { type: Date, default: Date.now }
})
const User = mongoose.models.User || mongoose.model('User', UserSchema)

const adminEmail = 'admin@targetacademy.edu.in'
const existing = await User.findOne({ email: adminEmail })

if (existing) {
  console.log('ℹ️  Admin already exists:', existing.email)
} else {
  await User.create({
    name: 'Principal Admin',
    email: adminEmail,
    role: 'Admin',
    addedBy: 'system'
  })
  console.log('✅ Admin created successfully!')
  console.log('   Email:', adminEmail)
  console.log('   Role:  Admin')
}

console.log('')
console.log('🚀 You can now run: npm run dev')
console.log('   Login at http://localhost:3000')
console.log('   Email:', adminEmail)

await mongoose.disconnect()
process.exit(0)
