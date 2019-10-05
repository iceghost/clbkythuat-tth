import dotenv from 'dotenv';
import 'regenerator-runtime/runtime';

dotenv.config();

export const { PORT, DATABASE_URL, DATABASE_SSL } = process.env;
