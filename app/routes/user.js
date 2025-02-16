import express from "express";

const router = express.Router();

import { conn } from "./../../server.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let jwtSecretKey = process.env.JWT_SECRET_KEY;

router.post("/update", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let name = req.body.name;
  let phone = req.body.phone;
  let avatar = req.body.avatar;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let account_id = req.body.account_id;

  console.log("update: name = " + name);
  console.log("update: phone = " + phone);
  console.log("update: avatar = " + avatar);
  console.log("update: birthday = " + birthday);
  console.log("update: gender = " + gender);
  console.log("update: account_id = " + account_id);

  conn.query(
    "UPDATE users SET name = ?, phone = ?, avatar = ?, birthday = ?, gender = ? WHERE account_id = ?",
    [name, phone, avatar, birthday, gender, account_id],
    function (err, rows, fields) {
      if (err) {
        res.json({
          success: false,
          message: err.message,
          code: "UPDATE_USER_ERROR",
          data: null,
        });
        return;
      }
      res.json({
        success: true,
        message: "Cập nhật thành công",
        code: null,
      });
    }
  );
});

router.get("/", (req, res) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      var account_id = verified.account_id

      if (!account_id) {
        const data = {
          success: false,
          message: "Vui lòng cung cấp account_id",
          code: "ID_MISSING_ERROR",
          data: null,
        };
        res.status(400).json(data);
        return;
      }

      conn.query(
        "SELECT * FROM users WHERE account_id = ?",
        [account_id],
        function (err, rows, fields) {
          if (err) {
            return res.status(401).send(err);
          }

          var user = {
            account_id: rows[0].account_id,
            email: rows[0].email,
            role: rows[0].role,
            name: rows[0].name,
            phone: rows[0].phone,
            avatar: rows[0].avatar,
            birthday: rows[0].birthday,
            gender: rows[0].gender,
          };
          const data = {
            success: true,
            message: "OK",
            code: null,
            data: user,
          };
          return res.status(200).json(data);
        }
      );
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

router.get("/get_others", (req, res) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      var account_id = verified.account_id

      if (!account_id) {
        const data = {
          success: false,
          message: "Vui lòng cung cấp account_id",
          code: "ID_MISSING_ERROR",
          data: null,
        };
        res.status(400).json(data);
        return;
      }

      conn.query(
        "SELECT account_id, email, role, name, phone, address, avatar, birthday, gender, create_at FROM users WHERE NOT account_id = ?",
        [account_id],
        function (err, rows, fields) {
          if (err) {
            return res.status(401).send(err);
          }
          const data = {
            success: true,
            message: "OK",
            code: null,
            data: rows,
          };
          return res.status(200).json(data);
        }
      );
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

router.get("/info/:account_id", (req, res) => {
  var account_id = req.params.account_id;
  console.log("ASDASD: " + account_id);
  conn.query(
    "SELECT * FROM users WHERE account_id = ?",
    [account_id],
    function (err, rows, fields) {
      if (err) {
        return res.status(401).send(err);
      }

      var user = {
        account_id: rows[0].account_id,
        email: rows[0].email,
        role: rows[0].role,
        name: rows[0].name,
        phone: rows[0].phone,
        avatar: rows[0].avatar,
        birthday: rows[0].birthday,
        gender: rows[0].gender,
      };
      const data = {
        success: true,
        message: "OK",
        code: null,
        data: user,
      };
      return res.status(200).json(data);
    }
  );
});

export default router;
