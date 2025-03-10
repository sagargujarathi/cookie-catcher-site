import { useEffect, useRef } from "react";
import "./css/App.css";
import Cookie from "./components/Cookie";
import GameControls from "./components/GameControls";
import GameStats from "./components/GameStats";
import GameOverlay from "./components/GameOverlay";
import { useGameState } from "./hooks/useGameState";
import { useBasketMovement } from "./hooks/useBasketMovement";
import { useCookieGeneration } from "./hooks/useCookieGeneration";

function App(): JSX.Element {
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);

  // Custom hooks for game logic
  const {
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
  } = useGameState();

  const { handleKeyDown, handleKeyUp, resetBasketPosition } = useBasketMovement(
    basketRef,
    containerRef,
    gameState
  );

  const { cookies, deleteCookie, resetCookies } = useCookieGeneration(
    gameState,
    difficulty
  );

  // Handle complete game reset
  const handleResetGame = (): void => {
    resetGame();
    resetCookies();
    resetBasketPosition();
  };

  // Handle cookie deletion with missed cookie tracking
  const handleDeleteCookie = (id: number, caught: boolean): void => {
    // Delete cookie and check if it was missed
    const wasMissed = deleteCookie(id, caught);

    // Update missed cookies count if necessary
    if (wasMissed) {
      handleMissedCookie();
    }
  };

  // Add keyboard event listeners
  useEffect(() => {
    // Handle keyboard press events for game controls
    const handleKeyPress = (e: KeyboardEvent): void => {
      // Toggle pause with Escape key
      if (e.key === "Escape") {
        togglePause();
        return;
      }

      // Restart game with Spacebar when game over
      if (e.key === " " && gameState === "gameOver") {
        handleResetGame();
        return;
      }

      // Handle movement keys
      handleKeyDown({ key: e.key });
    };

    // Handle key release events
    const handleKeyRelease = (e: KeyboardEvent): void => {
      handleKeyUp({ key: e.key });
    };

    // Register event listeners
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [gameState, handleKeyDown, handleKeyUp, togglePause, handleResetGame]);

  return (
    <div className="main-container">
      {/* Pause or Game Over Overlays */}
      {gameState === "paused" && (
        <GameOverlay
          type="paused"
          score={score}
          onResume={() => setGameState("playing")}
          onRestart={handleResetGame}
        />
      )}

      {gameState === "gameOver" && (
        <GameOverlay
          type="gameOver"
          score={score}
          highScore={highScore}
          onRestart={handleResetGame}
        />
      )}

      <div className="inner-container" ref={containerRef}>
        {/* Game Statistics */}
        <GameStats
          score={score}
          highScore={highScore}
          missedCookies={missedCookies}
        />

        {/* Falling Cookies */}
        {cookies.map((cookie) => (
          <Cookie
            key={cookie.id}
            id={cookie.id}
            speed={cookie.speed}
            xValue={cookie.xValue}
            type={cookie.type}
            deleteCookie={handleDeleteCookie}
            setScore={setScore}
            basketRef={basketRef}
            gameState={gameState}
          />
        ))}

        {/* Player's Basket */}
        <div className="basket" ref={basketRef}></div>
      </div>

      {/* Game Controls */}
      <GameControls
        onLeftStart={() => handleKeyDown({ key: "ArrowLeft" })}
        onLeftEnd={() => handleKeyUp({ key: "ArrowLeft" })}
        onRightStart={() => handleKeyDown({ key: "ArrowRight" })}
        onRightEnd={() => handleKeyUp({ key: "ArrowRight" })}
      />
    </div>
  );
}

export default App;
