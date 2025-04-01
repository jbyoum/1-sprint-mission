import dotenv from 'dotenv';
import EnvVarError from '../lib/errors/EnvVarError';
dotenv.config();

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  throw new EnvVarError();
}

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const UPLOAD_FOLDER = 'public';
export const STATIC_PATH = '/public';
export const JWT_SECRET = process.env.JWT_SECRET;
export const ACCESS_TOKEN_STRING = 'access-token';
export const REFRESH_TOKEN_STRING = 'refresh-token';
export const LOCAL_STRING = 'local';
export const REFRESH_STRING = 'refresh';
export const PERIOD_ACCESS_TOKEN = '6h';
export const PERIOD_REFRESH_TOKEN = '2d';
