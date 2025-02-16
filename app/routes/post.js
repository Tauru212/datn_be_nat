import express from "express";
import mysql from "mysql2/promise";
import { conn } from "./../../server.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const router = express.Router();

dotenv.config();
let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// lấy thông tin chi tiết bài đăng
// demo: http://127.0.0.1:3000/api/post/2
// router.get("/:post_id", async (req, res) => {
//   console.log("call get_all3")
//   var post_id = req.params.post_id;
//   if (!post_id) {
//     const data = {
//       success: false,
//       message: "Vui lòng cung cấp post_id",
//       code: "ID_MISSING_ERROR",
//       data: null,
//     };
//     res.json(data);
//     return;
//   }

//   conn.query(
//     "SELECT * FROM posts WHERE post_id = ?",
//     [post_id],
//     function (err, rows, fields) {
//       if (err) throw err;

//       res.json({
//         success: true,
//         data: rows,
//       });
//     }
//   );
// });

// lấy thông tin bài đăng
// demo: http://127.0.0.1:3000/api/post/?account_id=2&status=processing
router.get("/", async (req, res) => {
  var status = req.param("status");
  var account_id = req.param("account_id");

  async function queryDatabase() {
    try {
      // Kết nối với cơ sở dữ liệu
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "re_state",
      });

      var q = "";
      if (!account_id) {
        q = "SELECT * FROM posts WHERE status = '" + status + "'";
      } else {
        q = "SELECT * FROM posts WHERE status = '" + status + "' AND account_id = " + account_id + "";
      }

      console.log("query = " + q);
    
      const [result] = await connection.execute(q);
      for (var i = 0; i < result.length; i++) {
        const [images] = await connection.execute(
          "SELECT post_images.image FROM post_images WHERE post_images.post_id = " +
            result[i].post_id
        );
        result[i].images = images;
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

// đẩy bài đăng mới
// demo http://127.0.0.1:3000/api/post/
router.post("/", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_type = req.body.post_type;
      console.log("post_type" + post_type);
      let city_id = req.body.city_id;
      console.log("city_id" + city_id);
      let district_id = req.body.district_id;
      let commune_id = req.body.commune_id;
      let address = req.body.address;
      let re_state_type = req.body.re_state_type;
      let acreage = req.body.acreage;
      let price = req.body.price;

      let legal_documents = req.body.legal_documents;
      let interior = req.body.interior;
      let n_bedrooms = req.body.n_bedrooms;
      let n_bathrooms = req.body.n_bathrooms;
      let direction = req.body.direction;

      let account_id = verified.account_id;
      let contacts_name = req.body.contacts_name;
      let contacts_email = req.body.contacts_email;
      let contacts_phone = req.body.contacts_phone;
      let title = req.body.title;
      let description = req.body.description;

      var status = "processing";
      if (req.body.status) status = req.body.status;

      if (!post_type) {
        res.status(400).json({
          success: false,
          message: "Vui lòng truyền loại bất động sản",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!city_id || !district_id || !commune_id) {
        res.status(400).json({
          success: false,
          message: "Vui lòng truyền địa chỉ bất động sản",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!re_state_type) {
        res.status(400).json({
          success: false,
          message: "Vui lòng truyền loại tin bạn cần đăng",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!acreage) {
        res.status(400).json({
          success: false,
          message: "Vui lòng điền diện tích sử dụng",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!price) {
        res.status(400).json({
          success: false,
          message: "Vui lòng điền giá tiền",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!account_id) {
        res.status(400).json({
          success: false,
          message: "AccountID is null",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!contacts_name || !contacts_phone) {
        res.status(400).json({
          success: false,
          message: "Vui lòng truyền thông tin liên hệ",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!title) {
        res.status(400).json({
          success: false,
          message: "Vui lòng nhập tiêu đề",
          code: "ERROR001",
          data: null,
        });
        return;
      }
      if (!description) {
        res.status(400).json({
          success: false,
          message: "Vui lòng nhập mô tả",
          code: "ERROR001",
          data: null,
        });
        return;
      }

      var post = {
        post_type: post_type,
        city_id: city_id,
        district_id: district_id,
        commune_id: commune_id,
        address: address,
        re_state_type: re_state_type,
        acreage: acreage,
        price: price,

        legal_documents: legal_documents,
        interior: interior,
        n_bedrooms: n_bedrooms,
        n_bathrooms: n_bathrooms,
        direction: direction,

        account_id: account_id,
        contacts_name: contacts_name,
        contacts_email: contacts_email,
        contacts_phone: contacts_phone,
        title: title,
        description: description,
        status: status,
      };

      conn.query("INSERT INTO posts SET ?", post, function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Đăng tin thành công!",
          code: null,
          data: result.insertId
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

// đẩy hinh anh trong bai dang
// demo http://127.0.0.1:3000/api/post/
router.post("/images", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let post_id = req.body.post_id;
  let image = req.body.image;

  if (!post_id) {
    res.status(400).json({
      success: false,
      message: "Vui lòng truyền post_id",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!image) {
    res.status(400).json({
      success: false,
      message: "Vui lòng truyền image",
      code: "ERROR001",
      data: null,
    });
    return;
  }

  var json = {
    post_id: post_id,
    image: image
  };

  conn.query("INSERT INTO post_images SET ?", json, function (err, result) {
    if (err) throw err;
    res.json({
      success: true,
      message: "Đăng ảnh thành công!",
      code: null,
    });
  });
});

// cập nhật bài đăng
// demo http://127.0.0.1:3000/api/post/update/
router.put("/update", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let post_id = req.body.post_id;
  let post_type = req.body.post_type;
  let city_id = req.body.city_id;
  let district_id = req.body.district_id;
  let commune_id = req.body.commune_id;
  let address = req.body.address;
  let re_state_type = req.body.re_state_type;
  let acreage = req.body.acreage;
  let price = req.body.acreage;

  let legal_documents = req.body.legal_documents;
  let interior = req.body.interior;
  let n_bedrooms = req.body.n_bedrooms;
  let n_bathrooms = req.body.n_bathrooms;
  let direction = req.body.direction;

  let account_id = req.body.account_id;
  let contacts_name = req.body.contacts_name;
  let contacts_email = req.body.contacts_email;
  let contacts_phone = req.body.contacts_phone;
  let title = req.body.title;
  let description = req.body.description;

  var status = "processing";
  if (req.body.status) status = req.body.status;

  if (!post_type) {
    res.json({
      success: false,
      message: "Vui lòng truyền loại bất động sản",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!city_id || !district_id || !commune_id) {
    res.json({
      success: false,
      message: "Vui lòng truyền địa chỉ bất động sản",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!re_state_type) {
    res.json({
      success: false,
      message: "Vui lòng truyền loại tin bạn cần đăng",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!acreage) {
    res.json({
      success: false,
      message: "Vui lòng điền diện tích sử dụng",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!price) {
    res.json({
      success: false,
      message: "Vui lòng điền giá tiền",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!account_id) {
    res.json({
      success: false,
      message: "AccountID is null",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!contacts_name || !contacts_phone) {
    res.json({
      success: false,
      message: "Vui lòng truyền thông tin liên hệ",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!title) {
    res.json({
      success: false,
      message: "Vui lòng nhập tiêu đề",
      code: "ERROR001",
      data: null,
    });
    return;
  }
  if (!description) {
    res.json({
      success: false,
      message: "Vui lòng nhập mô tả",
      code: "ERROR001",
      data: null,
    });
    return;
  }

  var post = {
    post_type: post_type,
    city_id: city_id,
    district_id: district_id,
    commune_id: commune_id,
    address: address,
    re_state_type: re_state_type,
    acreage: acreage,
    price: price,

    legal_documents: legal_documents,
    interior: interior,
    n_bedrooms: n_bedrooms,
    n_bathrooms: n_bathrooms,
    direction: direction,

    account_id: account_id,
    contacts_name: contacts_name,
    contacts_email: contacts_email,
    contacts_phone: contacts_phone,
    title: title,
    description: description,
    status: status,
  };

  conn.query("INSERT INTO posts SET ?", post, function (err, result) {
    if (err) throw err;
    res.json({
      success: true,
      message: "Đăng tin thành công!",
      code: null,
    });
  });
});

// gỡ bài đăng
// demo http:////127.0.0.1:3000/api/post/cancel/
router.put("/cancel", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      conn.query("UPDATE posts SET status = `remove_post` WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Gỡ bài đăng thành công!",
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

// admin duyệt bài đăng
// demo http:////127.0.0.1:3000/api/post/cancel/
router.put("/approved", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      conn.query("UPDATE posts SET status = 'approved' WHERE post_id = ?", [post_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Duyệt bài đăng thành công!",
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

// user muốn gỡ tin
router.put("/removePost", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;
      console.log("post_id = " + post_id);
      console.log("account_id = " + account_id);
      conn.query("UPDATE posts SET status = 'remove_post' WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Duyệt bài đăng thành công!",
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

// user muốn đẩy tin lại: trước đó đã gỡ giờ muốn hiển thị lại: status: remove_post -> progress
router.put("/processing", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      conn.query("UPDATE posts SET status = 'processing' WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Duyệt bài đăng thành công!",
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

// user muốn đẩy tin lại: trước đó đã cho thuê muốn hiển thị lại: state: rented -> advertisement
router.put("/advertisement", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      console.log("advertisement: post_id = " + post_id + "; account_id = " + account_id);
      conn.query("UPDATE posts SET state = 'advertisement' WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Duyệt bài đăng thành công!",
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

// user muốn đẩy tin lại: trước đó đang cho thuê giờ đã cho thuê: state: advertisement -> rented
router.put("/rented", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      conn.query("UPDATE posts SET state = 'rented' WHERE post_id = ? AND account_id = ?", [post_id, account_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Duyệt bài đăng thành công!",
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

// admin từ chối bài đăng
// demo http:////127.0.0.1:3000/api/post/cancel/
router.put("/refuse", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post_id = req.body.post_id;
      let account_id = verified.account_id;

      conn.query("UPDATE posts SET status = 'refuse' WHERE post_id = ?", [post_id], function (err, result) {
        if (err) throw err;
        res.json({
          success: true,
          message: "Từ chối bài đăng thành công!",
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

router.put("/view/:post_id", (req, res) => {
  var post_id = req.params.post_id;
  if (!post_id) {
    const data = {
      success: false,
      message: "Vui lòng cung cấp post_id",
      code: "ID_MISSING_ERROR",
      data: null,
    };
    res.json(data);
    return;
  }

  conn.query(
    "SELECT views FROM posts WHERE post_id = ?",
    [post_id],
    function (err, rows, fields) {
      if (err) throw err;

      if (rows.length < 0) {
        res.json({
          success: false,
          message: "Không tim thấy thông tin bài đăng",
        });
      } else {
        let count = rows[0].views + 1;
        conn.query("UPDATE posts SET views = ? WHERE post_id = ?", [count, post_id], function (err, result) {
          if (err) throw err;
          res.json({
            success: true,
            message: "Đánh dấu lượt xem thành công!",
            code: null,
          });
        });
      }
    }
  );
});

// lấy toàn bộ bài đăng đã được duyệt
// demo: http://127.0.0.1:3000/api/post/get-all/
router.get("/get_all", (req, res) => {
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
  console.log("account_id = "  + account_id);

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
        "SELECT * FROM posts WHERE status = 'approved'"
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
              result[i].post_id + " AND favorites.account_id = " + 
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

router.get("/count", (req, res) => {
  async function queryDatabase() {
    try {
      // Kết nối với cơ sở dữ liệu
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "re_state",
      });

      const [result1] = await connection.execute("SELECT count(*) as total FROM posts");
      const [result2] = await connection.execute("SELECT count(*) as total FROM posts WHERE status = 'processing'");
      const [result3] = await connection.execute("SELECT count(*) as total FROM posts WHERE status = 'approved'");
      const [result4] = await connection.execute("SELECT count(*) as total FROM posts WHERE status = 'refuse'");

      let all = result1[0].total;
      let processing = result2[0].total;
      let approved = result3[0].total;
      let refuse = result4[0].total;

      await connection.end();

      let total = {
        all: all,
        processing: processing,
        approved: approved,
        refused: refuse
      }
      res.json({
        success: true,
        message: "Success!",
        code: null,
        data: total,
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
  queryDatabase();
});

router.get("/count/processing", (req, res) => {
  conn.query(
    "SELECT count(*) as total FROM posts WHERE status = 'processing'",
    [],
    function (err, rows, fields) {
      if (err) throw err;

      res.json({
        success: true,
        message: "",
        code: null,
        data: rows[0].total,
      });
    });
});

router.get("/count/highlight_mark", (req, res) => {
  conn.query(
    "SELECT count(*) as total FROM highlight_mark, posts WHERE highlight_mark.post_id = posts.post_id AND posts.status = 'approved'",
    [],
    function (err, rows, fields) {
      if (err) throw err;

      res.json({
        success: true,
        message: "",
        code: null,
        data: rows[0].total,
      });
    });
});

router.get("/count/refuse", (req, res) => {
  conn.query(
    "SELECT count(*) as total FROM posts WHERE status = 'refuse'",
    [],
    function (err, rows, fields) {
      if (err) throw err;

      res.json({
        success: true,
        message: "",
        code: null,
        data: rows[0].total,
      });
    });
});

router.get("/count/views", (req, res) => {
  conn.query(
    "SELECT SUM(views) as views FROM posts",
    [],
    function (err, rows, fields) {
      if (err) throw err;

      res.json({
        success: true,
        message: "",
        code: null,
        data: rows[0].views,
      });
    });
});

router.get("/count/highlight_mark/views", (req, res) => {
  conn.query(
    "SELECT SUM(views) as views FROM highlight_mark, posts WHERE highlight_mark.post_id = posts.post_id AND posts.status = 'approved'",
    [],
    function (err, rows, fields) {
      if (err) throw err;

      res.json({
        success: true,
        message: "",
        code: null,
        data: rows[0].views,
      });
    });
});

export default router;
