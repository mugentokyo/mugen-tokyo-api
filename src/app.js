import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.type('text').send('BACKEND CONNECTED');
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api', routes);

export default app;