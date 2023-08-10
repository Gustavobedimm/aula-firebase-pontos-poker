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
  const [jogadores, setJogadores] = useState([]);
  const [jogadoresJogo, setJogadoresJogo] = useState([]);
  const [sequencia, setSequencia] = useState("");
  const [fim, setFim] = useState("");
  const [inicio, setInicio] = useState("");
  const [idJogo, setIdJogo] = useState("");
  const [botao, setBotao] = useState("Cadastrar");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [senha, setSenha] = useState("");



  const[nomeJogador, setNomeJogador] = useState("");
  const[buyinJogador, setBuyinJogador] = useState("");
  const[rebuyJogador, setRebuyJogador] = useState("");
  const[addonJogador, setAddonJogador] = useState("");
  const[idJogador, setIdJogador] = useState("");
  
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

  const handleClose2 = () => {
    setShow2(false);
    setIdJogador("");
    setNomeJogador("");
    setBuyinJogador("");
    setRebuyJogador("");
    setAddonJogador("");
  };
  

  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);

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
        buscarJogadores();
        //mudei  o id para sequencia fazer direto ao cadastrar jogo add jogadores
        
        jogadoresJogoBuscar(jogo);
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
        id: sequencia,
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
        jogadoresAddJogo(sequencia);

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
  async function jogadoresAddJogo(id_jogo) {
      for (const item of jogadores) {
        await addDoc(collection(db, "Jogos_Jogadores"), {
          id: item.id,
          nome: item.titulo,
          buyin: 0,
          rebuy: 0,
          idJogo: id_jogo,
        })
          .then(() => {
          })
          .catch((error) => {
            console.log("Erro ao Cadastrar post" + error);
          });
        }
  }
  async function jogadoresJogoBuscar(jogo) {
      const unsub = onSnapshot(collection(db, "Jogos_Jogadores"), (snapshot2) => {
        let lista2 = [];
        snapshot2.forEach((doc) => {
          if(doc.data().idJogo === jogo.sequencia){
            lista2.push({
              id: doc.id,
              nome: doc.data().nome,
              buyin: doc.data().buyin,
              rebuy: doc.data().rebuy,
            });
          }
        });
        setJogadoresJogo(lista2);
    })
  }
  async function buscarJogadores() {
    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setJogadores(lista);
      })
      .catch((error) => {
        console.log("deu algum erro ao buscar" + error)
      })
  }

  return (
    <div className="App">
      <Container>
        <br></br>
        <Card>
          <Card.Header><Badge bg="success">Jogo em Andamento</Badge> - {jogoAtualSequencia} - Inicio : {jogoAtualInicio} {" "}
          </Card.Header>
          <Card.Body>
            <Card.Title>Jogadores </Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {jogadoresJogo.map((jogadoresJogo) => {
                  return (
                    <tr key={jogadoresJogo.id}>
                      <td>{jogadoresJogo.nome}  </td>
                      <td>
                        <Button as="a" variant="primary" size="sm" onClick={handleShow2}>
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



      <br></br>



      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Jogador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Jogador</Form.Label>
              <Form.Control
                disabled="true"
                type="text"
                placeholder="ID do Jogador"
                value={idJogador}
                onChange={(e) => setIdJogador(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome Jogador"
                value={nomeJogador}
                onChange={(e) => setNomeJogador(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Buy In</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buy In"
                value={buyinJogador}
                onChange={(e) => setBuyinJogador(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Rebuy</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rebuy"
                value={rebuyJogador}
                onChange={(e) => setRebuyJogador(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Add On</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add On"
                value={addonJogador}
                onChange={(e) => setAddonJogador(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Fechar
          </Button>
          <Button variant="primary" onClick={jogoAdd}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>



      






    </div>
  );
}

export default Jogos;
