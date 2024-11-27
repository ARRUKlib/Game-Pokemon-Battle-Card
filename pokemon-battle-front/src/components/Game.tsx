import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import backgroundImage from "../assets/images/P_32.jpg";
import loadingSound from "../assets/sounds/loadingSound.mp3";
import Modal from "../components/Modal"; 
import GameOverModal from "./GameOverModal";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import fallbackImage from '../assets/fallback-pokemon.png';
import BattleResult from './BattleResult';
import HistoryModal from './HistoryModal';
import speakerIcon from "../assets/images/speaker-icon.png";
import mutedSpeakerIcon from "../assets/images/muted-speaker-icon.png";

interface GameProps {
  username: string | null;
  userId: number | null; // เพิ่ม userId ที่เป็น number หรือ null
  onLogout: () => void;
}

interface PokemonCard {
  name: string;
  type: string;
  hp_base: number;
  attack_base: number;
  defense_base: number;
  speed_base: number;
  image: string;
  poke_type_card: string; // เพิ่ม property นี้
}

const Game: React.FC<GameProps> = ({ username, onLogout }) => {
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
  const [playerCard, setPlayerCard] = useState<PokemonCard | null>(null);
  const [opponentCard, setOpponentCard] = useState<PokemonCard | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [opponentHit, setOpponentHit] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [userIds, setUserIds] = useState<string | null>(null);
  const [userHistory, setUserHistory] = useState<{ win: number, lose: number, draw: number } | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [playerExp, setPlayerExp] = useState<number>(0); // เพิ่ม state สำหรับเก็บ EXP
  const [playerLevel, setPlayerLevel] = useState<number>(1); // เก็บค่า Level ของผู้เล่น
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAboutMe = () => {
    console.log("About Me clicked");
    navigate('/about-me');
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };
  
  useEffect(() => {
  console.log(username)
    setUserIds(username);
    if (!username) {
      alert("Please log in before playing the game.");
      navigate("/login"); // นำทางไปยังหน้า login
    }
  }, [username]);
/*
  useEffect(() => {
    var usernames = localStorage.getItem("userIds");
    setUserIds(usernames);
    if (usernames != null) {
      alert("Please log in before playing the game.");
      navigate("/login"); // นำทางไปยังหน้า login
    }
  }, []);
  */

  useEffect(() => {
    var muteSounds = localStorage.getItem("muteSound");
    if(muteSounds == 'true'){
      setIsMuted(true)
    }else{
      setIsMuted(false)
      
    }
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://apipokemon.apiexall.com:3001/api/pokemon");
        const pokemonList: PokemonCard[] = response.data.map((pokemon: any) => ({
          name: pokemon.pok_name,
          type: pokemon.pok_type,
          hp_base: pokemon.hp_base,
          attack_base: pokemon.attack_base,
          defense_base: pokemon.defense_base,
          speed_base: pokemon.speed_base,
          image: "",
        }));
        setPokemonCards(pokemonList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
    fetchTotalScore();
  }, []);


  const fetchTotalScore = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user_wl?user_id=${username}`);
      const { win, lose, draw } = response.data;
      setTotalWins(win);
      setTotalLosses(lose);
      setTotalDraws(draw);
    } catch (error) {
      console.error("Error fetching total score:", error);
    }
  };

  const getRandomCard = (): PokemonCard | null => {
    if (pokemonCards.length === 0) return null;
    return pokemonCards[Math.floor(Math.random() * pokemonCards.length)];
  };

  const fetchPokemonImage = async (pokemonName: string): Promise<string> => {
    try {
      const response = await axios.get(`http://apipokemon.apiexall.com:3001/api/pic_poke?pok_name=${pokemonName}`, {
        responseType: 'text'
      });
      return `data:image/png;base64,${response.data}`;
    } catch (error) {
      console.error("Error fetching Pokemon image:", error);
      return "";
    }
  };

  const animateAttack = (attacker: 'player' | 'opponent') => {
    if (attacker === 'player') {
      setPlayerAttacking(true);
      setOpponentHit(true);
      setTimeout(() => {
        setPlayerAttacking(false);
        setOpponentHit(false);
      }, 500);
    } else {
      setOpponentAttacking(true);
      setPlayerHit(true);
      setTimeout(() => {
        setOpponentAttacking(false);
        setPlayerHit(false);
      }, 500);
    }
  };

  const battle = async (player: PokemonCard, opponent: PokemonCard): Promise<string> => {
    let playerHP = player.hp_base;
    let opponentHP = opponent.hp_base;

    const playerFirst = player.speed_base >= opponent.speed_base;

    while (playerHP > 0 && opponentHP > 0) {
      if (playerFirst) {
        // Player attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        animateAttack('player');
        opponentHP -= player.attack_base;
        if (opponentHP <= 0) return "player";

        // Opponent attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        animateAttack('opponent');
        playerHP -= opponent.attack_base;
        if (playerHP <= 0) return "opponent";
      } else {
        // Opponent attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        animateAttack('opponent');
        playerHP -= opponent.attack_base;
        if (playerHP <= 0) return "opponent";

        // Player attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        animateAttack('player');
        opponentHP -= player.attack_base;
        if (opponentHP <= 0) return "player";
      }
    }
    return "tie";
  };

  const saveGameResult = async () => {
    if (!username) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/api/save_game_result", {
        user_id: username,
        win: playerWins,
        lose: opponentWins,
        draw: roundsPlayed - playerWins - opponentWins,
        exp: playerExp // เพิ่ม EXP ที่จะบันทึก
      });
      if (response.data.success) {
        console.log("Game result and EXP saved successfully");
      }
    } catch (error) {
      console.error("Error saving game result and EXP:", error);
    }
  };

  const handleRandomize = async () => {
    if (roundsPlayed >= 5) {
      await saveGameResult(); // บันทึกผลการเล่นเมื่อเล่นครบ 5 รอบ
      setIsGameOverModalOpen(true);
      return;
    }
    setIsSpinning(true);

    const player = getRandomCard();
    const opponent = getRandomCard();


    
    if (!player || !opponent) {
      alert("ไม่สามารถสุ่มโปเกมอนได้ กรุณาลองใหม่อีกครั้ง");
      setIsSpinning(false);
      return;
    }

    try {
      player.image = await fetchPokemonImage(player.name);
      opponent.image = await fetchPokemonImage(opponent.name);
    } catch (error) {
      console.error("Error fetching images:", error);
    }

    setPlayerCard({ ...player });
    setOpponentCard({ ...opponent });

    setTimeout(async () => {
      setIsSpinning(false);
      const battleResult = await battle(player, opponent);
      setRoundsPlayed(prev => prev + 1);
      await saveGameResult();
      
      if (battleResult === "player") {
        setResult("You Win!");
        setPlayerWins(prev => prev + 1);
        updatePlayerExp(10); // เพิ่ม EXP เมื่อชนะ
        setHistory(prev => [...prev, `You defeated ${opponent.name}`]);
      } else if (battleResult === "opponent") {
        setResult("You Lose!");
        setOpponentWins(prev => prev + 1);
        updatePlayerExp(5); // เพิ่ม EXP เมื่อแพ้
        setHistory(prev => [...prev, `You were defeated by ${opponent.name}`]);
      } else {
        setResult("It's a Tie!");
        updatePlayerExp(7); // เพิ่ม EXP เมื่อเสมอ
        setHistory(prev => [...prev, `Match tied between ${player.name} and ${opponent.name}`]);
      }
    }, 2000);
  };

  const resetGame = async () => {
    await saveGameResult(); // บันทึกผลการเล่นก่อนรีเซ็ตเกม
    setRoundsPlayed(0);
    setPlayerWins(0);
    setOpponentWins(0);
    setHistory([]);
    setIsGameOverModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userIds')
    onLogout();
    navigate("/login");
  };

  const fetchUserHistory = async () => {
    if (!username) {
      console.error("Username is missing");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/api/user_wl?user_id=${username}`);
      setUserHistory(response.data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching user history:", error);
      alert("Failed to fetch user history. Please try again.");
    }
  };

  const updatePlayerExp = async (expGained: number) => {
    if (!userIds) {
      console.error("User ID is missing");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/api/update_exp_and_level', {
        user_id: userIds,
        exp_gained: expGained,
        current_level: playerLevel
      });
      if (response.data.success) {
        const { new_exp, new_level } = response.data;
        setPlayerExp(new_exp);
        setPlayerLevel(new_level);
        console.log(`EXP gained: ${expGained}. New total: ${new_exp}. New level: ${new_level}`);
      }
    } catch (error) {
      console.error('Error updating exp and level:', error);
    }
  };

  const updatePlayerLevel = async (newLevel: number) => {
    if (!userIds) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/update_level', {
        user_id: userIds,
        new_level: newLevel
      });
      if (response.data.success) {
        console.log(`Level updated to ${newLevel}`);
      }
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  // ฟังก์ชันสำหรับคำนวณการเลเวลอัพ
  const checkLevelUp = (newExp: number) => {
    const requiredExp = playerLevel * 100; // จำนวน EXP ที่ต้องใช้ในการเลเวลอัพ
  
    if (newExp >= requiredExp) {
      setPlayerLevel(prevLevel => prevLevel + 1); // เพิ่มระดับผู้เล่น
      setPlayerExp(newExp - requiredExp); // หักค่า EXP ที่เกินจากการเลเวลอัพออก
      alert(`Congratulations! You've leveled up to level ${playerLevel + 1}`);
      grantRareCard(); // ให้รางวัลเมื่อเลเวลอัพ
    } else {
      setPlayerExp(newExp); // อัปเดตค่า EXP ปัจจุบันถ้ายังไม่ถึงเลเวลอัพ
    }
  };
  
  // ฟังก์ชันสำหรับให้รางวัลเป็นการ์ด rare เมื่อผู้เล่นเลเวลอัพ
  const grantRareCard = () => {
    const rareCards = pokemonCards.filter(card => card.poke_type_card === 'rare');
    const normalCards = pokemonCards.filter(card => card.poke_type_card === 'normal');
  
    // คำนวณโอกาสในการได้รับการ์ด rare ตามเลเวล
    const rareChance = Math.min(playerLevel * 10, 50); // เพิ่มโอกาส 10% ต่อเลเวล สูงสุด 50%
    
    const randomNumber = Math.random() * 100;
  
    let selectedCard;
    if (randomNumber < rareChance && rareCards.length > 0) {
      selectedCard = rareCards[Math.floor(Math.random() * rareCards.length)];
      alert(`You've received a rare card: ${selectedCard.name}!`);
    } else if (normalCards.length > 0) {
      selectedCard = normalCards[Math.floor(Math.random() * normalCards.length)];
      alert(`You've received a normal card: ${selectedCard.name}!`);
    }
  
    if (selectedCard) {
      // เพิ่มการ์ดให้กับผู้เล่น หรือจัดเก็บใน inventory ของผู้เล่น
      // ตัวอย่าง: addCardToInventory(selectedCard);
    }
  };

  //สร้างฟังก์ชันสำหรับควบคุมเสียง:
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Math.max(0, Math.min(1, parseFloat(event.target.value)));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    var muteTrue = true
    var muteFalse = false
    setIsMuted((prevMuted) => {
      if (audioRef.current) {
        audioRef.current.muted = !prevMuted;
        if(prevMuted == true){
          localStorage.setItem("muteSound", JSON.stringify(muteFalse));
        }else if(prevMuted == false){
          localStorage.setItem("muteSound", JSON.stringify(muteTrue));
        }
      }
      return !prevMuted;
    });
  };


