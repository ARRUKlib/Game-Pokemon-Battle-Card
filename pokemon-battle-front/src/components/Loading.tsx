import React, { useEffect } from "react";
import backgroundImage from "../assets/images/P_9.jpg"; // เปลี่ยนเป็นชื่อไฟล์และเส้นทางที่ถูกต้อง
import loadingSound from "../assets/sounds/loadingSound.mp3"; // เปลี่ยนเป็นเส้นทางของไฟล์เสียงที่ต้องการ

const Loading: React.FC<{ progress: number }> = ({ progress }) => {
  useEffect(() => {
    const audio = new Audio(loadingSound);
    audio.loop = true; // เล่นซ้ำ

    const playAudio = async () => {
      try {
        await audio.play(); // เริ่มเล่นเสียง
        console.log("เสียงเล่นแล้ว");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเล่นเสียง:", error);
      }
    };

    // เริ่มเล่นเสียงเมื่อคอมโพเนนต์ถูกมาทำงาน
    playAudio();

    // ทำความสะอาดเมื่อคอมโพเนนต์จะถูกลบ
    return () => {
      audio.pause(); // หยุดเล่นเสียง
      audio.currentTime = 0; // รีเซ็ตเวลาเสียง
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        padding: "50px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "6rem" }}>Loading... {progress}%</h1>
      <progress value={progress} max="100" />
    </div>
  );
};

export default Loading; // Ensure default export
