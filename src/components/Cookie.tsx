import React, { useEffect, useRef, useCallback } from "react";
import "../css/Cookie.css";
import { CookieProps } from "../types";

function Cookie({
  id,
  xValue,
  speed,
  type = "regular",
  deleteCookie,
  setScore,
  basketRef,
  gameState,
}: CookieProps): JSX.Element {
  const cookieRef = useRef<HTMLDivElement>(null);
  const collisionCheckRef = useRef<number | null>(null);

  // Determine point value based on cookie type
  const pointValue = type === "golden" ? 3 : 1;

  // Collision detection logic
  const checkCollision = useCallback(() => {
    // Skip collision check if game is not playing or refs aren't available
    if (gameState !== "playing" || !cookieRef.current || !basketRef.current) {
      return;
    }

    const basketRect = basketRef.current.getBoundingClientRect();
    const cookieRect = cookieRef.current.getBoundingClientRect();

    // Cookie caught by basket
    if (
      cookieRect.bottom >= basketRect.top &&
      cookieRect.bottom <= basketRect.bottom + 20 &&
      cookieRect.right >= basketRect.left &&
      cookieRect.left <= basketRect.right
    ) {
      // Add score and show catch animation
      setScore((prev) => prev + pointValue);
      cookieRef.current.classList.add("caught");

      // Remove cookie after animation
      setTimeout(() => {
        deleteCookie(id, true);
      }, 100);
      return;
    }

    // Cookie has fallen past the basket
    if (cookieRect.top > basketRect.bottom + 20) {
      deleteCookie(id, false);
      return;
    }

    // Continue checking for collisions
    collisionCheckRef.current = requestAnimationFrame(checkCollision);
  }, [id, deleteCookie, setScore, basketRef, gameState, pointValue]);

  // Manage animation play state
  useEffect(() => {
    if (!cookieRef.current) return;

    if (gameState === "playing") {
      cookieRef.current.style.animationPlayState = "running";
      collisionCheckRef.current = requestAnimationFrame(checkCollision);
    } else {
      cookieRef.current.style.animationPlayState = "paused";
      if (collisionCheckRef.current !== null) {
        cancelAnimationFrame(collisionCheckRef.current);
      }
    }

    return () => {
      if (collisionCheckRef.current !== null) {
        cancelAnimationFrame(collisionCheckRef.current);
      }
    };
  }, [gameState, checkCollision]);

  // Maximum cookie lifetime
  useEffect(() => {
    if (gameState !== "playing") return;

    const maxLifetime = setTimeout(() => {
      deleteCookie(id, false);
    }, (speed + 1) * 1000);

    return () => clearTimeout(maxLifetime);
  }, [id, speed, deleteCookie, gameState]);

  return (
    <div
      className={`cookie ${type}`}
      style={{
        left: `${xValue}%`,
        animationDuration: `${speed}s`,
        animationPlayState: gameState === "playing" ? "running" : "paused",
      }}
      ref={cookieRef}
    ></div>
  );
}

export default React.memo(Cookie);
