import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RandomPokemonList.css';

interface Pokemon {
  pok_id: number;
  pok_name: string;
  type?: string;
}

const RandomPokemonList: React.FC = () => {
  const [randomPokemons, setRandomPokemons] = useState<Array<{name: string, image: string | null}>>([]);
  const navigate = useNavigate();

  const fetchRandomPokemons = async () => {
    try {
      const response = await axios.get('http://apipokemon.apiexall.com:3001/api/pokemon');
      console.log('Pokemon data:', response.data);
      
      const allPokemons = response.data;
      const shuffled = [...allPokemons].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 24);
      
      const pokemonsWithImages = await Promise.all(
        selected.map(async (pokemon: Pokemon) => {
          try {
            const imageResponse = await axios.get(
              `http://apipokemon.apiexall.com:3001/api/pic_poke?pok_name=${pokemon.pok_name}`
            );
            console.log('ImageResponse : ', imageResponse.data)
            return {
              name: pokemon.pok_name,
              image: imageResponse.data
            };
          } catch (error) {
            console.error('Error fetching image for:', pokemon.pok_name, error);
            return {
              name: pokemon.pok_name,
              image: null
            };
          }
        })
      );
      
      setRandomPokemons(pokemonsWithImages);
    } catch (error) {
      console.error('Error fetching random pokemons:', error);
    }
  };

  useEffect(() => {
    fetchRandomPokemons();
  }, []);

  return (
    <div className="pokemon-container">
      <div className="header">
        <h1>Random Pokemon List</h1>
        <div className="random-head-tab">
          <button onClick={() => navigate('/game')}>Back to Game</button>
          <button onClick={fetchRandomPokemons}>Refresh List</button>
        </div>
      </div>
      
      <div className="pokemon-grid">
  {randomPokemons.map((pokemon, index) => (
    <div key={index} className="random-pokemon-card">
      <div className="random-pokemon-image">
        <img 
          className="element-pokemon-cards"
          src={pokemon.image ? `data:image/jpeg;base64,${pokemon.image}` : ''}
          alt={pokemon.name}
        />
      </div>
      <div className="random-pokemon-name">{pokemon.name}</div>
    </div>
  ))}
</div>
    </div>
  );
};

export default RandomPokemonList;