import React, { useEffect, useRef, useState } from "react";
import "./css/App.css";
import leftButton from "./images/left-arrow.svg";
import rightButton from "./images/right-arrow.svg";
import Cookie from "./components/Cookie";

const moveSpeed = 50;

function App() {
  const basketRef = useRef();
  const [keyState, setKeyState] = useState({ left: false, right: false });
  const [cookies, setCookies] = useState([]);
  const [score, setScore] = useState(0);
  function handleLeftMove() {
    const style = getComputedStyle(basketRef.current);
    const left = Number(style.left.replace("px", ""));
    if (left - moveSpeed <= 0) {
      basketRef.current.style.left = `0px`;
      return;
    }
    basketRef.current.style.left = `${left - moveSpeed}px`;
  }
  function handleRightMove() {
    const style = getComputedStyle(basketRef.current);
    const right = Number(style.right.replace("px", ""));
    const left = Number(style.left.replace("px", ""));
    if (right - moveSpeed <= 0) {
      basketRef.current.style.left = `${right + left}px`;
      return;
    }
    basketRef.current.style.left = `${left + moveSpeed}px`;
  }
  function handleKeyDownEvent(e) {
    switch (e.key) {
      case "ArrowLeft":
        setKeyState((prev) => {
          return { ...prev, left: true };
        });
        break;
      case "ArrowRight":
        setKeyState((prev) => {
          return { ...prev, right: true };
        });
        break;
      default:
        return;
    }
  }
  function handleKeyUpEvent(e) {
    switch (e.key) {
      case "ArrowLeft":
        setKeyState((prev) => {
          return { ...prev, left: false };
        });
        break;
      case "ArrowRight":
        setKeyState((prev) => {
          return { ...prev, right: false };
        });
        break;
      default:
        return;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);
    window.addEventListener("keyup", handleKeyUpEvent);
    const x = setInterval(() => {
      setCookies((prev) => [
        ...prev,
        {
          speed: Math.random() * (2 - 1) + 1,
          xValue: Math.random() * (89 - 3) + 3,
        },
      ]);
    }, 2000);
    return () => {
      window.removeEventListener("keyup", handleKeyUpEvent);
      window.removeEventListener("keydown", handleKeyDownEvent);
      clearInterval(x);
    };
  }, []);

  useEffect(() => {
    const key = setInterval(() => {
      if (keyState.left) {
        handleLeftMove();
      }
      if (keyState.right) {
        handleRightMove();
      }
    }, 10);

    return () => clearInterval(key);
  }, [keyState]);

  function deleteCookie(data) {
    setCookies((prev) =>
      prev.filter((c) => c.xValue !== data.xValue && c.speed !== data.speed)
    );
  }
  return (
    <div className="main-container">
      <div className="inner-container">
        <span className="score">Score : {score}</span>
        {cookies.map((cookie) => {
          return (
            <Cookie
              speed={cookie.speed}
              xValue={cookie.xValue}
              deleteCookie={deleteCookie}
              setScore={setScore}
              basketRef={basketRef}
            />
          );
        })}
        <div className="basket" ref={basketRef}></div>
      </div>
      <div className="button-container">
        <div
          className="button"
          onTouchStart={() => handleKeyDownEvent({ key: "ArrowLeft" })}
          onTouchEnd={() => handleKeyUpEvent({ key: "ArrowLeft" })}
        >
          <img src={leftButton} alt="LEFT" />
        </div>
        <div
          className="button"
          onTouchStart={() => handleKeyDownEvent({ key: "ArrowRight" })}
          onTouchEnd={() => handleKeyUpEvent({ key: "ArrowRight" })}
        >
          <img src={rightButton} alt="RIGHT" />
        </div>
      </div>
    </div>
  );
}

export default App;
