import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/usersRoutes';

const app = express();

// const port = process.env.PORT || 3000;

app.use(express.json());
//Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
//autentication
//user
 console.log("Server running");

export default app;