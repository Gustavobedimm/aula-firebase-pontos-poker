import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./index.css";

function HomeGame() {
  const [totalTime, setTotalTime] = useState(15 * 60);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  const [isPaused, setIsPaused] = useState(true);
  const [reset, setReset] = useState(false);
  

  useEffect(() => {
    setTimeout(() => {
      if (!isPaused) {
        if (totalTime === 0 || reset === true) {
          setReset(false);
          setTotalTime(15 * 60);
          minutes = Math.floor(totalTime / 60);
          seconds = totalTime % 60;
        } else {
          setTotalTime(totalTime - 1);
        }
      }
    }, 1000);
  }, [totalTime]);

  function paused() {
    setIsPaused(true);
  }
  function unpaused() {
    setIsPaused(false);
    setTotalTime(totalTime - 1);
  }
  function reseted() {
    setReset(true);
  }

  return (
    <div className="container">
      <Card className="mt-3">
        <Card.Body>
          <div className="timer">
            <div className="time" id="minutes">
              {minutes.toString().padStart(2, "0")}
            </div>
            <div className="separator">:</div>
            <div className="time" id="seconds">
              {seconds.toString().padStart(2, "0")}
            </div>
          </div>
          <div className="buttons">
            <Button variant="success" className="btn" onClick={() => unpaused()}>
              Iniciar
            </Button>
            <Button variant="warning" onClick={() => paused()}>
              Pausar
            </Button>
            <Button variant="primary" onClick={() => unpaused()}>
              Continuar
            </Button>
            <Button variant="danger" onClick={() => reseted()}>
              Resetar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default HomeGame;
