import { useState, useEffect } from "react";
import { db } from "../../firebaseConection";
import { doc, setDoc, collection, addDoc, getDoc, onSnapshot, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import userEvent from "@testing-library/user-event";
import confetti from "https://cdn.skypack.dev/canvas-confetti";
import { useNavigate } from "react-router-dom";








function Home() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [botao, setBotao] = useState("Cadastrar");
  const [show, setShow] = useState(false);
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
  const handleShow = () => setShow(true);
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
  
const doItNow = (evt, hard) => {
	const direction = Math.sign(lastX - evt.clientX);
	lastX = evt.clientX;
	const particleCount = hard ? r(122, 245) : r(2, 15);
	confetti({
		particleCount,
		angle: r(90, 90 + direction * 30),
		spread: r(45, 80),
		origin: {
			x: evt.clientX / window.innerWidth,
			y: evt.clientY / window.innerHeight
		}
	});
};
const doIt = (evt) => {
	doItNow(evt, false);
};

const doItHard = (evt) => {
	doItNow(evt, true);
};

let lastX = 0;


function r(mi, ma) {
	return parseInt(Math.random() * (ma - mi) + mi);
}
  return (
    <div className="App" onClick={doItHard}>
     
      <div className="container">

        <br></br>
        <h2>Ranking <Button as="a" size="sm" variant="success" onClick={handleShow}>Novo Jogador</Button> <Button as="a" size="sm" variant="success" onClick={goJogos}>Jogos</Button></h2>
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
              <th>Nome</th>
              <th>Pontos</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post,index) => {
              return (
                <tr key={post.id}>
                  <td>{index + 1}º </td>
                  <td>{post.titulo} </td>
                  <td>{post.autor}</td>
                  <td>
                    {/*<Button as="a" variant="danger" onClick={() => excluirPost(post.id)}>Deletar</Button>*/}

                    <Button as="a" variant="primary" size="sm" onClick={() => editarPostAcao(post.id, post.autor, post.titulo)}>Editar</Button></td>
                </tr>

              )
            })}
          </tbody>
        </Table>
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
              <Form.Control type="text" placeholder="Pontos Totais" value={autor} onChange={(e) => setAutor(e.target.value)} />
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
    </div>
  );
}

export default Home;
