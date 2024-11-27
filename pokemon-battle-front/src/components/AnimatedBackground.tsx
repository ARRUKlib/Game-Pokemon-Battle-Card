import React from "react";
import { motion } from "framer-motion";
import "./AnimatedBackground.css";

const AnimatedBackground: React.FC = () => {
  return (
    <motion.div 
      className="animated-background"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 10,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};

export default AnimatedBackground;