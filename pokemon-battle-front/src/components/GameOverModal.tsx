import React from 'react';
import './GameOverModal.css';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerWins: number;
  computerWins: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onClose, playerWins, computerWins }) => {
  if (!isOpen) return null;

  const winner = playerWins > computerWins ? "Player" : playerWins < computerWins ? "Computer" : "It's a tie";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over!</h2>
        <p>Player Wins: {playerWins}</p>
        <p>Computer Wins: {computerWins}</p>
        <p>Winner: <span className="winner">{winner}</span></p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameOverModal;