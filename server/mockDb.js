import bcrypt from 'bcryptjs';

export const inMemoryUsers = [];
export const inMemoryAnalyses = [];
export const inMemoryReports = [];

// Seed demo admin account
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('password123', salt);

inMemoryUsers.push({
  _id: 'mock_admin_123',
  name: 'Demo Admin',
  email: 'admin@scamshield.ai',
  password: hashedPassword,
  role: 'admin',
  status: 'active',
  createdAt: new Date()
});
