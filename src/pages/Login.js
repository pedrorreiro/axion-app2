import '../App.css';
import * as React from 'react';
import bg from '../img/bg.jpg';
import logo from '../img/logo.png';
import mail from '../img/mail.png';
import lock from '../img/lock.png';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  const logar = () => {

    setLoading(true);

    if(email === '' || password === '') {
      setErro({msg: 'Preencha todos os campos!', tipo: "warning"});
      return false;
    }

    axios.post('http://localhost:1337/auth/local', {
      identifier: email,
      password: password
    })
      .then(function (response) {
        //console.log(response);
        if (response.data.jwt) {

          console.log(response.data.user);
          sessionStorage.setItem("auth", response.data.jwt);
          setLoading(false);
          navigate("/");
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
          if(error.response.status === 400) {
            setErro({msg: "E-mail ou senha incorretos", tipo: "error"});
          }

          else if(error.response.status === 0) {
            setErro({msg: "Houve um erro com a conexão", tipo: "warning"});
          }
      });
  }

  return (
    <div className="App">
      <div id='loginBox'>
        <img src={logo} alt="logo"></img>

        <p>Email</p>
        <div className='input'>
          <input type='text' placeholder='seunome@email.com' onChange={handleEmail}></input>
          <img className="iconInput" src={mail} alt="icone"></img>
        </div>

        <p>Password</p>
        <div className='input'>
          <input type={mostrarSenha ? 'text' : 'password'} placeholder='Password' onChange={handlePassword}></input>
          <img className="iconInput" src={lock} alt="iconez"></img>
        </div>

        <div id='check'>
          <input type='checkbox' onChange={() => setMostrarSenha(!mostrarSenha)}></input>
          <label>Mostrar a senha</label>
        </div>

        <p id='problemas'>Problemas para acessar sua conta?</p>

        <div style={{textAlign: "center"}}>
          {loading ? <CircularProgress className='loading'/> :  <div id='button' onClick={logar}>Entrar</div>}
        </div>
        {erro !== null &&
          <div id='erro'>
            <Alert variant="filled" severity={erro.tipo}>{erro.msg}</Alert>
          </div>
        }

        <div id='or'>
          <div className="linha"></div>
          ou
          <div className="linha"></div>
        </div>

        <div id='cadastrar'>Cadastrar</div>

        <p>Termos de uso · Política de privacidade</p>

      </div>
      
      <img src={bg} id="fundo" alt='background'></img>

    </div>
  );
}

export default Login;
