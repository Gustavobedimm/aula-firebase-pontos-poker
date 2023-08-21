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
import { ToastContainer, toast } from 'react-toastify';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "react-toastify/dist/ReactToastify.css";

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
  
  
  const [idJogadorJogo, setIdJogadorJogo] = useState("");
  const [buyin, setBuyin] = useState("");
  const [rebuy, setRebuy] = useState("");
  const [addon, setAddon] = useState("");
  const [nome, setNome] = useState("");
  const [dataAtual, setDataAtual] = useState("");





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
  

  const handleShow = () => {
    montadata();
    setShow(true)
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
        
        lista2.sort(function (a, b) { return b.sequencia - a.sequencia });
        const jogo = lista2[0];
        buscarJogadores();
        
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
  function montadata(){
    const date = new Date();
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();
        const h =date.getHours();
        const m =date.getMinutes();
        const s =date.getSeconds();
        setDataAtual(dia+"/"+mes+"/"+ano+" "+h+":"+m+":"+s);
  }
  async function jogoAdd() {
    if (senha === "199605") {
      //CADASTRAR NOVO
      await addDoc(collection(db, "jogos"), {
        id: sequencia,
        sequencia: sequencia,
        inicio: dataAtual,
        fim: 0,
      })
        .then(() => {
          setShow(false);
          toast.success('Novo Jogo Iniciado, Bom jogo!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
          
          setIdJogo("");
          setSequencia("");
          setInicio("");
          setFim("");
          
        })
        .catch((error) => {
          console.log("Erro ao Cadastrar post" + error);
        });
        jogadoresAddJogo(sequencia);
        
        


      setBotao("Cadastrar");
    } else {
      setShow(false);
      
      toast.error('Senha incorreta', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      
      setIdJogo("");
      setSequencia("");
      setInicio("");
      setFim("");
    }
  }
  async function alteraJogadorJogo() {
    if (senha === '199605') {
       
        //EDITAR PELO ID
        const docRef = doc(db, "Jogos_Jogadores", idJogadorJogo);
        await updateDoc(docRef, {
          buyin: buyin,
          rebuy: rebuy,
          addon: addon,
        }).then(() => {
          setShow2(false);
          setIdJogadorJogo("");
          setBuyin("");
          setRebuy("");
          setAddon("");
        }).catch((error) => {
          alert(error);
        })
      
    }else{
      
      setShow2(false);
      toast.error('Senha incorreta', {
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

  async function finalizaJogo() {
    montadata();
    if (senha === '199605') {
      
        //EDITAR PELO ID
        
        const docRef = doc(db, "jogos", jogoAtual);
        console.log('data atuala'+dataAtual);
        await updateDoc(docRef, {
          fim: dataAtual,
        }).then(() => {
          toast.success('Jogo finalizado com sucesso!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
        
        }).catch((error) => {
          alert(error);
        })

        setJogoAtual("");
        setJogoAtualInicio("");
        setJogoAtualFim("");
        setJogoAtualSequencia("");
        setJogadoresJogo([]);
      
    }else{
      
      
      toast.error('Senha incorreta', {
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
              addon: doc.data().addon,
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
  async function editarJogadorJogo(id, buyin, rebuy,addon, nome) {
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
        <br></br>
        <Card>
          <Card.Header><Badge bg="success">Jogo em Andamento - {jogoAtualSequencia}</Badge>  {" "}<Badge bg="primary">Inicio - {jogoAtualInicio}</Badge>
          </Card.Header>
          <Card.Body>
            <Card.Title>Jogadores </Card.Title>
            <Table striped bordered hover>
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
                {jogadoresJogo.map((jogadoresJogo) => {
                  return (
                    <tr key={jogadoresJogo.id}>
                      <td >{jogadoresJogo.nome}  </td>
                      <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1"><Badge bg="success" className="w-100">{jogadoresJogo.buyin}</Badge>   </td>
                      <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1"><Badge bg="warning" className="w-100">{jogadoresJogo.rebuy} </Badge> </td>
                      <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1"><Badge bg="danger" className="w-100">{jogadoresJogo.addon} </Badge>  </td>
                      <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                        <Button as="a" variant="primary" size="sm" className="w-100" onClick={() => editarJogadorJogo(jogadoresJogo.id, jogadoresJogo.buyin, jogadoresJogo.rebuy,jogadoresJogo.addon,jogadoresJogo.nome)}>
                          Editar
                        </Button>
                         
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Button as="a" size="sm" variant="primary" onClick={finalizaJogo}>Finalizar Jogo</Button>

          </Card.Body>
        </Card>

        <br></br>


        <br></br>


        <Card>
          <Card.Header><Badge bg="primary">Finalizados</Badge>
          
          </Card.Header>
          <Card.Body>
            <Card.Title>Jogos Finalizados </Card.Title>
          
        
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

                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogos.sequencia} </td>
                  <td>{jogos.inicio} </td>
                  <td>{jogos.fim} </td>

                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                    <Button as="a" variant="primary" size="sm" className="w-100">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button as="a" size="sm" variant="success" onClick={handleShow}>
            Novo Jogo
          </Button>
        </Card.Body>
        </Card>

      </Container>
      <br></br>

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
          <Modal.Title>{nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Jogador</Form.Label>
              <Form.Control
                disabled="true"
                type="text"
                placeholder="ID do Jogador"
                value={idJogadorJogo}
                onChange={(e) => setIdJogadorJogo(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Buy In</Form.Label>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Buy In"
                value={buyin}
                onChange={(e) => setBuyin(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Rebuy</Form.Label>
              <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Rebuy"
                value={rebuy}
                onChange={(e) => setRebuy(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Add On</Form.Label>
              
              
    <Form.Control
                type="text"
                pattern="\d*"
                placeholder="Add On"
                value={addon}
                onChange={(e) => setAddon(e.target.value)}
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
          <Button variant="primary" onClick={alteraJogadorJogo}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>

      






    </div>
  );
}

export default Jogos;
