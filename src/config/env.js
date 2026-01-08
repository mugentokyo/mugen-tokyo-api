import 'dotenv/config';
export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
};
