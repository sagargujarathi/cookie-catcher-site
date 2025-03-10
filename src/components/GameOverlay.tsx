import React from "react";
import { GameOverlayProps } from "../types";

// Component for game overlays (pause and game over screens)
function GameOverlay({
  type,
  score,
  highScore,
  onResume,
  onRestart,
}: GameOverlayProps): JSX.Element | null {
  if (type === "paused") {
    return (
      <div className="game-overlay">
        <div className="game-message">
          <h2>Game Paused</h2>
          <div className="score-display">Score: {score}</div>
          <button onClick={onResume}>Resume</button>
          <button onClick={onRestart}>Restart</button>
        </div>
      </div>
    );
  }

  if (type === "gameOver") {
    return (
      <div className="game-overlay">
        <div className="game-message">
          <h2>Game Over</h2>
          <div className="score-display">Final Score: {score}</div>
          <div className="high-score">High Score: {highScore}</div>
          <button onClick={onRestart}>Play Again</button>
        </div>
      </div>
    );
  }

  return null;
}

export default React.memo(GameOverlay);
