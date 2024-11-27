require('dotenv').config();

const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // นำเข้า bcrypt


const app = express();  
const port = 3001; // พอร์ตสำหรับเซิร์ฟเวอร์

// ใช้ CORS เพื่ออนุญาตการเข้าถึงจากแหล่งที่มาที่แตกต่าง
app.use(cors());
app.use(bodyParser.json()); // ใช้ body-parser เพื่อจัดการ JSON

// เชื่อมต่อกับ PostgreSQL โดยใช้ environment variables จาก docker-compose.yml
const client = new Client({
  host: process.env.DB_HOST,          // ใช้ DB_HOST จาก environment variable
  database: process.env.DB_NAME,      // ใช้ DB_NAME จาก environment variable
  user: process.env.DB_USER,          // ใช้ DB_USER จาก environment variable
  password: process.env.DB_PASSWORD,  // ใช้ DB_PASSWORD จาก environment variable
  port: process.env.DB_PORT || 5432,  // พอร์ตของ PostgreSQL (ค่าเริ่มต้นคือ 5432)
});


// เชื่อมต่อกับฐานข้อมูล
client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// เส้นทางหลัก
app.get('/', (req, res) => {
  res.send('Welcome to the Pokémon Battle API!');
});

const axios = require('axios');

// API สำหรับดึงข้อมูล Pokémon จาก API ภายนอก
app.get('/api/pokemon', async (req, res) => {
  try {
    // เรียก API ภายนอกเพื่อดึงข้อมูล Pokémon
    const response = await axios.get('http://13.228.191.168:3000/api/pokemon');
    
    // ส่งข้อมูลที่ได้จาก API ภายนอกกลับไปยัง frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Pokémon data from external API:', error);
    res.status(500).json({ success: false, message: 'Error fetching Pokémon data from external API' });
  }
});

// API สำหรับดึงภาพ Pokémon จาก API ภายนอก
app.get('/api/pic_poke', async (req, res) => {
  try {
    const pokemonName = req.query.pok_name;

    // เรียก API ภายนอกเพื่อดึงภาพ Pokémon ตามชื่อ
    const response = await axios.get(`http://13.228.191.168:3000/api/pic_poke?pok_name=${pokemonName}`);
    
    // ส่งภาพที่ได้จาก API ภายนอกกลับไปยัง frontend
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching Pokémon image for ${pokemonName}:`, error);
    res.status(500).json({ success: false, message: `Error fetching Pokémon image for ${pokemonName}` });
  }
});

// API สำหรับตรวจสอบ user_id และ password
app.post('/api/user_id', async (req, res) => {
  try {
    const { user_name, pass } = req.body;
    const sql = "SELECT * FROM user_id WHERE user_name = $1";
    const result = await client.query(sql, [user_name]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(pass, user.pass);
      if (isMatch) {
        res.json({ success: true, user_id: user.user_id });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API สำหรับลงทะเบียนผู้ใช้
app.post('/api/register', async (req, res) => {
  try {
    const { user_name, pass } = req.body; // รับข้อมูลจาก body

    // ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วหรือไม่
    const checkUserSql = "SELECT * FROM user_id WHERE user_name = $1";
    const checkResult = await client.query(checkUserSql, [user_name]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(pass, 10); // เข้ารหัสด้วย bcrypt

    // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
    const insertSql = "INSERT INTO user_id (user_name, pass) VALUES ($1, $2)";
    await client.query(insertSql, [user_name, hashedPassword]);

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API สำหรับดึงข้อมูลแพ้ชนะเสมอ
app.get('/api/user_wl', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const sql = "SELECT * FROM user_wl WHERE user_id = $1";
    const result = await client.query(sql, [userId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User win/loss data not found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/save_game_result', async (req, res) => {
  try {
    const { user_id, win, lose, draw, exp } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // เริ่มต้นการทำธุรกรรม
    await client.query('BEGIN');

    // อัพเดท EXP ของผู้เล่น
    const updateExpQuery = `
      UPDATE user_id 
      SET experience_points = experience_points + $1
      WHERE user_id = $2
      RETURNING experience_points, level`;
    
    const expResult = await client.query(updateExpQuery, [exp, user_id]);

    // อัพเดทผลการเล่น (win/lose/draw)
    const updateWLQuery = `
      INSERT INTO user_wl (user_id, win, lose, draw) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        win = user_wl.win + $2, 
        lose = user_wl.lose + $3, 
        draw = user_wl.draw + $4`;

    await client.query(updateWLQuery, [user_id, win, lose, draw]);

    // ยืนยันการทำธุรกรรม
    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Game result and EXP saved successfully',
      new_exp: expResult.rows[0].experience_points,
      new_level: expResult.rows[0].level
    });
  } catch (error) {
    // ยกเลิกการทำธุรกรรมหากเกิดข้อผิดพลาด
    await client.query('ROLLBACK');
    console.error('Error saving game result and EXP:', error);
    res.status(500).json({ success: false, message: 'Error saving game result and EXP' });
  }
});

app.post('/api/update_exp_and_level', async (req, res) => {
  const { user_id, exp_gained, current_level } = req.body;
  
  if (!user_id || exp_gained === undefined || current_level === undefined) {
    return res.status(400).json({ success: false, message: 'User ID, EXP gained, and current level are required' });
  }

  try {
    // ดึงข้อมูล EXP และ Level ปัจจุบันของผู้เล่น
    const userQuery = 'SELECT experience_points, level FROM user_id WHERE user_id = $1';
    const userResult = await client.query(userQuery, [user_id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let { experience_points, level } = userResult.rows[0];
    experience_points += exp_gained;

    // คำนวณ Level ใหม่
    while (experience_points >= level * 100) {
      experience_points -= level * 100;
      level++;
    }

    // อัปเดต EXP และ Level ในฐานข้อมูล
    const updateQuery = `
      UPDATE user_id 
      SET experience_points = $1, level = $2
      WHERE user_id = $3
      RETURNING experience_points, level`;
    
    const result = await client.query(updateQuery, [experience_points, level, user_id]);
    
    res.json({ 
      success: true, 
      new_exp: result.rows[0].experience_points,
      new_level: result.rows[0].level
    });
    
  } catch (error) {
    console.error('Error updating exp and level:', error);
    res.status(500).json({ success: false, message: 'Error updating exp and level' });
  }
});

app.post('/api/update_level', async (req, res) => {
  const { user_id, new_level } = req.body;
  
  if (!user_id || !new_level) {
    return res.status(400).json({ success: false, message: 'User ID and new level are required' });
  }

  try {
    const updateQuery = `
      UPDATE user_id 
      SET level = $1
      WHERE user_id = $2
      RETURNING level`;
    
    const result = await client.query(updateQuery, [new_level, user_id]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, new_level: result.rows[0].level });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({ success: false, message: 'Error updating level' });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });


  //รันใช้คำสั่ง nodemon server.js