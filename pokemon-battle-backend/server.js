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

// เชื่อมต่อกับ PostgreSQL
const client = new Client({
  host: '13.228.191.168',
  database: 'postgres',
  user: 'postgres', // เปลี่ยนเป็นชื่อผู้ใช้ของคุณ
  password: 'vkiydKN8825', // เปลี่ยนเป็นรหัสผ่านของคุณ
  port: 5432, // พอร์ตของ PostgreSQL
});

// เชื่อมต่อกับฐานข้อมูล
client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// เส้นทางหลัก
app.get('/', (req, res) => {
  res.send('Welcome to the Pokémon Battle API!');
});

// API สำหรับดึงข้อมูล Pokémon
app.get('/api/pokemon', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM pokemon;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API สำหรับดึงภาพ Pokémon
app.get('/api/pic_poke', async (req, res) => {
  try {
    const pok_name = req.query.pok_name;
    const sql = "SELECT pok_image FROM pic_poke WHERE pok_name = $1";
    const result = await client.query(sql, [pok_name]);
    if (result.rows.length > 0) {
      res.send(result.rows[0]['pok_image']); // ส่ง Base64 string โดยตรง
    } else {
      res.status(404).send('Pokémon not found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API สำหรับตรวจสอบ user_id และ password
app.post('/api/user_id', async (req, res) => {
  try {
    const { user_name, pass } = req.body; // รับข้อมูลจาก body

    const sql = "SELECT * FROM user_id WHERE user_name = $1";
    const result = await client.query(sql, [user_name]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(pass, user.pass); // เปรียบเทียบรหัสผ่าน

      if (isMatch) {
        res.json({ success: true, user_id: user.user_id });
      } else {
        console.log(`Invalid login attempt for user: ${user_name}`);
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      console.log(`Invalid login attempt for user: ${user_name}`);
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
    const userId = req.query.user_id; // รับ user_id จาก query parameters

    const sql = "SELECT * FROM user_wl WHERE user_id = $1";
    console.log(sql)

    const result = await client.query(sql, [userId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // ส่งข้อมูลแพ้ชนะเสมอกลับไป
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