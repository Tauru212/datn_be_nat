import express from "express";

const router = express.Router();

import { conn } from "./../../server.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// yêu thích bài đăng
// demo http://127.0.0.1:3000/api/favorite/like
router.post("/like", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      if (!post_id || !account_id) {
        res.status(400).json({
          success: false,
          message: "Missing params",
          code: "ERROR001",
          data: null,
        });
        return;
      }

      var favorite = {
        post_id: post_id,
        account_id: account_id,
      };

      conn.query("SELECT * FROM favorites WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        
        if (result.length != 0) {
          res.json({
            success: true,
            message: "Đã yêu thích bài đăng!",
            code: null,
          }); 
        } else {
          conn.query("INSERT INTO favorites SET ?", favorite, function (err, result) {
            if (err) throw err;
            res.json({
              success: true,
              message: "Đã yêu thích bài đăng!",
              code: null,
            });
          });
        }
      });
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

// hủy yêu thích bài đăng
// demo http://127.0.0.1:3000/api/favorite/un_like
router.post("/un_like", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      if (!post_id || !account_id) {
        res.status(400).json({
          success: false,
          message: "Missing params",
          code: "ERROR001",
          data: null,
        });
        return;
      }

      var favorite = {
        post_id: post_id,
        account_id: account_id,
      };

      conn.query("DELETE FROM favorites WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Hủy bỏ yêu thích bài đăng!",
          code: null,
        });
      });
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

export default router;