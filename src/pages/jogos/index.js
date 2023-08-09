import { useState, useEffect } from "react";
import { db } from "../../firebaseConection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [sequencia, setSequencia] = useState("");
  const [fim, setFim] = useState("");
  const [inicio, setInicio] = useState("");
  const [idJogo, setIdJogo] = useState("");
  const [botao, setBotao] = useState("Cadastrar");
  const [show, setShow] = useState(false);
  const [senha, setSenha] = useState("");

  const [jogoAtual, setJogoAtual] = useState("");
  const [jogoAtualInicio, setJogoAtualInicio] = useState("");
  const [jogoAtualFim, setJogoAtualFim] = useState("");
  const [jogoAtualSequencia, setJogoAtualSequencia] = useState("");



  const handleClose = () => {
    setShow(false);
    setIdJogo("");
    setInicio("");
    setFim("");
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function loadJogos() {
      const unsub = onSnapshot(collection(db, "jogos"), (snapshot2) => {
        let lista2 = [];
        snapshot2.forEach((doc) => {
          lista2.push({
            id: doc.id,
            sequencia: doc.data().sequencia,
            inicio: doc.data().inicio,
            fim: doc.data().fim,
          });
        });
        lista2.sort(function (a, b) { return b.sequencia - a.sequencia });
        const jogo = lista2[0];

        setJogoAtualSequencia(jogo.sequencia);
        setJogoAtual(jogo.id);
        setJogoAtualInicio(jogo.inicio);
        setJogoAtualFim(jogo.fim);

        setJogos(lista2);
      });
    }
    loadJogos();
  }, []);
  async function jogoAdd() {
    if (senha === "199605") {
      //CADASTRAR NOVO
      await addDoc(collection(db, "jogos"), {
        sequencia: sequencia,
        inicio: inicio,
        fim: fim,
      })
        .then(() => {
          console.log("Cadastro realizado com sucesso");
          setIdJogo("");
          setSequencia("");
          setInicio("");
          setFim("");
          setShow(false);
        })
        .catch((error) => {
          console.log("Erro ao Cadastrar post" + error);
        });

      //EDITAR PELO ID
      //const docRef = doc(db, "jogos", idJogo);
      //await updateDoc(docRef, {
      //  sequencia: sequencia,
      //  inicio: inicio,
      //  fim: fim,
      //})
      //  .then(() => {
      //    console.log("jogo atualizxado");
      //    setShow(false);
      //    setIdJogo("");
      //    setSequencia("");
      //    setInicio("");
      //    setFim("");
      //  })
      //  .catch((error) => {
      //    console.log("erro ao atualizar jogo");
      //  });
      setBotao("Cadastrar");
    } else {
      alert("Senha incorreta");
      setShow(false);
      setIdJogo("");
      setSequencia("");
      setInicio("");
      setFim("");
    }
  }

  return (
    <div className="App">
      <Container>
        <br></br>
      <Card>
      <Card.Header><Badge bg="success">Jogo em Andamento</Badge> - {jogoAtualSequencia} - Inicio : {jogoAtualInicio} {" "}
          </Card.Header>
      <Card.Body>
        <Card.Title>Jogadores <Button as="a" size="sm" variant="success" onClick={handleShow}>+</Button></Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {jogos.map((jogos) => {
              return (
                <tr key={jogos.id}>
                  <td>{jogos.sequencia}  </td>
                  <td>
                    <Button as="a" variant="primary" size="sm">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        
        <Button as="a" size="sm" variant="danger" onClick={handleShow}>Finalizar Jogo</Button>
        
      </Card.Body>
    </Card>

        <br></br>
        
       
        <br></br>


        <h2>
          Jogos Finalizados{" "}
          <Button as="a" size="sm" variant="success" onClick={handleShow}>
            Novo Jogo
          </Button>
        </h2>
        <Table striped bordered hover>
          <thead>
            <tr>

              <th>Seq.</th>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {jogos.map((jogos) => {
              return (
                <tr key={jogos.id}>

                  <td>{jogos.sequencia} </td>
                  <td>{jogos.inicio} </td>
                  <td>{jogos.fim} </td>

                  <td>
                    <Button as="a" variant="primary" size="sm">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

      </Container>
      <br></br>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Jogo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Jogo</Form.Label>
              <Form.Control
                disabled="true"
                type="text"
                placeholder="ID do Jogo"
                value={idJogo}
                onChange={(e) => setIdJogo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sequencia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sequencial do jogo"
                value={sequencia}
                onChange={(e) => setSequencia(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Inicio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Data Inicio"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Fim</Form.Label>
              <Form.Control
                type="text"
                placeholder="Data Fim"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={jogoAdd}>
            Iniciar novo Jogo
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Jogos;
