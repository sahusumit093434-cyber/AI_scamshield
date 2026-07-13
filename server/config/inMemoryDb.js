// In-Memory Fallback Database Store
// Used when MongoDB server is offline/disconnected.
// Enables seamless demoing and local running without setting up databases.

export const inMemoryUsers = [];
export const inMemoryAnalyses = [];
export const inMemoryReports = [];
export const inMemoryBlockedUrls = [];

// Seed default admin account in memory so preview starts with a logged-in user or easy access
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('password123', salt);

inMemoryUsers.push({
  _id: 'mock_admin_id_00000000000000000001',
  name: 'Demo Administrator',
  email: 'admin@scamshield.ai',
  password: hashedPassword,
  role: 'admin',
  status: 'active',
  totalAnalyses: 2,
  totalReports: 1,
  createdAt: new Date()
});

inMemoryUsers.push({
  _id: 'mock_user_id_00000000000000000002',
  name: 'Demo Security Agent',
  email: 'agent@scamshield.ai',
  password: hashedPassword,
  role: 'user',
  status: 'active',
  totalAnalyses: 0,
  totalReports: 0,
  createdAt: new Date()
});
