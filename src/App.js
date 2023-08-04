import { useState,useEffect } from "react";
import { db } from "./firebaseConection";
import {doc, setDoc, collection, addDoc, getDoc, onSnapshot, getDocs, updateDoc, deleteDoc} from "firebase/firestore";
import "./app.css";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import userEvent from "@testing-library/user-event";

function App() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [botao, setBotao] = useState("Cadastrar");

  useEffect(()=>{
    async function loadPosts(){
      const unsub = onSnapshot(collection(db,"posts"), (snapshot2) => {
        let lista2 = [];
        snapshot2.forEach((doc) => {
          lista2.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(lista2);
      })
    }
    loadPosts();
  },[])
  
  async function excluirPost(id){
    const docRef = doc(db,"posts",id)
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
  async function editarPostAcao(id,autor,titulo){
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
  if(idPost.length === 0){
    //CADASTRAR NOVO
    await addDoc(collection(db,"posts"),{
      titulo : titulo,
      autor : autor,
    
    }).then(() => {
      console.log("Cadastro realizado com sucesso")
      setIdPost('');
      setAutor('');
      setTitulo('');
    })
    .catch((error) => {
      console.log("Erro ao Cadastrar post" + error)
    })
  }else{
    //EDITAR PELO ID
    const docRef = doc(db, "posts" , idPost);
    await updateDoc(docRef, {
      titulo : titulo,
      autor: autor,
    }).then(() => {
      console.log("psot atualizxado")
      setAutor("");
      setTitulo("");
      setIdPost("");
    }).catch((error) => {
      console.log("erro ao atualizar post")
    })
    setBotao("Cadastrar")
  }
  
  
}
  return (
    <div className="App">
      <Container>
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
    </Container>


      
      
      
      <div className="container">
      <Button as="a" variant="success" onClick={handleAdd}>{botao}</Button>
      <br></br>
      <h2>Jogadores Cadastrados</h2>
      {/*
      <Button as="a" variant="success" onClick={editarPost}>Editar</Button>
      <hr></hr>
      <Button as="a" variant="primary" onClick={buscarPost}>Atualizar Lista</Button>
      <hr></hr>
      */}
      
      <Table striped bordered hover>
      <thead>
        <tr>
          
          <th>Nome</th>
          <th>Pontos</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
      {posts.map( (post) => {
          return(
            <tr key={post.id}>
              
              <td>{post.titulo} </td>
              <td>{post.autor}</td>
              <td>
                {/*<Button as="a" variant="danger" onClick={() => excluirPost(post.id)}>Deletar</Button>*/}
              <Button as="a" variant="primary" onClick={() => editarPostAcao(post.id,post.autor,post.titulo)}>Editar</Button></td>
            </tr>
            
          )
        } )}
      </tbody>
    </Table>
    </div>
    </div>
  );
}

export default App;
