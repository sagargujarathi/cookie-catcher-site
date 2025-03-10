import { useState, useEffect, useCallback } from "react";
import { GameState, GameStateType } from "../types";

// Custom hook to manage the game state (playing, paused, game over)
export function useGameState(): GameState {
  const [gameState, setGameState] = useState<GameStateType>("playing");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem("cookieCatcherHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [missedCookies, setMissedCookies] = useState<number>(0);

  // Update high score when score increases
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("cookieCatcherHighScore", score.toString());
    }
  }, [score, highScore]);

  // Increase difficulty as score increases
  useEffect(() => {
    if (score > 0 && score % 15 === 0 && difficulty < 4) {
      setDifficulty((prev) => Math.min(prev + 1, 4));
    }
  }, [score, difficulty]);

  // End game if too many cookies are missed
  useEffect(() => {
    if (missedCookies >= 5) {
      setGameState("gameOver");
    }
  }, [missedCookies]);

  // Toggle pause state
  const togglePause = useCallback(() => {
    setGameState((prev) => (prev === "playing" ? "paused" : "playing"));
  }, []);

  // Reset the game
  const resetGame = useCallback(() => {
    setScore(0);
    setMissedCookies(0);
    setDifficulty(1);
    setGameState("playing");
  }, []);

  // Handle missed cookies
  const handleMissedCookie = useCallback(() => {
    setMissedCookies((prev) => prev + 1);
  }, []);

  return {
    gameState,
    setGameState,
    score,
    setScore,
    highScore,
    difficulty,
    missedCookies,
    togglePause,
    resetGame,
    handleMissedCookie,
  };
}
