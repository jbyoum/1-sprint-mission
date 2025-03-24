import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const UPLOAD_FOLDER = 'public';
export const STATIC_PATH = '/public';
export const JWT_SECRET = process.env.JWT_SECRET;
