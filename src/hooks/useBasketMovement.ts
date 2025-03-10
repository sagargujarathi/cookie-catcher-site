import { useState, useCallback, useEffect, RefObject } from "react";
import { BasketMovement, GameStateType } from "../types";

const MOVE_SPEED = 50;
const KEYBOARD_CHECK_INTERVAL = 10;

interface KeyState {
  left: boolean;
  right: boolean;
}

// Custom hook to handle basket movement
export function useBasketMovement(
  basketRef: RefObject<HTMLDivElement>,
  containerRef: RefObject<HTMLDivElement>,
  gameState: GameStateType
): BasketMovement {
  const [keyState, setKeyState] = useState<KeyState>({
    left: false,
    right: false,
  });

  // Handle left movement
  const handleLeftMove = useCallback(() => {
    if (!basketRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const basket = basketRef.current.getBoundingClientRect();
    const leftPosition = basket.left - container.left;

    if (leftPosition - MOVE_SPEED <= 0) {
      basketRef.current.style.left = "0px";
    } else {
      basketRef.current.style.left = `${leftPosition - MOVE_SPEED}px`;
    }
  }, [basketRef, containerRef]);

  // Handle right movement
  const handleRightMove = useCallback(() => {
    if (!basketRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const basket = basketRef.current.getBoundingClientRect();
    const leftPosition = basket.left - container.left;
    const maxRight = container.width - basket.width;

    if (leftPosition + MOVE_SPEED >= maxRight) {
      basketRef.current.style.left = `${maxRight}px`;
    } else {
      basketRef.current.style.left = `${leftPosition + MOVE_SPEED}px`;
    }
  }, [basketRef, containerRef]);

  // Handle keyboard down events
  const handleKeyDown = useCallback((e: { key: string }) => {
    switch (e.key) {
      case "ArrowLeft":
        setKeyState((prev) => ({ ...prev, left: true }));
        break;
      case "ArrowRight":
        setKeyState((prev) => ({ ...prev, right: true }));
        break;
      default:
        break;
    }
  }, []);

  // Handle keyboard up events
  const handleKeyUp = useCallback((e: { key: string }) => {
    switch (e.key) {
      case "ArrowLeft":
        setKeyState((prev) => ({ ...prev, left: false }));
        break;
      case "ArrowRight":
        setKeyState((prev) => ({ ...prev, right: false }));
        break;
      default:
        break;
    }
  }, []);

  // Update basket position based on key state
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      if (keyState.left) handleLeftMove();
      if (keyState.right) handleRightMove();
    }, KEYBOARD_CHECK_INTERVAL);

    return () => clearInterval(moveInterval);
  }, [keyState, gameState, handleLeftMove, handleRightMove]);

  // Reset basket position to center
  const resetBasketPosition = useCallback(() => {
    if (basketRef.current) {
      basketRef.current.style.left = "calc(50% - 50px)";
    }
  }, [basketRef]);

  return {
    handleKeyDown,
    handleKeyUp,
    resetBasketPosition,
  };
}
