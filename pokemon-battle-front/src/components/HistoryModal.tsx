import React from 'react';
import './Modal.css'; // ใช้ CSS เดียวกับ Modal อื่น ๆ

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: { win: number, lose: number, draw: number } | null;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen || !history) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Your Battle History</h2>
        <p>Wins: {history.win}</p>
        <p>Losses: {history.lose}</p>
        <p>Draws: {history.draw}</p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HistoryModal;