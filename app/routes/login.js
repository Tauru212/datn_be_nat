import express from "express";
const router = express.Router();

import { conn } from "./../../server.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// API login
router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var email = req.body.email;
  var password = req.body.password;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Vui lòng truyền địa chỉ email",
      code: "EMAIL_ERROR",
      data: null,
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      success: false,
      message: "Vui lòng truyền mật khẩu",
      code: "PASSWORD_ERROR",
      data: null,
    });
    return;
  }
  conn.query(
    "SELECT account_id, password FROM users WHERE email = ?",
    [email],
    function (err, rows, fields) {
      if (err) throw err;

      if (rows.length <= 0) {
        // if user not found
        res.status(404).json({
          success: false,
          message: "Email không tồn tại!",
          code: "LOGIN_ERROR_1",
          data: null,
        });
      } else {
        // if user found
        bcrypt.genSalt(10, function (err, Salt) {
          bcrypt.compare(
            password,
            rows[0].password,
            async function (err, isMatch) {
              // Comparing the original password to
              // encrypted password
              if (isMatch) {
                
                let data = {
                  time: Date(),
                  account_id: rows[0].account_id,
                };
                const token = {
                  access_token: jwt.sign(data, jwtSecretKey),
                };
                res.status(200).json({
                  success: true,
                  message: "OK",
                  code: null,
                  data: token,
                });
                return;
              }

              if (!isMatch) {
                res.status(401).json({
                  success: false,
                  message: "Mật khẩu không chính xác!",
                  code: "LOGIN_ERROR_1",
                  data: null,
                });
              }
            }
          );
        });
        // let jwtSecretKey = process.env.JWT_SECRET_KEY;
        // var user = {
        //   account_id: rows[0].account_id,
        //   email: email.trim(),
        //   role: rows[0].role,
        //   name: rows[0].name,
        //   phone: rows[0].phone,
        //   avatar: rows[0].avatar,
        //   birthday: rows[0].birthday,
        //   gender: rows[0].gender,
        // };

        // let jwtToken =  {
        //   access_token : token
        // };
        // res.json({
        //   success: true,
        //   message: "OK",
        //   code: null,
        //   data: jwtToken,
        // });
      }
    }
  );
});

export default router;
