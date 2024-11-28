import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Game from "./components/Game";
import AboutMe from './components/AboutMe';
import RandomPokemonList from './components/RandomPokemonList';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={setUser} setUserId={setUserId} />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
          <Route path="/game"  element={<Game username={user} userId={userId} onLogout={() => setUser(null)} />}/>
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/random-pokemon"  element={<RandomPokemonList />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;