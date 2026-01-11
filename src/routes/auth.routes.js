import { Router } from 'express';
import { login, register, requestOtp } from '../controllers/auth.controller.js';

const r = Router();
r.post('/login', login);
r.post('/register', register);
r.post("/request-otp", requestOtp);
export default r;