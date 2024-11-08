import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import backgroundImage from "../assets/images/P_13.jpg"; // นำเข้าภาพพื้นหลัง
import loadingSound from "../assets/sounds/loadingSound.mp3"; // เสียงพื้นหลัง

interface RegisterProps {
  onLogin: React.Dispatch<React.SetStateAction<string | null>>;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate(); // สร้างอินสแตนซ์ของ navigate

  const handleRegister = async () => {
    if (username && password) {
      try {
        const response = await fetch("http://localhost:3001/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: username,
            pass: password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Registration successful!"); // แจ้งเตือนเมื่อสมัครสมาชิกสำเร็จ
          onLogin(username); // เรียกใช้ฟังก์ชัน onLogin หลังจากสมัครสมาชิกสำเร็จ
          navigate("/login"); // นำทางไปยังหน้า Login หลังจากสมัครสมาชิก
        } else {
          alert(data.message); // แจ้งข้อผิดพลาดจากเซิร์ฟเวอร์
        }
      } catch (error) {
        console.error("Error registering:", error);
        alert("An error occurred during registration. Please try again.");
      }
    } else {
      alert("Please enter both username and password");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // นำทางไปยังหน้า Login
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`, // กำหนดภาพพื้นหลัง
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* แท็ก audio สำหรับเล่นเพลง */}
      <audio autoPlay loop>
        <source src={loadingSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <h1 style={{ fontSize: "6rem", marginBottom: "20px" }}>Register</h1>
      <input
        type="text"
        placeholder="Enter username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          fontSize: "1.5rem",
          padding: "15px",
          margin: "10px 0",
          borderRadius: "5px",
          border: "2px solid #ccc",
          width: "300px",
        }}
      />
      <input
        type="password"
        placeholder="Enter password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          fontSize: "1.5rem",
          padding: "15px",
          margin: "10px 0",
          borderRadius: "5px",
          border: "2px solid #ccc",
          width: "300px",
        }}
      />
      <button
        onClick={handleRegister}
        style={{
          fontSize: "1.5rem",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#4CAF50", // สีเขียว
          color: "white",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Register
      </button>
      {/* ปุ่มสำหรับนำทางไปยังหน้า Login */}
      <button
        onClick={handleLoginRedirect}
        style={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007BFF", // สีน้ำเงิน
          color: "white",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
      </button>
    </div>
  );
};

export default Register;