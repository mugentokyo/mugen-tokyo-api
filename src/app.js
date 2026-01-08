import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: ["https://mugen-tokyo.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.type('text').send('BACKEND CONNECTED');
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api', routes);

export default app;
