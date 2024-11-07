// import statements should be at the top of the file
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import backgroundImage from "../assets/images/P_13.jpg"; // นำเข้าภาพพื้นหลัง
import loadingSound from "../assets/sounds/loadingSound.mp3"; // เสียงพื้นหลัง

interface LoginProps {
  onLogin: (user: string | null) => void;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>; // เพิ่ม setUserId
}

const Login: React.FC<LoginProps> = ({ onLogin, setUserId }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [user_id, setUser_Id] = useState<string>("");
  const navigate = useNavigate(); // สร้างอินสแตนซ์ของ navigate

  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await fetch("http://localhost:3001/api/user_id", {
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
          alert("Login successful!");
          setUserId(data.user_id); // เก็บ user_id ที่ได้จาก backend
          onLogin(data.user_id);
          navigate("/game");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred during login. Please try again.");
      }
    } else {
      alert("Please enter both username and password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <audio autoPlay loop>
        <source src={loadingSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <h1 style={{ fontSize: "6rem", marginBottom: "20px" }}>Login</h1>
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
        onClick={handleLogin}
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
        Login
      </button>
      <button
        onClick={() => navigate("/register")}
        style={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007BFF",
          color: "white",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Register
      </button>
    </div>
  );
};

// export statement should be at the bottom of the file
export default Login;