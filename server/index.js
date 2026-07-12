import dotenv from 'dotenv';
dotenv.config({override:true});
import express from 'express'; import mongoose from 'mongoose'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit'; import mongoSanitize from 'express-mongo-sanitize'; import morgan from 'morgan';
import authRoutes from './routes/auth.js'; import analysisRoutes from './routes/analyses.js'; import reportRoutes from './routes/reports.js'; import adminRoutes from './routes/admin.js';
const app=express();
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}})); app.use(cors({origin:(o,cb)=>!o||o===process.env.CLIENT_URL?cb(null,true):cb(new Error('Origin not allowed'),false),credentials:true})); app.use(rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true})); app.use(express.json({limit:'1mb'})); app.use(mongoSanitize()); app.use(morgan('tiny')); app.use('/uploads',express.static('uploads'));
app.get('/api/health',(_,res)=>res.json({ok:true,service:'ScamShield AI'})); app.use('/api/auth',authRoutes); app.use('/api/analyses',analysisRoutes); app.use('/api/reports',reportRoutes); app.use('/api/admin',adminRoutes);
app.use((err,req,res,next)=>{console.error(err.message); const status=err.status||(err.isJoi?400:500); res.status(status).json({message:err.isJoi?'Invalid request data':err.message||'Server error'});});
const port=process.env.PORT||5000; mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/scamshield').then(()=>app.listen(port,()=>console.log(`API listening on ${port}`))).catch(e=>{console.warn('MongoDB connection failed, starting server in offline mode:',e.message); app.listen(port,()=>console.log(`API listening on ${port} (OFFLINE MODE)`))});
