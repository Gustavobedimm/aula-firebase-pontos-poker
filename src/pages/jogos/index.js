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
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { ToastContainer, toast } from "react-toastify";
import InputGroup from "react-bootstrap/InputGroup";
import "react-toastify/dist/ReactToastify.css";
import JSConfetti from "js-confetti";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [jogadoresJogo, setJogadoresJogo] = useState([]);
  const [jogadoresJogoInativos, setJogadoresJogoInativos] = useState([]);
  const [sequencia, setSequencia] = useState("");
  const [fim, setFim] = useState("");
  const [inicio, setInicio] = useState("");
  const [idJogo, setIdJogo] = useState("");
  const [botao, setBotao] = useState("Cadastrar");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [visible, setVisible] = useState(false);

  const jsConfetti = new JSConfetti();
  const navigate = useNavigate();
  const goRanking = () => {
    navigate("/");
  };
  const goTimer = () => {
    navigate("/homegame");
  };

  const [idJogadorJogo, setIdJogadorJogo] = useState("");
  const [buyin, setBuyin] = useState("");
  const [rebuy, setRebuy] = useState("");
  const [addon, setAddon] = useState("");
  const [somaBuyin, setSomaBuyin] = useState("");
  const [somaRebuy, setSomaRebuy] = useState("");
  const [somaAddon, setSomaAddon] = useState("");
  const [nome, setNome] = useState("");
  const [dataAtual, setDataAtual] = useState("");

  const [nomeJogador, setNomeJogador] = useState("");
  const [buyinJogador, setBuyinJogador] = useState("");
  const [rebuyJogador, setRebuyJogador] = useState("");
  const [addonJogador, setAddonJogador] = useState("");
  const [idJogador, setIdJogador] = useState("");

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

  const handleShow = () => {
    if (jogoAtualFim === "Em Andamento") {
      toast.warning("Ja existe um jogo em Andamento.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      montadata();
      setShow(true);
    }
  };
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
        //ordena por sequencia
        lista2.sort(function (a, b) {
          return b.sequencia - a.sequencia;
        });
        //pega o jogo de maior sequencia
        const jogo = lista2[0];
        setJogos(lista2);
        //busca jogadores do ranking para adicionar no jogo posteriormente
        buscarJogadores();
        if (jogo.fim === "Em Andamento") {
          setVisible(true);
          jogadoresJogoBuscar(jogo);
          setJogoAtualSequencia(jogo.sequencia);
          setJogoAtual(jogo.id);
          setJogoAtualInicio(jogo.inicio);
          setJogoAtualFim(jogo.fim);
        } else {
          const proxSequencia = Number(jogo.sequencia) + 1;
          setSequencia(proxSequencia);
          setVisible(false);
        }
      });
    }
    loadJogos();
  }, []);

  function botaoAdd(par) {
    if (par === 1) {
      setBuyin(buyin + 1);
    }
    if (par === 2) {
      setRebuy(rebuy + 1);
    }
    if (par === 3) {
      setAddon(addon + 1);
    }
    if (par === -1) {
      setBuyin(buyin - 1);
    }
    if (par === -2) {
      setRebuy(rebuy - 1);
    }
    if (par === -3) {
      setAddon(addon - 1);
    }
  }
  function montadata() {
    const date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const ano = date.getFullYear();
    const h = date.getHours();
    const m = date.getMinutes();
    const StringdataAtual = dia + "/" + mes + "/" + ano + " " + h + ":" + m;
    setDataAtual(StringdataAtual);
    return StringdataAtual;
  }
  async function jogoAdd() {
    //CADASTRAR NOVO
    await addDoc(collection(db, "jogos"), {
      id: sequencia,
      sequencia: sequencia,
      inicio: dataAtual,
      fim: "Em Andamento",
    })
      .then(() => {
        setShow(false);
        setIdJogo("");
        setSequencia("");
        setInicio("");
        setFim("");
      })
      .catch((error) => {
        console.log("Erro ao Cadastrar Jogo" + error);
      });
    jogadoresAddJogo(sequencia);

    setBotao("Cadastrar");
  }
  async function eliminaJogador(id, buyin) {
    if (buyin < 1) {
      const docRef = doc(db, "Jogos_Jogadores", id);
      await updateDoc(docRef, {
        ativo: false,
        posicao: 0,
        pontos: 0,
      })
        .then(() => {})
        .catch((error) => {
          alert(error);
        });
    } else {
      //calculo de pontos
      let posicao = jogadoresJogo.length;
      let pontos = 0;
      if (posicao > 5) {
        pontos = 40;
      } else if (posicao === 5) {
        pontos = 55;
      } else if (posicao === 4) {
        pontos = 65;
      } else if (posicao === 3) {
        pontos = 75;
      } else if (posicao === 2) {
        pontos = 85;
      } else if (posicao === 1) {
        pontos = 100;
      }
      //calculo de pontos
      const docRef = doc(db, "Jogos_Jogadores", id);
      await updateDoc(docRef, {
        ativo: false,
        posicao: jogadoresJogo.length,
        pontos: pontos,
      })
        .then(() => {})
        .catch((error) => {
          alert(error);
        });
    }
    setShow2(false);
  }
  async function voltaParaOJogo(id) {
    
      const docRef = doc(db, "Jogos_Jogadores", id);
      await updateDoc(docRef, {
        ativo: true,
        
      })
        .then(() => {})
        .catch((error) => {
          alert(error);
        });
    
    
  }
  async function alteraJogadorJogo() {
    const docRef = doc(db, "Jogos_Jogadores", idJogadorJogo);
    await updateDoc(docRef, {
      buyin: buyin,
      rebuy: rebuy,
      addon: addon,
    })
      .then(() => {
        setShow2(false);
        setIdJogadorJogo("");
        setBuyin("");
        setRebuy("");
        setAddon("");
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function editarPost(id, atual, novo) {
    const temp1 = parseInt(atual);
    const temp2 = parseInt(novo);
    let total = temp1 + temp2;
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, {
      autor: total,
    })
      .then(() => {
        console.log("pontos atualizados");
      })
      .catch((error) => {
        console.log("erro ao atualizar pontos");
      });
  }

  async function finalizaJogo() {
    if (jogoAtual.length > 0) {
      if (jogadoresJogo.length > 1) {
        toast.error("Espere todos os jogadores sairem do Jogo atual.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const StringDataAtual = montadata();
        //EDITAR PELO ID
        const docRef = doc(db, "jogos", jogoAtual);
        await updateDoc(docRef, {
          fim: StringDataAtual,
        })
          .then(() => {
            jsConfetti.addConfetti({
              emojis: ["🏆", "💵"],
              emojiSize: 50,
              confettiNumber: 100,
            });
          })
          .catch((error) => {
            alert(error);
          });

        //atualizando pontos dos jogadores
        jogadores.map((jogadorRankingTemp) => {
          jogadoresJogoInativos.map((jogadorJogo) => {
            if (jogadorRankingTemp.id === jogadorJogo.id_post) {
              editarPost(
                jogadorRankingTemp.id,
                jogadorRankingTemp.autor,
                jogadorJogo.pontos
              );
            }
          });
        });
        setJogoAtual("");
        setJogoAtualInicio("");
        setJogoAtualFim("");
        setJogoAtualSequencia("");
        setJogadoresJogo([]);
        setJogadoresJogoInativos([]);
      }
    } else {
      toast.error("Nenhum jogo para Finalizar.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  async function jogadoresAddJogo(id_jogo) {
    for (const item of jogadores) {
      await addDoc(collection(db, "Jogos_Jogadores"), {
        nome: item.titulo,
        buyin: 0,
        rebuy: 0,
        addon: 0,
        idJogo: id_jogo,
        ativo: true,
        posicao: 0,
        pontos: 0,
        id_post: item.id,
      })
        .then(() => {})
        .catch((error) => {
          console.log("Erro ao Cadastrar post" + error);
        });
    }
  }
  async function jogadoresJogoBuscar(jogo) {
    const unsub = onSnapshot(collection(db, "Jogos_Jogadores"), (snapshot2) => {
      let lista2 = [];
      let lista3 = [];
      let somaBuyin = 0;
      let somaRebuy = 0;
      let somaAddon = 0;
      snapshot2.forEach((doc) => {
        if (doc.data().idJogo === jogo.sequencia && doc.data().ativo === true) {
          lista2.push({
            id: doc.id,
            nome: doc.data().nome,
            buyin: doc.data().buyin,
            rebuy: doc.data().rebuy,
            addon: doc.data().addon,
          });
          somaBuyin = somaBuyin + doc.data().buyin;
          somaAddon = somaAddon + doc.data().addon;
          somaRebuy = somaRebuy + doc.data().rebuy;
        }
        if (
          doc.data().idJogo === jogo.sequencia &&
          doc.data().ativo === false &&
          doc.data().buyin > 0
        ) {
          lista3.push({
            id: doc.id,
            nome: doc.data().nome,
            buyin: doc.data().buyin,
            rebuy: doc.data().rebuy,
            addon: doc.data().addon,
            posicao: doc.data().posicao,
            pontos: doc.data().pontos,
            id_post: doc.data().id_post,
          });
          somaBuyin = somaBuyin + doc.data().buyin;
          somaAddon = somaAddon + doc.data().addon;
          somaRebuy = somaRebuy + doc.data().rebuy;
        }
        setSomaBuyin(somaBuyin);
        setSomaRebuy(somaRebuy);
        setSomaAddon(somaAddon);
      });
      setJogadoresJogo(lista2);
      lista2.sort(function (a, b) {
        return b.buyin - a.buyin;
      });
      lista3.sort(function (a, b) {
        return a.posicao - b.posicao;
      });

      setJogadoresJogoInativos(lista3);
    });
  }
  async function buscarJogadores() {
    const postsRef = collection(db, "posts");
    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setJogadores(lista);
      })
      .catch((error) => {
        console.log("deu algum erro ao buscar" + error);
      });
  }
  async function editarJogadorJogo(id, buyin, rebuy, addon, nome) {
    setShow2(true);
    setIdJogadorJogo(id);
    setBuyin(buyin);
    setRebuy(rebuy);
    setAddon(addon);
    setNome(nome);
  }
  return (
    <div className="App">
      <Container>
        {/* CARD JOGO AO VIVO ---------------------------------------------------------------------------------- */}
        {visible && (
          <Card className="mt-4">
            <Card.Header>
              <Badge bg="danger">
                {" "}
                {" "}
                Em Andamento
              </Badge>{" "}
              <Badge bg="success">
                Jogo em Andamento - {jogoAtualSequencia}
              </Badge>{" "}
              <Badge bg="primary">Inicio - {jogoAtualInicio}</Badge>{" "}
            </Card.Header>
            <Card.Body>
              <Card.Title>Jogadores no Jogo 🤑 </Card.Title>
              <Table  bordered >
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Bi</th>
                    <th>Rb</th>
                    <th>Ao</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {jogadoresJogo.map((jogadoresJogoTemp) => {
                    return (
                      <tr key={jogadoresJogoTemp.id}>
                        <td>{jogadoresJogoTemp.nome} </td>
                        {jogadoresJogoTemp.buyin > 0 ? (
                          <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                            <Badge bg="success" className="w-100">
                            PG
                            </Badge>{" "}
                          </td>
                        ) : (
                          <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                            <Badge bg="danger" className="w-100">
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              
                            </Badge>{" "}
                          </td>
                        )}
                        {jogadoresJogoTemp.rebuy > 0 ? (
                          <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Badge bg="success" className="w-100">
                            {jogadoresJogoTemp.rebuy}{" "}
                          </Badge>{" "}
                        </td>
                          ) : (
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          
                        </td>
                          )}
                        {jogadoresJogoTemp.addon > 0 ? (
                          <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Badge bg="success" className="w-100">
                            {jogadoresJogoTemp.addon}{" "}
                          </Badge>{" "}
                        </td>
                          ) : (
                            <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          
                        </td>
                            )}
                        
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Button
                            as="a"
                            variant="primary"
                            size="sm"
                            className="w-100"
                            onClick={() =>
                              editarJogadorJogo(
                                jogadoresJogoTemp.id,
                                jogadoresJogoTemp.buyin,
                                jogadoresJogoTemp.rebuy,
                                jogadoresJogoTemp.addon,
                                jogadoresJogoTemp.nome
                              )
                            }
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Card.Title>Jogadores Eliminados 💀 </Card.Title>
              <Table  bordered >
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Bi</th>
                    <th>Rb</th>
                    <th>Ao</th>
                    <th>Pontos</th>
                    <th>Posição</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {jogadoresJogoInativos.map((jogadoresJogo) => {
                    if(jogadoresJogoInativos.length < 1){
                      return(
                        <tr>
                        <td>Nenhum</td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          0
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          0
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          0
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          0
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          0
                        </td>
                      </tr>
                      );
                    }else{
                    return (
                          <tr key={jogadoresJogo.id}>
                        <td>{jogadoresJogo.nome} </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Badge bg="dark" className="w-100">
                            {jogadoresJogo.buyin}
                          </Badge>{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Badge bg="dark" className="w-100">
                            {jogadoresJogo.rebuy}{" "}
                          </Badge>{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Badge bg="dark" className="w-100">
                            {jogadoresJogo.addon}{" "}
                          </Badge>{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {" "}
                          {jogadoresJogo.pontos}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {" "}
                          {jogadoresJogo.posicao}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <Button
                            as="a"
                            variant="danger"
                            size="sm"
                            className="w-100"
                            onClick={() =>
                              voltaParaOJogo(jogadoresJogo.id)
                            }
                          >
                            Voltar
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                  })}
                </tbody>
              </Table>
              <Card.Title>Totais</Card.Title>
              <Table  bordered >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bi</th>
                    <th>Rb</th>
                    <th>Ao</th>
                    <th>Soma</th>
                    <th>Premiação</th>
                  </tr>
                </thead>
                <tbody>
                        <tr>
                        <td><b>Total</b></td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {somaBuyin}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {somaRebuy}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {somaAddon}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {somaBuyin+somaRebuy+somaAddon}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                        <Badge bg="success" className="w-100">
                            
                          R$ {10 * (somaBuyin+somaRebuy+somaAddon)} </Badge>
                        </td>
                      </tr>
                </tbody>
              </Table>

              <Button as="a" size="sm" variant="primary" onClick={finalizaJogo}>
                {" "}
                🏁 Finalizar Jogo
              </Button>
            </Card.Body>
          </Card>
        )}
        <br></br>

        {/* CARD JOGOS ---------------------------------------------------------------------------------- */}
        <Card>
          <Card.Header>
            <Badge bg="primary">Finalizados</Badge>
          </Card.Header>
          <Card.Body>
            <Card.Title>Jogos Finalizados</Card.Title>
            <Table  bordered >
              <thead>
                <tr>
                  <th>Seq.</th>
                  <th>Inicio</th>
                  <th>Fim</th>
                </tr>
              </thead>
              <tbody>
                {jogos.map((jogos) => {
                  return (
                    <tr key={jogos.id}>
                      <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                        {jogos.sequencia}{" "}
                      </td>
                      <td>{jogos.inicio} </td>
                      <td>{jogos.fim} </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Button as="a" size="sm" variant="success" onClick={handleShow}>
              🤑 Novo Jogo
            </Button>
          </Card.Body>
        </Card>
        <br></br>
        <Button as="a" variant="success" onClick={goRanking}>
          🏆 Ranking
        </Button>
        
        <Button as="a" variant="success" onClick={goTimer}>
        🕗 Timer
        </Button>
      </Container>
      <br></br>

      {/* MODAl NOVO JOGO ---------------------------------------------------------------------------------- */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Jogo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sequencia</Form.Label>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Sequencial do jogo"
                value={sequencia}
                onChange={(e) => setSequencia(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Inicio</Form.Label>
              <Form.Control
                disabled="true"
                type="text"
                placeholder="Data Inicio"
                value={dataAtual}
                onChange={(e) => setInicio(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Fim</Form.Label>
              <Form.Control
                disabled="true"
                type="text"
                placeholder="Data Fim"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
              />
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
      {/* MODAL EDITA JOGADOR ---------------------------------------------------------------------------------- */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>{nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Buy In</Form.Label>
            <InputGroup className="mb-3">
              <Button
                variant="outline-danger"
                id="button-addon1"
                onClick={() => botaoAdd(-1)}
              >
                -
              </Button>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Buy In"
                value={buyin}
                onChange={(e) => setBuyin(e.target.value)}
              />
              <Button
                variant="outline-success"
                id="button-addon1"
                onClick={() => botaoAdd(1)}
              >
                +
              </Button>
            </InputGroup>
            <Form.Label>Rebuy</Form.Label>
            <InputGroup className="mb-3">
              <Button
                variant="outline-danger"
                id="button-addon1"
                onClick={() => botaoAdd(-2)}
              >
                -
              </Button>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Rebuy"
                value={rebuy}
                onChange={(e) => setRebuy(e.target.value)}
              />
              <Button
                variant="outline-success"
                id="button-addon1"
                onClick={() => botaoAdd(2)}
              >
                +
              </Button>
            </InputGroup>
            <Form.Label>Addon</Form.Label>
            <InputGroup className="mb-3">
              <Button
                variant="outline-danger"
                id="button-addon2"
                onClick={() => botaoAdd(-3)}
              >
                -
              </Button>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Add On"
                value={addon}
                onChange={(e) => setAddon(e.target.value)}
              />
              <Button
                variant="outline-success"
                id="button-addon3"
                onClick={() => botaoAdd(3)}
              >
                +
              </Button>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            as="a"
            variant="danger"
            onClick={() => eliminaJogador(idJogadorJogo, buyin)}
          >
            Sair do jogo
          </Button>
          <Button variant="secondary" onClick={handleClose2}>
            Fechar
          </Button>
          <Button variant="primary" onClick={alteraJogadorJogo}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Jogos;