return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        textAlign: "center",
        padding: "5px",
        height: "100vh",
      }}
    >
      <audio ref={audioRef} src={loadingSound} loop autoPlay muted={isMuted} />


      <div className="game-container">
        {loading ? (
          <h2>กำลังโหลดโปเกมอน...</h2>
        ) : (
          <>
            <div className="audio-controls">
              <button onClick={toggleMute}>
                <img 
                  src={isMuted ?  speakerIcon: mutedSpeakerIcon} 
                  alt={isMuted ? "Unmute" : "Mute"} 
                />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <button
              className="logout-button"
              onClick={handleLogout}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                padding: "20px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>

            <HistoryModal
              isOpen={isHistoryModalOpen}
              onClose={() => setIsHistoryModalOpen(false)}
              history={userHistory}
            />
            {/* แทนที่ปุ่ม View History เดิมด้วยเมนูใหม่ */}
            <div className="menu-container">
                <button className="menu-button" onClick={toggleMenu}>
                    ☰
                </button>
                {isMenuOpen && (
                    <div className="menu-dropdown">
                        <button onClick={() => handleMenuItemClick(handleAboutMe)}>About Me</button>
                        <button onClick={() => handleMenuItemClick(fetchUserHistory)}>View History</button>

                    </div>
                )}
            </div>

            <div className="exp-display">
              <h3 className="exp-level-text">Experience Points: {playerExp}        |        Level : {playerLevel}</h3>
            </div>
            <div className="card-comparison">
              <div className="card-title">
                <span className="player-title">Player Card</span>
                <span className="vs">VS</span>
                <span className="computer-title">Computer Card</span>
              </div>
              <div className="card-container">
                {playerCard && (
                  <div className={`pokemon-card ${isSpinning ? "spin" : ""} ${playerAttacking ? "attacking" : ""} ${playerHit ? "hit" : ""}`}>
                    <img
                      src={playerCard.image || fallbackImage}
                      alt={playerCard.name}
                      className="pokemon-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = fallbackImage;
                      }}
                    />
                    <div className="pokemon-details">
                      <h3>{playerCard.name}</h3>
                      <p>Type: {playerCard.type}</p>
                      <p>HP: {playerCard.hp_base}</p>
                      <p>Attack: {playerCard.attack_base}</p>
                      <p>Defense: {playerCard.defense_base}</p>
                      <p>Speed: {playerCard.speed_base}</p>
                    </div>
                  </div>
                )}

                {opponentCard && (
                  <div className={`pokemon-card ${isSpinning ? "spin" : ""} ${opponentAttacking ? "attacking" : ""} ${opponentHit ? "hit" : ""}`}>
                    <img
                      src={opponentCard.image || fallbackImage}
                      alt={opponentCard.name}
                      className="pokemon-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = fallbackImage;
                      }}
                    />
                    <div className="pokemon-details">
                      <h3>{opponentCard.name}</h3>
                      <p>Type: {opponentCard.type}</p>
                      <p>HP: {opponentCard.hp_base}</p>
                      <p>Attack: {opponentCard.attack_base}</p>
                      <p>Defense: {opponentCard.defense_base}</p>
                      <p>Speed: {opponentCard.speed_base}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="randomize-button" onClick={handleRandomize}>
              Randomize Cards
            </button>

            <BattleResult result={result} />

            <div className="scoreboard">
              <h3>Rounds Played: {roundsPlayed}/5        |        Player Wins: {playerWins}        |        Computer Wins: {opponentWins} </h3>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              history={history}
            />

            <GameOverModal
              isOpen={isGameOverModalOpen}
              onClose={resetGame}
              playerWins={playerWins}
              computerWins={opponentWins}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Game;

//ใช้คำสั่ง npm start ในการรัน