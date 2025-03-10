import { useState, useEffect, useCallback, useMemo } from "react";
import { Cookie, CookieGeneration, GameStateType } from "../types";

// Constants for cookie generation
const INITIAL_COOKIE_INTERVAL = 3000;
const MIN_COOKIE_INTERVAL = 1800;
const MAX_COOKIES_ON_SCREEN = 5;

// Custom hook to manage cookie generation
export function useCookieGeneration(
  gameState: GameStateType,
  difficulty: number
): CookieGeneration {
  const [cookies, setCookies] = useState<Cookie[]>([]);

  // Calculate cookie interval based on difficulty
  const cookieInterval = useMemo(() => {
    return Math.max(
      INITIAL_COOKIE_INTERVAL - difficulty * 300,
      MIN_COOKIE_INTERVAL
    );
  }, [difficulty]);

  // Delete a cookie
  const deleteCookie = useCallback((id: number, caught = false): boolean => {
    setCookies((prev) => prev.filter((cookie) => cookie.id !== id));
    return !caught; // Return true if the cookie was missed
  }, []);

  // Generate cookies at intervals
  useEffect(() => {
    let intervalId: number | undefined;

    if (gameState === "playing") {
      intervalId = window.setInterval(() => {
        setCookies((prev) => {
          // Don't add more cookies if we've reached the maximum
          if (prev.length >= MAX_COOKIES_ON_SCREEN) {
            return prev;
          }

          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              speed: Math.random() * (2.5 - 1.2) + 1.2,
              xValue: Math.random() * (89 - 3) + 3,
              type: Math.random() > 0.9 ? "golden" : "regular", // 10% chance for golden cookies
            },
          ];
        });
      }, cookieInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState, cookieInterval]);

  return {
    cookies,
    deleteCookie,
    resetCookies: () => setCookies([]),
  };
}
