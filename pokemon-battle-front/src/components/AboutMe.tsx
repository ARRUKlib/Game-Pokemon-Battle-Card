import React from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับการนำทางกลับไปหน้า game.tsx
import './AboutMe.css'; // ไฟล์ CSS สำหรับจัดการสไตล์


const AboutMe = () => {
  const navigate = useNavigate(); // ใช้ hook สำหรับการนำทาง

  const goToGame = () => {
    navigate('/game'); // นำทางไปยังหน้า game.tsx
  };
  return (
    <div className="about-me-container">

      {/* ปุ่มกลับไปหน้า Game ด้านบน */}
      <div className="button-container">
        <button className="back-button" onClick={goToGame}>กลับหน้า Game</button>
      </div>
      
      <p></p>
      {/* ส่วนที่ 1: ข้อมูลหลักสูตรและอาจารย์ */}
      <section className="section">
        <h1>Computer Engineering College of Engineering and Technology</h1>
        <div className="image-container">
          <img src={require('../assets/images/cite.jpg')} alt='Image 1' className="about-image cite-image" />
          <img src={require('../assets/images/5_อ_ck.jpg')} alt='Image 2' className="about-image" />
        </div>
        <p>หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต และ ปรัชญาดุษฎีบัณฑิต</p>
        <p>สาขาวิชาวิศวกรรมคอมพิวเตอร์</p>
        <p>วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยธุรกิจบัณฑิตย์</p>

        <h2>Teacher</h2>
        <p>ผู้ช่วยศาสตราจารย์ ดร.ชัยพร เขมะภาตะพันธ์</p>
        <p>ผู้อำนวยการหลักสูตร</p>
        <p>สาขาวิชาวิศวกรรมคอมพิวเตอร์</p>
        <p>วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี</p>
      </section>

      <section className="section">
        {/* ส่วนที่ 2: ข้อมูลจาก README */}
        <h2>Pokemon Battle Card Game</h2>
        <h2>One Shot!!</h2>
        <p>เกมต่อสู้โปเกมอนที่จำลองการต่อสู้แบบเทิร์นเบส พัฒนาด้วย React TypeScript, Node.js Backend และ PostgreSQL</p>

        {/* รูปภาพ Diagram */}
        <img src='https://github.com/user-attachments/assets/977a754c-3da4-410d-a662-ade6249b8d1a' alt='DiagramPokemon' className="about-image" />

        <h3>หลักการพัฒนา</h3>
        <ul>
          โปรเจกต์นี้เป็นเกมต่อสู้โปเกมอนที่พัฒนาโดยใช้หลักการออกแบบเชิงวัตถุ (Object-Oriented Design) เพื่อจำลองการต่อสู้ระหว่างโปเกมอน โครงสร้างหลักของโปรเจกต์ประกอบด้วย:
          <li><strong>คลาส Pokemon:</strong> กำหนดคุณลักษณะและความสามารถพื้นฐานของโปเกมอน เช่น ชื่อ, พลังชีวิต, และท่าโจมตี</li>
          <li><strong>คลาส Battle:</strong> จัดการกลไกการต่อสู้ระหว่างโปเกมอนสองตัว รวมถึงการโจมตีและการคำนวณความเสียหาย โดยฝั่งที่มีสปีดเยอะกว่าจะได้โจมตีก่อน แต่หากสปีดเท่ากัน ผู้เล่นจะได้โจมตีก่อน</li>
          <li><strong>คลาส EXP:</strong> กำหนดการได้รับ EXP สำหรับผู้เล่น เมื่อผู้เล่นเล่นไปเรื่อยๆ จะมีโอกาสเพิ่ม level และหาก level สูงขึ้น ก็ยิ่งมีโอกาสได้การ์ดประเภท rare ที่มีพลังการโจมตีสูงขึ้นด้วย</li>
        </ul>

        {/* โครงสร้างโปรเจกต์ */}
        <h3>โครงสร้างโปรเจกต์</h3>
        <ul>
          <li><strong>Frontend:</strong> พัฒนาด้วย React TypeScript เพื่อสร้าง UI ที่ตอบสนองและมีประสิทธิภาพ</li>
          <li><strong>Backend:</strong> พัฒนาด้วย Node.js กับ Express เพื่อสร้าง RESTful API ที่รวดเร็วและมีประสิทธิภาพ</li>
          <li><strong>Database:</strong> ใช้ PostgreSQL เพื่อจัดเก็บข้อมูลผู้เล่น, โปเกมอน, และสถิติการเล่น</li>
        </ul>

        {/* API ที่สำคัญ */}
        <h3>API ที่สำคัญ</h3>

        {/* GET /api/pokemon */}
        <pre className="code-block">
          <code>{`GET /api/pokemon
Response: รายชื่อโปเกมอนพร้อมรายละเอียด`}</code>
        </pre>

        {/* GET /api/pic_poke */}
        <pre className="code-block">
          <code>{`GET /api/pic_poke
Query Parameters: pok_name (ชื่อโปเกมอน)
Response: ส่ง Base64 string ของภาพโปเกมอน`}</code>
        </pre>

        {/* POST /api/user_id */}
        <h4>POST /api/user_id</h4>
        <pre className="code-block">
          <code>{`{
  "user_name": "ชื่อผู้ใช้",
  "pass": "รหัสผ่าน"
}`}</code>
        </pre>

        {/* POST /api/register */}
        <h4>POST /api/register</h4>
        <pre className="code-block">
          <code>{`{
  "user_name": "ชื่อผู้ใช้",
  "pass": "รหัสผ่าน"
}`}</code>
        </pre>

         {/* วิธี Deploy */}
         <h3>วิธี Deploy</h3>

         ข้อกำหนดเบื้องต้น:<br />
         - Node.js (v14 หรือสูงกว่า)<br />
         - Docker และ Docker Compose<br />
         - PostgreSQL<br />
         - Bun (สำหรับ Frontend)<br />

         {/* ขั้นตอนการ Deploy */}
         1. Clone โปรเจกต์:
         <pre className="code-block">
           <code>{`git clone https://github.com/ARRUKlib/game-pokemonbattle.git
cd game-pokemonbattle`}</code>
         </pre>

         2. สร้างและเริ่มต้น Services ด้วย Docker Compose:
         <pre className="code-block">
           <code>{`sudo docker-compose up --build`}</code>
         </pre>

         3. เข้าใช้งาน:<br />
         - Frontend: http://localhost:3000<br />
         - Backend: http://localhost:3001<br />

         {/* การใช้งาน init.sql */}
         <h3>การใช้งาน init.sql</h3>
         ไฟล์ init.sql ใช้สำหรับการสร้างโครงสร้างฐานข้อมูลเริ่มต้น โดยมีการสร้างตารางดังนี้:<br />

           - users: เก็บข้อมูลผู้ใช้<br />
           - pokemon: เก็บข้อมูลโปเกมอน<br />
           - user_pokemon: เก็บความสัมพันธ์ระหว่างผู้ใช้และโปเกมอน<br />
           - battle_history: เก็บประวัติการต่อสู้<br />

           ไฟล์นี้จะถูกรันอัตโนมัติเมื่อ Docker container สำหรับ PostgreSQL เริ่มทำงาน ทำให้ฐานข้อมูลพร้อมใช้งานทันทีหลังจาก deploy

           {/* โครงสร้างโค้ด */}
           <h3>โครงสร้างโค้ด</h3>

           Frontend:<br />
            - ใช้ React TypeScript<br />
            - มีการจัดการ state ด้วย React Hooks<br />
            - ใช้ Axios สำหรับการเรียก API<br />

           Backend:<br />
            - ใช้ Express.js สำหรับสร้าง RESTful API<br />
            - มีการเชื่อมต่อกับ PostgreSQL ผ่าน pg module<br />
            - ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน<br />

           Database:<br />
            - ใช้ PostgreSQL<br />
            - มีการสร้างตารางและความสัมพันธ์ตามที่กำหนดใน init.sql<br />

           {/* การพัฒนาเพิ่มเติม */}
           <h3>การพัฒนาเพิ่มเติม</h3>

           หากต้องการพัฒนาหรือแก้ไขโค้ด:<br />

              สำหรับ Frontend: แก้ไขไฟล์ในโฟลเดอร์ frontend<br />

              สำหรับ Backend: แก้ไขไฟล์ในโฟลเดอร์ backend<br />

              สำหรับ Database: แก้ไขไฟล์ init.sql หรือปรับแต่งการเชื่อมต่อใน Backend<br />

      </section>

      {/* ปุ่มกลับไปหน้า Game ด้านล่าง */}
      <div className="button-container">
        <button className="back-button" onClick={goToGame}>กลับหน้า Game</button>
      </div>

    </div>
  );
};

export default AboutMe;