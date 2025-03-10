import React from "react";
import { GameStatsProps } from "../types";

// Component for displaying game statistics
function GameStats({
  score,
  highScore,
  missedCookies,
}: GameStatsProps): JSX.Element {
  return (
    <div className="stats-container">
      <span className="score">Score: {score}</span>
      <span className="high-score">High: {highScore}</span>
      <span className="missed">Missed: {missedCookies}/5</span>
    </div>
  );
}

export default React.memo(GameStats);
