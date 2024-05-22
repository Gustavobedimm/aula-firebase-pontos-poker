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
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { render } from "@testing-library/react";
import { Chart } from "react-google-charts";
import img1 from "../../assets/medalha-de-ouro.png";
import img2 from "../../assets/medalha-de-prata.png";
import img3 from "../../assets/medalha-de-bronze.png";
import Card from "react-bootstrap/Card";

//const data = [["Year", nome],
//              ["asd1",10],
//             ["asd21",10],
//            ];

export const options = {
  title: "Performace do Jogador",
  //curveType: "function",
  legend: { position: "bottom" },
  pointSize: 5,
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState([]);
  const [jogosJogador, setJogosJogador] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [perfilNome, setPerfilNome] = useState("");
  const [perfilPosicaoAtual, setPerfilPosicaoAtual] = useState("");
  const [perfilPontos, setPerfilPontos] = useState("");
  const [perfilTitulos, setPerfilTitulos] = useState("");
  const [mediaRebuy, setMediaRebuy] = useState("");
  const [mediaAddOn, setMediaAddOn] = useState("");
  const [winrate, setWinrate] = useState("");
  const [mediaGasta, setMediaGasta] = useState("");

  const [botao, setBotao] = useState("Cadastrar");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const navigate = useNavigate();
  const goJogos = () => {
    navigate("/jogos");
  };
  const handleClose = () => {
    setShow(false);
    setIdPost("");
    setAutor("");
    setTitulo("");
  };
  const handleClose2 = () => {
    setShow2(false);
  };
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);
  const [senha, setSenha] = useState("");

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot2) => {
        let lista2 = [];
        snapshot2.forEach((doc) => {
          lista2.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
            titulos: doc.data().titulos,
          });
        });
        lista2.sort(function (a, b) {
          return b.autor - a.autor;
        });
        setPosts(lista2);
      });
    }
    loadPosts();
  }, []);

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        console.log("post excluido com sucesso");
      })
      .catch(() => {});
  }
  //async function editarPost(){
  //  const docRef = doc(db, "posts" , idPost);
  //  await updateDoc(docRef, {
  //    titulo : titulo,
  //    autor: autor,
  //  }).then(() => {
  //    console.log("psot atualizxado")
  //    setAutor("");
  //    setTitulo("");
  //    setIdPost("");
  //  }).catch((error) => {
  //    console.log("erro ao atualizar post")
  //  })
  // }
  async function abrePerfil(id, nome, pontos, posicaoAtual, titulos) {
    setShow2(true);
    setPerfilNome(nome);
    setPerfilPontos(pontos);
    setPerfilPosicaoAtual(posicaoAtual);
    setPerfilTitulos(titulos);
    //pega todos os jogos
    const unsub = onSnapshot(collection(db, "Jogos_Jogadores"), (snapshot2) => {
      let lista = [];
      //percorre todos os jogos
      snapshot2.forEach((doc) => {
        //separa os jogos do jogador escolhido em uma lista
        if (id === doc.data().id_post && doc.data().buyin > 0) {
          lista.push({
            id: doc.id,
            nome: doc.data().nome,
            buyin: doc.data().buyin,
            rebuy: doc.data().rebuy,
            addon: doc.data().addon,
            pontos: doc.data().pontos,
            posicao: doc.data().posicao,
            idJogo: doc.data().idJogo,
          });
        }
      });
      //ordena a lista em ordem de idJogo
      lista.sort(function (a, b) {
        return a.idJogo - b.idJogo;
      });
      //seta em uma listaGlobal para acessar diretamente pelo componente
      setJogosJogador(lista);
      if (lista.length > 0) {
        //alimentando a lista com as informações dos jogos para montar o grafico
        const temp = [["Year", "Pontos", "Buyin+Rebuy+Addon"]];
        lista.map((jogadoresJogoTemp) => {
          temp.push([
            "Jogo " + jogadoresJogoTemp.idJogo,
            jogadoresJogoTemp.pontos,
            jogadoresJogoTemp.rebuy +
              jogadoresJogoTemp.addon +
              jogadoresJogoTemp.buyin,
          ]);
        });
        setData(temp);
      } else {
        //caso o jogador nao tenha nenhum jogo ele manda esses dados
        const temp = [
          ["Year", "Pontos", "Buyin+Rebuy+Addon"],
          ["Nenhum", 0, 0],
        ];
        //seta em uma lista global para poder ser usado pelo componente
        setData(temp);
      }
      montaMedia(lista);
    });
  }
  async function editarPostAcao(id, autor, titulo) {
    setShow(true);
    setIdPost(id);
    setAutor(autor);
    setTitulo(titulo);
    setBotao("Editar");
  }
  async function buscarPost() {
    //consulta post pelo ID especifico
    //const postRef = doc(db,"posts", "12345");
    //await getDoc(postRef)
    //.then((snapshot) => {
    //  setAutor(snapshot.data().autor)
    //  setTitulo(snapshot.data().titulo)
    //})
    //.catch((error) => {
    //  console.log("Erro ao buscar post" + error)
    //})
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
        setPosts(lista);
      })
      .catch((error) => {
        console.log("deu algum erro ao buscar" + error);
      });
  }
  function montaMedia(jogos) {
    let tempmediaRebuy = 0;
    let tempmediaAddOn = 0;
    let tempbuyin = 0;
    let tempwinrate = 0;
    let tamanho = jogos.length;
    for (const item of jogos) {
      tempmediaRebuy = tempmediaRebuy + item.rebuy;
      tempmediaAddOn = tempmediaAddOn + item.addon;
      tempbuyin = tempbuyin + item.buyin;
      if (item.posicao < 2) {
        tempwinrate = tempwinrate + 1;
      }
    }
    let tempMediaGasta =
      ((tempmediaRebuy + tempmediaAddOn + tempbuyin) * 10) / tamanho;
    setMediaGasta(tempMediaGasta.toFixed(2));
    let temp1 = tempmediaRebuy / tamanho;
    let temp2 = tempmediaAddOn / tamanho;
    let temp3 = 0;
    setMediaRebuy(temp1.toFixed(2));
    setMediaAddOn(temp2.toFixed(2));
    if (tempwinrate > 0) {
      temp3 = (tempwinrate * 100) / tamanho;
      setWinrate(temp3.toFixed(2));
    } else {
      setWinrate(0);
    }
  }
  function TestaPosicao(posicao) {
    if (posicao === 1) {
      return <img src={img1} className="img" />;
    }
    if (posicao === 2) {
      return <img src={img2} className="img" />;
    }
    if (posicao === 3) {
      return <img src={img3} className="img" />;
    }
    return posicao;
  }
  async function handleAdd() {
    if (senha === "199605") {
      if (idPost.length === 0) {
        //CADASTRAR NOVO
        await addDoc(collection(db, "posts"), {
          titulo: titulo,
          autor: autor,
        })
          .then(() => {
            console.log("Cadastro realizado com sucesso");
            setIdPost("");
            setAutor("");
            setTitulo("");
          })
          .catch((error) => {
            console.log("Erro ao Cadastrar post" + error);
          });
      } else {
        //EDITAR PELO ID
        const docRef = doc(db, "posts", idPost);
        await updateDoc(docRef, {
          titulo: titulo,
          autor: autor,
        })
          .then(() => {
            console.log("psot atualizxado");
            setShow(false);
            setAutor("");
            setTitulo("");
            setIdPost("");
          })
          .catch((error) => {
            console.log("erro ao atualizar post");
          });
        setBotao("Cadastrar");
      }
    } else {
      alert("Senha incorreta");
      setShow(false);
      setIdPost("");
      setAutor("");
      setTitulo("");
    }
  }

  return (
    <div className="App">
      <div className="container">
        <Row>
          <Col>
            <Card style={{ width: "100%" }}>
              <Card.Header>Melhores Médias</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Melhor WinRate :  <Badge bg="primary"> Bedim</Badge> - <Badge bg="success">Venceu {winrate}% das vezes</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Melhor Méd. Rebuy : <Badge bg="primary"> Bedim</Badge> - <Badge bg="success">1.47 por jogo</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Melhor Méd. AddOn : <Badge bg="primary"> Bedim</Badge> - <Badge bg="success">1.47 por jogo</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Melhor Méd. Gasta : <Badge bg="primary"> Bedim</Badge> - <Badge bg="success">R$ 35,47 por jogo</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <br></br>
        <h2 style={{ color: "white" }}>Ranking 🏆 </h2>
        {/*
      <Button as="a" variant="success" onClick={editarPost}>Editar</Button>
      <hr></hr>
      <Button as="a" variant="primary" onClick={buscarPost}>Atualizar Lista</Button>
      <hr></hr>
      */}
        <Table bordered>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Pontos</th>
              <th>Nome</th>

              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => {
              return (
                <tr key={post.id}>
                  {index > 2 ? (
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1 ">
                      {index + 1}º{" "}
                    </td>
                  ) : (
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1 ">
                      {TestaPosicao(index + 1)}
                    </td>
                  )}

                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                    {post.autor}
                  </td>
                  <td>{post.titulo} </td>

                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                    {/*<Button as="a" variant="danger" onClick={() => excluirPost(post.id)}>Deletar</Button>*/}

                    <Button
                      as="a"
                      variant="primary"
                      size="sm"
                      className="w-100"
                      onClick={() =>
                        editarPostAcao(post.id, post.autor, post.titulo)
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      as="a"
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() =>
                        abrePerfil(
                          post.id,
                          post.titulo,
                          post.autor,
                          index + 1,
                          post.titulos
                        )
                      }
                    >
                      Perfil
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button as="a" variant="success" onClick={handleShow}>
          {" "}
          👨‍🚀 Novo Jogador
        </Button>{" "}
        <Button as="a" variant="success" onClick={goJogos}>
          {" "}
          🎲 Jogos
        </Button>
      </div>

      {/*<Container>
      <h2>Cadastro de pontos</h2>
      <Form>
      <Form.Group className="mb-3">
        <Form.Label>ID Jogador</Form.Label>
        <Form.Control disabled="true" type="text" placeholder="ID do Jogador" value={idPost} onChange={ (e) => setIdPost(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Nome</Form.Label>
        <Form.Control type="text" placeholder="Nome" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Pontos</Form.Label>
        <Form.Control type="text" placeholder="Pontos Totais" value={autor} onChange={(e) => setAutor(e.target.value)} />
      </Form.Group>
    </Form>
    <Button as="a" variant="success" onClick={handleAdd}>{botao}</Button>
    </Container>*/}

      <br></br>

      <Modal show={show} onHide={handleClose}>
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
                value={idPost}
                onChange={(e) => setIdPost(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Pontos</Form.Label>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Pontos Totais"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            {botao}
          </Button>
        </Modal.Footer>
      </Modal>
      {/*MODAL PERFIL DE USUARIO*/}
      <Modal show={show2} onHide={handleClose2} size="lg" fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title> Perfil </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="containerCards">
            <Card className="cards" style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>{perfilNome}</Card.Title>
                <Card.Text>
                  <span>
                    Posição Ranking : {TestaPosicao(perfilPosicaoAtual)}
                  </span>
                  <br></br>
                  <span>Pontos Ranking : {perfilPontos}</span>
                  <br></br>
                  <span>Titulos : {perfilTitulos}</span>
                  <hr></hr>
                  <Card.Title>Médias</Card.Title>
                  <Card.Text>
                    <Badge bg="success">Win Rate : {winrate}% </Badge>
                    <br></br>
                    <Badge bg="primary">
                      Média Rebuy por Jogo : {mediaRebuy}
                    </Badge>
                    <br></br>
                    <Badge bg="primary">
                      Média AddOn por Jogo : {mediaAddOn}
                    </Badge>
                    <br></br>
                    <Badge bg="secondary">
                      Média Gasta por Jogo : R${mediaGasta}
                    </Badge>
                  </Card.Text>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <hr></hr>
          <h5>Historico dos ultimos jogos</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Jogo</th>
                <th>Posição</th>
                <th>Pontos</th>
                <th>BI</th>
                <th>RB</th>
                <th>AD</th>
              </tr>
            </thead>
            <tbody>
              {jogosJogador.map((jogo, index) => {
                if (jogo.buyin > 0) {
                  if (jogo.posicao === 1 || jogo.posicao === 2) {
                    return (
                      <tr key={jogo.idJogo}>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          #{jogo.idJogo}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {" "}
                          <Badge bg="success">{jogo.posicao} ° </Badge>
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          +{jogo.pontos} Pts
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {jogo.buyin}{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {jogo.rebuy}{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {jogo.addon}{" "}
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={jogo.idJogo}>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          #{jogo.idJogo}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          <b>{jogo.posicao} °</b>
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          +{jogo.pontos} Pts{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {jogo.buyin}{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {jogo.rebuy}{" "}
                        </td>
                        <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                          {jogo.addon}{" "}
                        </td>
                      </tr>
                    );
                  }
                }
              })}
            </tbody>
          </Table>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
