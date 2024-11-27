// นำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/P_13.jpg";
import loadingSound from "../assets/sounds/loadingSound.mp3";
import speakerIcon from "../assets/images/speaker-icon.png";
import mutedSpeakerIcon from "../assets/images/muted-speaker-icon.png";
import './Login.css';

// กำหนด interface สำหรับ props ของคอมโพเนนต์ Login
interface LoginProps {
  onLogin: (user: string | null) => void;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

// คอมโพเนนต์ Login
const Login: React.FC<LoginProps> = ({ onLogin, setUserId }) => {
  // State สำหรับเก็บข้อมูล username และ password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // State สำหรับควบคุมเสียง
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // สร้าง ref สำหรับอ้างอิงถึง audio element
  const audioRef = useRef<HTMLAudioElement>(null);

  // สร้าง navigate function สำหรับการนำทางระหว่างหน้า
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงระดับเสียง
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    // ปรับให้ค่าต่ำสุดไม่เป็น 0
    const adjustedVolume = Math.max(0.01, newVolume);
    setVolume(adjustedVolume);
    if (audioRef.current) {
      audioRef.current.volume = adjustedVolume;
    }
  };

  //เพิ่มฟังก์ชันสำหรับแปลงค่า volume เป็นเปอร์เซ็นต์
  const getVolumePercentage = () => {
    return Math.round(volume * 100);
  };

  // ฟังก์ชันสำหรับเปิด/ปิดเสียง
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // useEffect สำหรับจัดการการเล่นเสียงและการควบคุมระดับเสียง
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      if (audioRef.current.readyState >= 2) {
        audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
      }
    }
    // Cleanup function เมื่อคอมโพเนนต์ถูก unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [volume, isMuted]);

  // ฟังก์ชันสำหรับจัดการการล็อกอิน
  const handleLogin = async () => {
    if (username && password) {
      try {
        // ส่งคำขอไปยัง API เพื่อตรวจสอบการล็อกอิน
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
          //localStorage.setItem("userIds", data.user_id);
          setUserId(data.user_id);
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

  // ส่วน JSX สำหรับแสดงผล UI
  return (
    <div className="login-wrapper">
      <audio ref={audioRef} src={loadingSound} loop autoPlay muted={isMuted} />

      <div className="audio-controls">
        <button onClick={toggleMute}>
          <img 
            src={isMuted ? mutedSpeakerIcon : speakerIcon} 
            alt={isMuted ? "Unmute" : "Mute"} 
          />
        </button>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{getVolumePercentage()}%</span>
      </div>

      <div className="login-form-container">
        <h1 className="login-title">Login</h1>
        
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
          onClick={handleLogin}
          className="btn btn-primary login-button"
        >
          Login
        </button>
        
        <button
          onClick={() => navigate("/register")}
          className="btn btn-secondary login-button"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;