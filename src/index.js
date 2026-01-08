import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

connectDB().then(() => {
  app.listen(process.env.PORT || 3000);
});
