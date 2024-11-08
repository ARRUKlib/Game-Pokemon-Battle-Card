import React from 'react';
import { Link } from 'react-router-dom';

const AboutMe: React.FC = () => {
  return (
    <div className="about-me-container">
      <h1>About Me</h1>
      <p>This is the About Me page. Here you can add information about yourself or the game.</p>
      <Link to="/game">Back to Game</Link>
    </div>
  );
};

export default AboutMe;