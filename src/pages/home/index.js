import { useState, useEffect } from "react";
import { db } from "../../firebaseConection";
import { doc, setDoc, collection, addDoc, getDoc, onSnapshot, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import userEvent from "@testing-library/user-event";
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
  class Progress {
    constructor(param = {}) {
      this.timestamp        = null;
      this.duration         = param.duration || Progress.CONST.DURATION;
      this.progress         = 0;
      this.delta            = 0;
      this.isLoop           = !!param.isLoop;
  
      this.reset();
    }
  
    static get CONST() {
      return {
        DURATION : 1000
      };
    }
  
    reset() {
      this.timestamp = null;
    }
  
    start(now) {
      this.timestamp = now;
    }
  
    tick(now) {
      if (this.timestamp) {
        this.delta    = now - this.timestamp;
        this.progress = Math.min(this.delta / this.duration, 1);
  
        if (this.progress >= 1 && this.isLoop) {
          this.start(now);
        }
  
        return this.progress;
      } else {
        return 0;
      }
    }
  }
  
  class Confetti {
    constructor(param) {
      this.parent         = param.elm || document.body;
      this.canvas         = document.createElement("canvas");
      this.ctx            = this.canvas.getContext("2d");
      this.width          = param.width  || this.parent.offsetWidth;
      this.height         = param.height || this.parent.offsetHeight;
      this.length         = param.length || Confetti.CONST.PAPER_LENGTH;
      this.yRange         = param.yRange || this.height * 2;
      this.progress       = new Progress({
        duration : param.duration,
        isLoop   : true
      });
      this.rotationRange  = typeof param.rotationRange === "number" ? param.rotationRange
                                                                     : 10;
      this.speedRange     = typeof param.speedRange     === "number" ? param.speedRange
                                                                     : 10;
      this.sprites        = [];
  
      this.canvas.style.cssText = [
        "display: block",
        "position: absolute",
        "top: 0",
        "left: 0",
        "pointer-events: none"
      ].join(";");
  
      this.render = this.render.bind(this);
  
      this.build();
  
      this.parent.appendChild(this.canvas);
      this.progress.start(performance.now());
  
      requestAnimationFrame(this.render);
    }
  
    static get CONST() {
      return {
          SPRITE_WIDTH  : 9,
          SPRITE_HEIGHT : 16,
          PAPER_LENGTH  : 100,
          DURATION      : 8000,
          ROTATION_RATE : 50,
          COLORS        : [
            "#EF5350",
            "#EC407A",
            "#AB47BC",
            "#7E57C2",
            "#5C6BC0",
            "#42A5F5",
            "#29B6F6",
            "#26C6DA",
            "#26A69A",
            "#66BB6A",
            "#9CCC65",
            "#D4E157",
            "#FFEE58",
            "#FFCA28",
            "#FFA726",
            "#FF7043",
            "#8D6E63",
            "#BDBDBD",
            "#78909C"
          ]
      };
    }
  
    build() {
      for (let i = 0; i < this.length; ++i) {
        let canvas = document.createElement("canvas"),
            ctx    = canvas.getContext("2d");
  
        canvas.width  = Confetti.CONST.SPRITE_WIDTH;
        canvas.height = Confetti.CONST.SPRITE_HEIGHT;
  
        canvas.position = {
          initX : Math.random() * this.width,
          initY : -canvas.height - Math.random() * this.yRange
        };
  
        canvas.rotation = (this.rotationRange / 2) - Math.random() * this.rotationRange;
        canvas.speed    = (this.speedRange / 2) + Math.random() * (this.speedRange / 2);
  
        ctx.save();
          ctx.fillStyle = Confetti.CONST.COLORS[(Math.random() * Confetti.CONST.COLORS.length) | 0];
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
  
        this.sprites.push(canvas);
      }
    }
  
    render(now) {
      let progress = this.progress.tick(now);
  
      this.canvas.width  = this.width;
      this.canvas.height = this.height;
  
      for (let i = 0; i < this.length; ++i) {
        this.ctx.save();
          this.ctx.translate(
            this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress,
            this.sprites[i].position.initY + progress * (this.height + this.yRange)
          );
          this.ctx.rotate(this.sprites[i].rotation);
          this.ctx.drawImage(
            this.sprites[i],
            -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2,
            -Confetti.CONST.SPRITE_HEIGHT / 2,
            Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)),
            Confetti.CONST.SPRITE_HEIGHT
          );
        this.ctx.restore();
      }
  
      requestAnimationFrame(this.render);
    }
  }
  
  (() => {
    const DURATION = 8000,
          LENGTH   = 120;
  
    new Confetti({
      width    : window.innerWidth,
      height   : window.innerHeight,
      length   : LENGTH,
      duration : DURATION
    });
  
    setTimeout(() => {
      new Confetti({
        width    : window.innerWidth,
        height   : window.innerHeight,
        length   : LENGTH,
        duration : DURATION
      });
    }, DURATION / 2);
  })();
  

  return (
    
    <div className="App">
     
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
