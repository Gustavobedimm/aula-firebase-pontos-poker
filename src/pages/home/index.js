import { useState, useEffect } from "react";
import { db } from "../../firebaseConection";
import { doc, setDoc, collection, addDoc, getDoc, onSnapshot, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [jogosJogador, setJogosJogador] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [perfilNome, setPerfilNome] = useState("");
  const [perfilPosicaoAtual, setPerfilPosicaoAtual] = useState("");
  const [perfilPontos, setPerfilPontos] = useState("");
  const [perfilTitulos, setPerfilTitulos] = useState("");

  const [botao, setBotao] = useState("Cadastrar");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const navigate = useNavigate();
  const goJogos = () => {
    navigate("/jogos")
  }
  const handleClose = () => {
    setShow(false)
    setIdPost("")
    setAutor("")
    setTitulo("")

  };
  const handleClose2 = () => {
    setShow2(false)
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
          })
        })
        lista2.sort(function (a, b) { return b.autor - a.autor });
        setPosts(lista2);
      })
    }
    loadPosts();

  }, [])

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
      .then(() => {
        console.log('post excluido com sucesso')
      })
      .catch(() => {

      })
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
  async function abrePerfil(id,nome,pontos,posicaoAtual,titulos){
    setShow2(true);
    setPerfilNome(nome);
    setPerfilPontos(pontos);
    setPerfilPosicaoAtual(posicaoAtual);
    setPerfilTitulos(titulos);
    const unsub = onSnapshot(collection(db, "Jogos_Jogadores"), (snapshot2) => {
      let lista = [];
      snapshot2.forEach((doc) => {
        if(id === doc.data().id_post){
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
    
      setJogosJogador(lista);
  })
  }
  async function editarPostAcao(id, autor, titulo) {
    setShow(true);
    setIdPost(id);
    setAutor(autor);
    setTitulo(titulo);
    setBotao("Editar")
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
        setPosts(lista);
      })
      .catch((error) => {
        console.log("deu algum erro ao buscar" + error)
      })
  }
  async function handleAdd() {
    if (senha === '199605') {
      if (idPost.length === 0) {
        //CADASTRAR NOVO
        await addDoc(collection(db, "posts"), {
          titulo: titulo,
          autor: autor,

        }).then(() => {
          console.log("Cadastro realizado com sucesso")
          setIdPost('');
          setAutor('');
          setTitulo('');
        })
          .catch((error) => {
            console.log("Erro ao Cadastrar post" + error)
          })
      } else {
        //EDITAR PELO ID
        const docRef = doc(db, "posts", idPost);
        await updateDoc(docRef, {
          titulo: titulo,
          autor: autor,
        }).then(() => {
          console.log("psot atualizxado")
          setShow(false);
          setAutor("");
          setTitulo("");
          setIdPost("");
        }).catch((error) => {
          console.log("erro ao atualizar post")
        })
        setBotao("Cadastrar")
      }
    }else{
      alert("Senha incorreta")
      setShow(false);
      setIdPost('');
      setAutor('');
      setTitulo('');
    }


  }
 



  
  return (
    
    <div className="App">
     
      <div className="container">

        <br></br>
        <h2 style={{color: "white"}}>Ranking 🏆 </h2>
        {/*
      <Button as="a" variant="success" onClick={editarPost}>Editar</Button>
      <hr></hr>
      <Button as="a" variant="primary" onClick={buscarPost}>Atualizar Lista</Button>
      <hr></hr>
      */}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Pontos</th>
              <th>Nome</th>
              
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post,index) => {
              return (
                <tr key={post.id}>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{index + 1}º </td>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{post.autor}</td>
                  <td>{post.titulo} </td>
                  
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                    {/*<Button as="a" variant="danger" onClick={() => excluirPost(post.id)}>Deletar</Button>*/}

                    {/*<Button as="a" variant="primary" size="sm" className="w-100" onClick={() => editarPostAcao(post.id, post.autor, post.titulo)}>Editar</Button></td>*/}
                    <Button as="a" variant="outline-primary" size="sm" className="w-100" onClick={() => abrePerfil(post.id,post.titulo,post.autor,index+1,post.titulos)}>Perfil</Button></td>
                </tr>

              )
            })}
          </tbody>
        </Table>
        <Button as="a"   variant="success" onClick={handleShow}> 👨‍🚀 Novo Jogador</Button> <Button as="a"  variant="success" onClick={goJogos}> 🎲 Jogos</Button>
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
              <Form.Control disabled="true" type="text" placeholder="ID do Jogador" value={idPost} onChange={(e) => setIdPost(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Nome" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Pontos</Form.Label>
              <Form.Control type="text" pattern="\d*" placeholder="Pontos Totais" value={autor} onChange={(e) => setAutor(e.target.value)} />
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
          <Button variant="primary"  onClick={handleAdd}>
            {botao}
          </Button>
        </Modal.Footer>
      </Modal>
      {/*MODAL PERFIL DE USUARIO*/}
      <Modal show={show2} onHide={handleClose2} size="lg" fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title> {perfilNome} </Modal.Title>
          
        </Modal.Header>
        <Modal.Body>
        
        <Badge bg="success">{perfilPosicaoAtual}° Lugar Ranking</Badge><Badge bg="primary">{perfilPontos} Pontos Totais </Badge>
        <hr></hr>
        <h5>Titulos : {perfilTitulos}</h5>
        <hr></hr>
        <h5>Historico dos ultimos jogos</h5>
        <Table striped bordered hover>
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
            {jogosJogador.map((jogo,index) => {
              if(jogo.posicao === 1 || jogo.posicao === 2){
                return (
                  <tr key={jogo.idJogo}>
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1" >{jogo.idJogo}</td>
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style={{color: "green"}}><b>{jogo.posicao} </b>💰</td>
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">+{jogo.pontos} </td>
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.buyin} </td>
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.rebuy} </td>
                    <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.addon} </td>
                  </tr>
                )
              }else{
              return (
                <tr key={jogo.idJogo}>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.idJogo}</td>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1"><b>{jogo.posicao}</b></td>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">+{jogo.pontos} </td>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.buyin} </td>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.rebuy} </td>
                  <td class="col-xs-1 col-sm-1 col-md-1 col-lg-1">{jogo.addon} </td>

                </tr>
              )
            }
            })}
          </tbody>
        </Table>
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
