import React from "react";
import { GameControlsProps } from "../types";

// Component for game controls (arrow buttons)
function GameControls({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
}: GameControlsProps): JSX.Element {
  return (
    <div className="button-container">
      <div className="button" onTouchStart={onLeftStart} onTouchEnd={onLeftEnd}>
        <img src="/left-arrow.svg" alt="LEFT" />
      </div>
      <div
        className="button"
        onTouchStart={onRightStart}
        onTouchEnd={onRightEnd}
      >
        <img src="/right-arrow.svg" alt="RIGHT" />
      </div>
    </div>
  );
}

export default React.memo(GameControls);
