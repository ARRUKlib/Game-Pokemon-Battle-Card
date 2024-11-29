# Pokemon Battle Game

เกมต่อสู้โปเกมอนที่จำลองการต่อสู้แบบเทิร์นเบส พัฒนาด้วย React TypeScript, Node.js Backend และ PostgreSQL

![DiagramPokemon](https://github.com/user-attachments/assets/977a754c-3da4-410d-a662-ade6249b8d1a)



## หลักการพัฒนา

โปรเจกต์นี้เป็นเกมต่อสู้โปเกมอนที่พัฒนาโดยใช้หลักการออกแบบเชิงวัตถุ (Object-Oriented Design) เพื่อจำลองการต่อสู้ระหว่างโปเกมอน โครงสร้างหลักของโปรเจกต์ประกอบด้วย:

- **คลาส Pokemon**: กำหนดคุณลักษณะและความสามารถพื้นฐานของโปเกมอน เช่น ชื่อ, พลังชีวิต, และท่าโจมตี
- **คลาส Battle**: จัดการกลไกการต่อสู้ระหว่างโปเกมอนสองตัว รวมถึงการโจมตีและการคำนวณความเสียหาย โดยฝั่งที่มีสปีดเยอะกว่าจะได้โจมตีก่อน แต่หากสปีดเท่ากัน ผู้เล่นจะได้โจมตีก่อน
- **คลาส EXP**: กำหนดการได้รับ EXP สำหรับผู้เล่น เมื่อผู้เล่นเล่นไปเรื่อยๆ จะมีโอกาสเพิ่ม level และหาก level สูงขึ้น ก็ยิ่งมีโอกาสได้การ์ดประเภท rare ที่มีพลังการโจมตีสูงขึ้นด้วย

โปรเจคถูกออกแบบมาประกอบด้วย 3 ส่วนหลัก:

1. **Frontend**: พัฒนาด้วย React TypeScript เพื่อสร้าง UI ที่ตอบสนองและมีประสิทธิภาพ
2. **Backend**: พัฒนาด้วย Node.js กับ Express เพื่อสร้าง RESTful API ที่รวดเร็วและมีประสิทธิภาพ
3. **Database**: ใช้ PostgreSQL เพื่อจัดเก็บข้อมูลผู้เล่น, โปเกมอน, และสถิติการเล่น

## API ที่สำคัญ

1. **GET /api/pokemon**: ดึงข้อมูลโปเกมอนทั้งหมด
   - Response: รายชื่อโปเกมอนพร้อมรายละเอียด

2. **GET /api/pic_poke**: ดึงภาพโปเกมอนตามชื่อ
   - Query Parameters: `pok_name`: ชื่อโปเกมอน
   - Response: ส่ง Base64 string ของภาพโปเกมอน

3. **POST /api/user_id**: ตรวจสอบชื่อผู้ใช้และรหัสผ่าน
   - Body: 
     ```json
     {
       "user_name": "ชื่อผู้ใช้",
       "pass": "รหัสผ่าน"
     }
     ```
   - Response:
     - สำเร็จ: `{ "success": true, "user_id": "ID ของผู้ใช้" }`
     - ล้มเหลว: `{ "success": false, "message": "Invalid username or password" }`

4. **POST /api/register**: ลงทะเบียนผู้ใช้ใหม่
   - Body:
     ```json
     {
       "user_name": "ชื่อผู้ใช้",
       "pass": "รหัสผ่าน"
     }
     ```
   - Response:
     - สำเร็จ: `{ "success": true, "message": "User registered successfully" }`
     - ล้มเหลว: `{ "success": false, "message": "Username already exists" }`

5. **GET /api/user_wl**: ดึงข้อมูลแพ้ชนะเสมอของผู้ใช้
   - Query Parameters: `user_id`: ID ของผู้ใช้
   - Response: ข้อมูลแพ้ชนะเสมอ

6. **POST /api/save_game_result**: บันทึกผลการแข่งขันและ EXP
   - Body:
     ```json
     {
       "user_id": "ID ของผู้ใช้",
       "win": "จำนวนการชนะ",
       "lose": "จำนวนการแพ้",
       "draw": "จำนวนการเสมอ",
       "exp": "คะแนนประสบการณ์"
     }
     ```
   - Response: `{ "success": true, "message": "Game result and EXP saved successfully", "new_exp": "ค่า EXP ใหม่", "new_level": "ระดับใหม่" }`

7. **POST /api/update_exp_and_level**: อัปเดต EXP และระดับของผู้ใช้
   - Body:
     ```json
     {
       "user_id": "ID ของผู้ใช้",
       "exp_gained": "คะแนน EXP ที่ได้รับ",
       "current_level": "ระดับปัจจุบัน"
     }
     ```
   - Response: `{ "success": true, "new_exp": "ค่า EXP ใหม่", "new_level": "ระดับใหม่" }`

8. **POST /api/update_level**: อัปเดตระดับของผู้ใช้
   - Body:
     ```json
     {
       "user_id": "ID ของผู้ใช้",
       "new_level": "ระดับใหม่"
     }
     ```
   - Response: `{ "success": true, "new_level": "ระดับใหม่" }`

## วิธี Deploy

### ข้อกำหนดเบื้องต้น
- Node.js (v14 หรือสูงกว่า)
- Docker และ Docker Compose
- PostgreSQL
- Bun (สำหรับ Frontend)

### ขั้นตอนการ Deploy

1. Clone โปรเจกต์
   ```bash
   git clone https://github.com/ARRUKlib/game-pokemonbattle.git
   cd game-pokemonbattle

2. สร้างและเริ่มต้น Services ด้วย Docker Compose
   ```bash
    sudo docker-compose up --build
   
3. เข้าใช้งาน:
- Frontend: http://localhost
- Backend: http://localhost:3001

# การใช้งาน init.sql
ไฟล์ init.sql ใช้สำหรับการสร้างโครงสร้างฐานข้อมูลเริ่มต้น โดยมีการสร้างตารางดังนี้

   1. users: เก็บข้อมูลผู้ใช้
   2. pokemon: เก็บข้อมูลโปเกมอน
   3. user_pokemon: เก็บความสัมพันธ์ระหว่างผู้ใช้และโปเกมอน
   4. battle_history: เก็บประวัติการต่อสู้

ไฟล์นี้จะถูกรันอัตโนมัติเมื่อ Docker container สำหรับ PostgreSQL เริ่มทำงาน ทำให้ฐานข้อมูลพร้อมใช้งานทันทีหลังจาก deploy

# โครงสร้างโค้ด
Frontend
   - ใช้ React TypeScript
   - มีการจัดการ state ด้วย React Hooks
   - ใช้ Axios สำหรับการเรียก API

Backend
   - ใช้ Express.js สำหรับสร้าง RESTful API
   - มีการเชื่อมต่อกับ PostgreSQL ผ่าน pg module
   - ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน

Database
   - ใช้ PostgreSQL
   - มีการสร้างตารางและความสัมพันธ์ตามที่กำหนดใน init.sql



# การพัฒนาเพิ่มเติม
หากต้องการพัฒนาหรือแก้ไขโค้ด

   สำหรับ Frontend: แก้ไขไฟล์ในโฟลเดอร์ frontend
   
   สำหรับ Backend: แก้ไขไฟล์ในโฟลเดอร์ backend
   
   สำหรับ Database: แก้ไขไฟล์ init.sql หรือปรับแต่งการเชื่อมต่อใน Backend

# Credit Database
https://www.kaggle.com/datasets/divyanshusingh369/complete-pokemon-library-32k-i
