import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { conn } from "./../../server.js";

const router = express.Router();

dotenv.config();
let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// lấy các bài đăng nổi bật
// demo http://127.0.0.1:3000/api/post/highlight_mark/
router.get("/", (req, res) => {
  var account_id;
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);

    if (verified) {
      account_id = verified.account_id;
    }
  } catch (error) {}

  async function queryDatabase() {
    try {
      // Kết nối với cơ sở dữ liệu
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "re_state",
      });

      const [result] = await connection.execute(
        "SELECT posts.* FROM highlight_mark, posts  WHERE posts.post_id = highlight_mark.post_id AND posts.status = 'approved'"
      );
      for (var i = 0; i < result.length; i++) {
        const [images] = await connection.execute(
          "SELECT post_images.image FROM post_images WHERE post_images.post_id = " +
            result[i].post_id
        );
        result[i].images = images;
        if (account_id) {
          const [liked] = await connection.execute(
            "SELECT * FROM favorites WHERE favorites.post_id = " +
              result[i].post_id +
              " AND favorites.account_id = " +
              account_id
          );
          result[i].liked = liked.length != 0;
        } else {
          result[i].liked = false;
        }
      }

      await connection.end();

      res.json({
        success: true,
        message: "Lấy danh sách bản tin nổi bật thành công!",
        code: null,
        data: result,
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
  queryDatabase();
});

router.post("/add", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      console.log("account_id = " + account_id);
      if (!post_id || !account_id) {
        res.status(400).json({
          success: false,
          message: "Missing params",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      console.log("account_id 1= " + account_id);
      var hightightMark = {
        post_id: post_id
      };

      conn.query("SELECT * FROM highlight_mark WHERE post_id = ?", [post_id], function (err, result) {
        if (err) throw err;
        
        console.log("account_id 3 = " + account_id);
        if (result.length != 0) {
          res.json({
            success: true,
            message: "Bài đăng đã đẩy lên nội dung Tin nổi bật!",
            code: null,
          }); 
        } else {
          conn.query("INSERT INTO highlight_mark SET ?", hightightMark, function (err, result) {
            console.log("account_id 4 = " + account_id);
            if (err) throw err;
            res.json({
              success: true,
              message: "Bài đăng đã đẩy lên nội dung Tin nổi bật!",
              code: null,
            });
          });
        }
      });
    }
  } catch (error) {
    console.log("account_id 2 = " + error);
    // Access Denied
    return res.status(401).send(error);
  }
});

router.post("/remove", (req, res) => {
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

      conn.query("SELECT * FROM highlight_mark WHERE post_id = ?", [post_id], function (err, result) {
        if (err) throw err;
        
        if (result.length == 0) {
          res.json({
            success: true,
            message: "Bài đăng đã được gỡ khỏi Tin nổi bật!",
            code: null,
          }); 
        } else {
          conn.query("DELETE FROM highlight_mark WHERE post_id = ?", post_id, function (err, result) {
          
            if (err) throw err;
            res.json({
              success: true,
              message: "Bài đăng đã được gỡ khỏi Tin nổi bật!",
              code: null,
            });
          });
        }
      });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

export default router;
