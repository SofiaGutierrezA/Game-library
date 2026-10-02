import { useEffect, useState } from "react";
import './App.css';


import GameCard from "./components/GameCard";
import Navbar from "./components/NavBar";

function App() {

  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");

  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");

  const [title, setTitle] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newPlatform, setNewPlatform] = useState("");


  
  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:3000/api/games?search=${search}&genre=${genre}&platform=${platform}&sort=${sort}&order=${order}`);

      const data = await res.json();
      setGames(data);
    } catch (err) {
       console.error(err); 
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch ("http://localhost:3000/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // convierte a json
        body: JSON.stringify({
          title,
          genre: newGenre,
          platform: newPlatform
        })
      });
      // recoge la respuesta del servidor
      const data = await res.json();
      setGames([...games, data]);
      //Vacía los campos
      setTitle("");
      setNewGenre("");
      setNewPlatform(""); 
    } catch (err) {
       console.error(err);
    }
  }

  const handleEditGame = async (id, updatedGame) => {
    try {
      const res = await fetch(`http://localhost:3000/api/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
         body: JSON.stringify(updatedGame)
      });
      const data = await res.json();
      //if condition 
      setGames(games.map((game) => (game.id === id ? data : game)));
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeleteGame = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/games/${id}`, {
        method: "DELETE"
      });
      setGames(games.filter((game) => game.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/games")
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
      });
  }, []);

  return (
    <div className="App">
      <Navbar />
      
   
      <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Search game"
        value={search}
        onChange={(e) => setSearch(e.target.value)}  
      />  
      <select
        value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
        <option value="">All genres</option>
        <option value="RPG">RPG</option>
        <option value="Action">Action</option>
        <option value="Adventure">Adventure</option>
      </select>
      
      <select
        value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
        <option value="">All platforms</option>
        <option value="PC">PC</option>
        <option value="PlayStation">PlayStation</option>
        <option value="Xbox">Xbox</option>
      </select>

      
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}>
        <option value="title">Sort by Title</option>
        <option value="genre">Sort by Genre</option>
        <option value="platform">Sort by Platform</option>
      </select>

      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}>
        <option value="asc">A-Z</option>
        <option value="desc">Z-A</option>
      </select>
      <button type="submit">Search</button>

      </form>


      <form onSubmit = {handleAddGame} className="add-form">
         <input
          type="text"
          placeholder="Game title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
         <input
          type="text"
          placeholder="Genre"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        />
         <input
          type="text"
          placeholder="Platform"
          value={newPlatform}
          onChange={(e) => setNewPlatform(e.target.value)}
        />

        <button type="submit">Add Game</button>
      </form>
      
      <div className="games-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} handleDeleteGame={handleDeleteGame} handleEditGame={handleEditGame} />
        ))}
        </div>

    </div>
    
  );
}

export default App;

