import React, { useEffect, useState } from "react";

const RandomCard: React.FC = () => {
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRandomPokemon = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/pic_poke${
          Math.floor(Math.random() * 898) + 1
        }`
      );
      const data = await response.json();
      setPokemon(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching random Pokemon:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Random Pokémon</h1>
      {pokemon && (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
      )}
    </div>
  );
};

export default RandomCard;
