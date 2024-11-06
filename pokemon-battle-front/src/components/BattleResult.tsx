import React, { useEffect, useState } from 'react';
import './BattleResult.css';

interface BattleResultProps {
  result: string | null;
}

const BattleResult: React.FC<BattleResultProps> = ({ result }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (!visible) return null;

  let resultClass = '';
  if (result === 'You Win!') {
    resultClass = 'you-win';
  } else if (result === 'You Lose!') {
    resultClass = 'you-lose';
  } else if (result === "It's a Tie!") {
    resultClass = 'its-a-tie';
  }

  return (
    <div className={`battle-result ${resultClass}`}>
      <h2>{result}</h2>
    </div>
  );
};

export default BattleResult;