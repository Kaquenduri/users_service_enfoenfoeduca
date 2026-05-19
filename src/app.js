import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';

import studentRoutes from './routes/student.crud.routes.js';
import teacherRoutes from './routes/teacher.crud.routes.js';
import parentRoutes from './routes/parent.crud.routes.js';
import { apiLimiter } from './middleware/rate_limit.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.set('trust proxy', 1);

app.use(apiLimiter);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/parents', parentRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});