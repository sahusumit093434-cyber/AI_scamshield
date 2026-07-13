import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import reportRoutes from './routes/report.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Initialize env vars
dotenv.config();

// Connect database
connectDB();

const app = express();

// Trust reverse proxy (Vercel) for client IP detection in rate limiters
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // allow data URI screenshots in frontend
}));

app.use(cors({
  origin: '*', // open or configured client urls
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable caching for all API responses to prevent CORS 304 caching issues on serverless hosts
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// Apply rate limiter to all API endpoints
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ScamShield AI backend is fully functional' });
});

// Diagnostic DB connection endpoint
app.get('/api/test-db', async (req, res) => {
  const log = [];
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  log.push(`Using URI: ${uri ? uri.replace(/:[^@]+@/, ':****@') : 'undefined'}`);

  try {
    const { Resolver } = await import('dns/promises');
    const resolver = new Resolver();
    const hostname = uri ? uri.replace(/^mongodb(\+srv)?:\/\//, '').split(/[/?@]/)[0].split(',')[0].split(':')[0] : 'localhost';
    log.push(`Parsed hostname: ${hostname}`);
    
    const ips = await resolver.resolve4(hostname).catch(e => {
      log.push(`IPv4 Resolve Failed: ${e.message}`);
      return [];
    });
    log.push(`Resolved IPv4 IPs: ${ips.join(', ')}`);

    if (uri && uri.startsWith('mongodb+srv://')) {
      log.push(`Resolving SRV record for: _mongodb._tcp.${hostname}`);
      const srv = await resolver.resolveSrv(`_mongodb._tcp.${hostname}`).catch(e => {
        log.push(`SRV Resolve Failed: ${e.message}`);
        return [];
      });
      log.push(`Resolved SRV nodes: ${srv.map(s => `${s.name}:${s.port}`).join(', ')}`);
    }
  } catch (dnsErr) {
    log.push(`DNS check crashed: ${dnsErr.message}`);
  }

  try {
    log.push('Attempting mongoose connection with 4000ms timeout...');
    const mongooseModule = await import('mongoose');
    const mongooseInstance = await mongooseModule.default.createConnection(uri, {
      serverSelectionTimeoutMS: 4000,
      family: 4
    }).asPromise();
    log.push(`Successfully connected to host: ${mongooseInstance.host}`);
    await mongooseInstance.close();
  } catch (connErr) {
    log.push(`Mongoose connection failed: ${connErr.message}`);
  }

  res.status(200).json({ logs: log });
});

// Map routes
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.status || res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ScamShield AI Backend server running in development mode on port ${PORT}`);
});

export default app;
