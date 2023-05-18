const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
require("dotenv").config();
const cors = require('cors'); // CORS 미들웨어 추가

const app = express();

app.use(cors()); // 모든 요청에 대해 CORS 허용


// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB,
});

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/'); // 이미지를 저장할 경로 설정
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname); // 파일명 설정
    },
});

const upload = multer({ storage: storage }).array('images', 5);

// 이미지 업로드 처리 API
app.post('/upload', (req, res) => {
    upload(req, res, (error) => {
        if (error) {
            console.error('Failed to upload image:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        } else {
            const images = req.files;
            if (!images || images.length === 0) {
                res.status(400).json({ error: 'No images provided' });
                return;
            }

            // 이미지를 MySQL에 저장
            const sql = 'INSERT INTO img_table (img_path) VALUES ?';
            const values = images.map((image) => [image.path]);
            connection.query(sql, [values], (error, results, fields) => {
                if (error) {
                    console.error('Failed to save images to database:', error);
                    res.status(500).json({ error: 'Failed to save images to database' });
                    return;
                }
                res.status(200).json({ message: 'Images uploaded and saved to database' });
            });
        }
    });
});

connection.connect()

// 서버 시작
app.listen(process.env.DB_PORT, () => {
    console.log('Server is running on port');
  });