import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./index.css";
import ProgressBar from 'react-bootstrap/ProgressBar';
import useSound from 'use-sound';
import mySound from '../../assets/som.mp3' ;


function HomeGame() {
  const [totalTime, setTotalTime] = useState(15 * 60);
  const [levelAtual, setLevelAtual] = useState(1);
  const [levelAtualTela, setLevelAtualTela] = useState(1);
  const [blindAtual, setBlindAtual] = useState("10/20");
  const [nextBlind, setNextBlind] = useState("25/50");
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  const [isPaused, setIsPaused] = useState(true);
  const [reset, setReset] = useState(false);
  const [playSound] = useSound(mySound);

  const levels = [ {
    level: '1',
    level2: '2',
    blind: '10/20',
    nextLevel: '25/50'
  },
  {
   level: '2',
   level2: '3',
   blind: '25/50',
   nextLevel: '50/100'
 },
 {
   level: '3',
   level2: '4',
   blind: '50/100',
   nextLevel: '100/200'
 },
 {
   level: '4',
   level2: '5',
   blind: '100/200',
   nextLevel: '150/300'
 },
 {
   level: '5',
   level2: '6',
   blind: '150/300',
   nextLevel: '200/400'
 },
 {
  level: '6',
  level2: '7',
  blind: '200/400',
  nextLevel: '300/600'
},
{
  level: '7',
  level2: '8',
  blind: '300/600',
  nextLevel: '400/800'
},
{
  level: '8',
  level2: '9',
  blind: '400/800',
  nextLevel: '800/1600'
},
{
  level: '9',
  level2: '10',
  blind: '800/1600',
  nextLevel: '1000/2000'
},
{
  level: '10',
  level2: '11',
  blind: '1000/2000',
  nextLevel: '1500/3000'
},
{
  level: '11',
  level2: '12',
  blind: '1500/3000',
  nextLevel: '2000/4000'
},
{
  level: '12',
  level2: '13',
  blind: '2000/4000',
  nextLevel: '4000/8000'
},
{
  level: '13',
  level2: '14',
  blind: '4000/8000',
  nextLevel: '8000/1600'
},
{
  level: '14',
  level2: '15',
  blind: '8000/16000',
  nextLevel: '16000/32000'
},
{
  level: '15',
  level2: '16',
  blind: '16000/32000',
  nextLevel: '32000/64000'
},
{
  level: '16',
  level2: '1',
  blind: '32000/64000',
  nextLevel: '64000/128000'
},
  
  ];


  useEffect(() => {
    
    setTimeout(() => {
      if (!isPaused) {
        if(reset){
          setReset(false);
          setTotalTime(15 * 60);
          minutes = Math.floor(totalTime / 60);
          seconds = totalTime % 60;
        }else{
        if (totalTime === 0 || levelAtual === 1) {
          for (const item of levels) {
            if(item.level === levelAtual.toString()){
              setLevelAtualTela(item.level);
              setLevelAtual(item.level2);
              setBlindAtual(item.blind);
              setNextBlind(item.nextLevel);
            }
          }

          playSound();
          setTotalTime(15 * 60);
          minutes = Math.floor(totalTime / 60);
          seconds = totalTime % 60;

        } else {
          if (!isPaused) {
          setTotalTime(totalTime - 1);
          }
        }
      }}
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
            <Button variant="danger" onClick={() => reseted()}>
              Resetar
            </Button>
          </div>
          <br></br>
          <ProgressBar animated variant="success" now={totalTime} min={0} max={900} />
        </Card.Body>
      </Card>
      
      <Card className="mt-3">
      <Card.Body >
      <Container fluid>
      <Row>
        <Col  className="align"><span className="level">Level {levelAtualTela}</span></Col>
      </Row>
      <Row>
        <Col  className="align"><span className="blind"> Blind {blindAtual}</span></Col>
      </Row>
      <Row>
        <Col  className="align"><span className="nextLevel">Next Level - {nextBlind}</span></Col>
      </Row>
      <br></br>
      <Row>
        <Col  className="align"><Button variant="success" className="btn">- Nivel</Button><Button variant="success" className="btn">+Nivel</Button></Col>
      </Row>
    </Container>
      </Card.Body>
      </Card>
    </div>
  );
}

export default HomeGame;
