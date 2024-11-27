import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/P_13.jpg";
import loadingSound from "../assets/sounds/loadingSound.mp3";
import speakerIcon from "../assets/images/speaker-icon.png";
import mutedSpeakerIcon from "../assets/images/muted-speaker-icon.png";
import './Login.css'; // ใช้ CSS เดียวกับหน้า Login

interface RegisterProps {
  onLogin: React.Dispatch<React.SetStateAction<string | null>>;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    const adjustedVolume = Math.max(0.01, newVolume);
    setVolume(adjustedVolume);
    if (audioRef.current) {
      audioRef.current.volume = adjustedVolume;
    }
  };

  const getVolumePercentage = () => {
    return Math.round(volume * 100);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      if (audioRef.current.readyState >= 2) {
        audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [volume, isMuted]);

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