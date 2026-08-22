import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// Access Token Functions (short-lived)
export const jwtSign = (payload: any, opts?: jwt.SignOptions) => 
  jwt.sign(payload, env.JWT_ACCESS_SECRET, opts);

export const jwtVerify = (token: string) => 
  jwt.verify(token, env.JWT_ACCESS_SECRET);

// Refresh Token Functions (long-lived)
export const jwtSignRefresh = (payload: any, opts?: jwt.SignOptions) => 
  jwt.sign(payload, env.JWT_REFRESH_SECRET, opts);

export const jwtVerifyRefresh = (token: string) => 
  jwt.verify(token, env.JWT_REFRESH_SECRET);
