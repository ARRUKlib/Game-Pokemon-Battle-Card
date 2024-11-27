import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/P_13.jpg";
import speakerIcon from "../assets/images/speaker-icon.png";
import mutedSpeakerIcon from "../assets/images/muted-speaker-icon.png";
import './Login.css'; // ใช้ CSS เดียวกับหน้า Login

interface RegisterProps {
  onLogin: React.Dispatch<React.SetStateAction<string | null>>;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

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
          alert("Registration successful!");
          onLogin(username);
          navigate("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error registering:", error);
        alert("An error occurred during registration. Please try again.");
      }
    } else {
      alert("Please enter both username and password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h1 className="login-title">Register</h1>
        
        <input
          type="text"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
        />
        
        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
        
        <button
          onClick={handleRegister}
          className="btn btn-primary login-button"
        >
          Register
        </button>
        
        <button
          onClick={() => navigate("/login")}
          className="btn btn-secondary login-button"
        >
          มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
};

export default Register;