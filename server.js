// server.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

import postRoutes from "./app/routes/post.js";
import userRoutes from "./app/routes/user.js";
import loginRoute from './app/routes/login.js';
import registerRoute from './app/routes/register.js';
import fileUploadRoute from './app/routes/fileUpload.js';
import highlightMarkRoute from './app/routes/highlight_mark.js';
import favoriteRoute from './app/routes/favorite.js';
import cors from "cors";

const app = express();

app.use(bodyParser.json());

app.use("/api/post", postRoutes);
app.use("/api/users", userRoutes);
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/file-upload', fileUploadRoute);
app.use('/api/highlight_mark', highlightMarkRoute);
app.use('/api/favorite', favoriteRoute);
app.use('/uploads', express.static('uploads'));

// netstat -ano | findstr :3000
// taskkill /PID [[code]] /F

dotenv.config();

let PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:` + PORT)
);
app.use(cors())

// // Generating JWT
// app.post("/user/generateToken", (req, res) => {
//   // Validate User Here
//   // Then generate JWT Token

//   let jwtSecretKey = process.env.JWT_SECRET_KEY;
//   let data = {
//       time: Date(),
//       userId: 12,
//   }

//   const token = jwt.sign(data, jwtSecretKey);
//   res.send(token);
// });

export const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "re_state",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

export default { conn: conn }
