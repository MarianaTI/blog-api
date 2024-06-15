import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const port = process.env.port;
export const SECRET_KEY = process.env.SECRET_KEY;

export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const CLOUD_NAME = process.env.CLOUD_NAME;
