// Game state types
export type GameStateType = "playing" | "paused" | "gameOver";
export type CookieType = "regular" | "golden";

// Cookie object type
export interface Cookie {
  id: number;
  speed: number;
  xValue: number;
  type: CookieType;
}

// Component prop types
export interface CookieProps {
  id: number;
  xValue: number;
  speed: number;
  type?: CookieType;
  deleteCookie: (id: number, caught: boolean) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  basketRef: React.RefObject<HTMLDivElement>;
  gameState: GameStateType;
}

export interface GameStatsProps {
  score: number;
  highScore: number;
  missedCookies: number;
}

export interface GameControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
}

export interface GameOverlayProps {
  type: GameStateType;
  score: number;
  highScore?: number;
  onResume?: () => void;
  onRestart: () => void;
}

// Hook return types
export interface GameState {
  gameState: GameStateType;
  setGameState: React.Dispatch<React.SetStateAction<GameStateType>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  highScore: number;
  difficulty: number;
  missedCookies: number;
  togglePause: () => void;
  resetGame: () => void;
  handleMissedCookie: () => void;
}

export interface BasketMovement {
  handleKeyDown: (e: { key: string }) => void;
  handleKeyUp: (e: { key: string }) => void;
  resetBasketPosition: () => void;
}

export interface CookieGeneration {
  cookies: Cookie[];
  deleteCookie: (id: number, caught: boolean) => boolean;
  resetCookies: () => void;
}
