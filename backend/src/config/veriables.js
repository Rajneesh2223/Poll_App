import dotenv from "dotenv";
dotenv.config();

export const PORT = Number(process.env.PORT);
export const DB_URL = process.env.DB_CONNECTION;
export const SALT = Number(process.env.SALT_ROUNDS);
export const JWT_PRIVATE = process.env.JWT_PRIVATE;
export const CLIENT_URL = process.env.CLIENT_URL;