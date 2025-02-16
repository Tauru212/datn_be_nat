// Require user route
import express from 'express';
import userRoute from './routes/user';
import loginRoute from './routes/login';

const app = express();

// Dùng userRoute cho tất cả các route bắt đầu bằng '/users'
app.use('/users', userRoute);
app.use('/login', loginRoute);