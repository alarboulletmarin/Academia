import dotenv from "dotenv";
import { resolve } from "path";

// Load .env or .env.local based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";
const envPath = resolve(process.cwd(), envFile);
dotenv.config({ path: envPath });

/**
 * Configuration object for the application.
 */
const config = {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  mongo: {
    dbName: process.env.MONGODB_DB_NAME,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    atlas_uri: process.env.MONGODB_ATLAS_URI,
  },
  security: {
    cors: {
      allowedOrigins: process.env.CORS_ALLOWED_ORIGINS
        ? process.env.CORS_ALLOWED_ORIGINS.split(",")
        : [],
    },
    jwt: {
      secret: process.env.JWT_SECRETKEY,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  },
};

const endpoints = {
  ASSIGNMENT_API: "/api/assignments",
};

export { config, endpoints };
