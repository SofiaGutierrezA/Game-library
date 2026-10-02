import "./GameCard.css";

function GameCard({ game, handleDeleteGame }) {
  return (
    <div className="game-card">
      <h2>{game.title}</h2>
      <p>{game.genre}</p>
      <p>{game.platform}</p>

      <button onClick={() => handleDeleteGame(game.id)}>
        Delete
      </button>
    </div>
  );
}

export default GameCard;