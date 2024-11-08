import React from "react";
import "./Modal.css"; // สไตล์สำหรับ Modal

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: string[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null; // หากไม่เปิดให้ไม่แสดงอะไร

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Match History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
