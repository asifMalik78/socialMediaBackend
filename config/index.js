import { config } from "dotenv";

config();

export const {
    MONGO_URI, APP_PORT, JWT_SECRET
} = process.env;