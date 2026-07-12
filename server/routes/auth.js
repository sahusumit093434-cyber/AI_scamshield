import {Router} from 'express'; 
import Joi from 'joi'; 
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; 
import {protect} from '../middleware/auth.js'; 
import {inMemoryUsers} from '../mockDb.js';

const r = Router(); 
const token = u => jwt.sign({id: u._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}); 
const shape = Joi.object({
  name: Joi.string().max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
});

r.post('/register', async(req, res, next) => {
  try {
    const v = await shape.validateAsync(req.body);

    if (mongoose.connection.readyState === 1) {
      if (await User.exists({email: v.email})) {
        return res.status(409).json({message: 'Email already registered'});
      }
      const u = await User.create(v);
      return res.status(201).json({token: token(u), user: {id: u._id, name: u.name, email: u.email, role: u.role}});
    } else {
      console.log('Registering user in-memory.');
      const exists = inMemoryUsers.some(u => u.email.toLowerCase() === v.email.toLowerCase());
      if (exists) {
        return res.status(409).json({message: 'Email already registered'});
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(v.password, salt);

      const u = {
        _id: `mock_user_${Date.now()}`,
        name: v.name,
        email: v.email.toLowerCase(),
        password: hashedPassword,
        role: inMemoryUsers.length === 0 ? 'admin' : 'user',
        createdAt: new Date()
      };
      inMemoryUsers.push(u);
      return res.status(201).json({token: token(u), user: {id: u._id, name: u.name, email: u.email, role: u.role}});
    }
  } catch (e) {
    next(e);
  }
}); 

r.post('/login', async(req, res, next) => {
  try {
    const {email, password} = await Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }).validateAsync(req.body);

    if (mongoose.connection.readyState === 1) {
      const u = await User.findOne({email}).select('+password');
      if (!u || !await u.comparePassword(password)) {
        return res.status(401).json({message: 'Invalid email or password'});
      }
      return res.json({token: token(u), user: {id: u._id, name: u.name, email: u.email, role: u.role}});
    } else {
      console.log('Logging in user in-memory.');
      const u = inMemoryUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (!u) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      const isMatch = bcrypt.compareSync(password, u.password);
      if (!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      return res.json({token: token(u), user: {id: u._id, name: u.name, email: u.email, role: u.role}});
    }
  } catch (e) {
    next(e);
  }
}); 

r.get('/me', protect, (req, res) => res.json({user: req.user})); 

export default r;
