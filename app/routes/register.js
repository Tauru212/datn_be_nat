import express from "express";
const router = express.Router();

import { conn } from "./../../server.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// API register
router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var email = req.body.email;
  var password = req.body.password;
  var role = req.body.role;
  var name = req.body.name;

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
  if (!name) {
    res.status(400).json({
      success: false,
      message: "Vui lòng truyền Tên",
      code: "NAME_ERROR",
      data: null,
    });
    return;
  }
  if (!role) {
    role = "user";
  }

  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (err, rows, fields) {
      if (err) throw err;

      if (rows.length <= 0) {
        // Encryption of the string password
        bcrypt.genSalt(10, function (err, Salt) {
          // The bcrypt is used for encrypting password.
          bcrypt.hash(password, Salt, function (err, hash) {
            if (err) {
              return console.log("Cannot encrypt");
            }
            var user = {
              email: email.trim(),
              password: hash.trim(),
              role: role.trim(),
              name: name.trim(),
            };
            conn.query("INSERT INTO users SET ?", user, function (err, result) {
              if (err) throw err;
              let jwtSecretKey = process.env.JWT_SECRET_KEY;
              let data = {
                  time: Date(),
                  account_id: result.insertId,
              }
              let token =  {
                access_token : jwt.sign(data, jwtSecretKey)
              };
              res.status(201).json({
                success: true,
                message: "Đăng ký tài khoản thành công!",
                code: null,
                data: token,
              });
            });
          });
        });
      } else {
        // if user found
        res.status(401).json({
          success: false,
          message: "Tài khoản email đã tồn tại",
          code: "REGISTER_ERROR",
          data: null,
        });
      }
    }
  );
});

export default router;
