import '../App.css';
import logo from '../img/logo.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { motion, AnimatePresence } from "framer-motion";

function Main() {

    const navigate = useNavigate();
    const [itens, setItens] = useState([]);
    const [tipo, setTipo] = useState('comidas');
    const [busca, setBusca] = useState('');
    const [user, setUser] = useState();

    const carregaItem = async (tipo) => {

        const token = sessionStorage.getItem("auth");

        setTipo(tipo);

        const result = await axios.get(`http://localhost:1337/${tipo}`, { // buscando os itens do tipo {tipo}, ex: comida, lugares, etc.
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setItens(result.data);

        Array.from(document.getElementsByClassName("op")).forEach(element => { // tirando o efeito de página atual de todos os itens do menu
            element.classList.remove("paginaAtual");
        });

        if (document.getElementById(tipo)) { // adicionando o efeito de página atual ao item do menu clicado
            document.getElementById(tipo).classList.add("paginaAtual");
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem("auth");

        if (!token) { // se não existir nenhum token, redireciona para a página de login
            navigate("/login");
        }

        else {

            axios.get('http://localhost:1337/users/me', { // caso exista um token, busca o usuário logado
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(function (response) {
                if (response) {
                    setUser(response.data); // armazena o usuário logado
                    console.log(response.data);

                    if (response.data.blocked) { // se o usuário estiver bloqueado, ele é deslogado
                        navigate("/login");
                    }

                    else {

                        navigate("/"); // navega logado para a página inicial.
                        carregaItem("comidas") // carrega automaticamente o menu de comidas.
                    }
                }
            }).catch(function (error) {
                console.log(error);
                navigate("/login");
            });
        }
    }, [navigate]);

    return (
        <div className="App">
            <header>
                <img id="logo" src={logo} alt="logo"></img>

                <div id='options'>
                    <span id='comidas' className="op" onClick={() => carregaItem("comidas")}>COMIDAS</span>
                    <span id='pessoas' className="op" onClick={() => carregaItem("pessoas")}>PESSOAS</span>
                    <span id='locais' className="op" onClick={() => carregaItem("locais")}>LOCAIS</span>
                </div>

                <div id='user'>
                    
                    {user !== undefined ? 
                    <div id='boasVindas'> <span>Olá, {user.username}!</span><Avatar id="avatar">{user.username.substr(0, 1)}</Avatar></div>
                    : null}

                    <LogoutIcon id="logout" sx={{ fontSize: 30, color: "#4a4a4a" }} onClick={() => {
                        sessionStorage.removeItem("auth")
                        navigate("/login")
                    }} />
                </div>

            </header>

            <div id="conteudo">
                <div id='titulo'>
                    <p>LISTA DE {tipo.toUpperCase()}</p>
                    <div id="faixa"></div>
                </div>

                <div id="busca">
                    <input type="text" placeholder='Faça sua busca aqui...' onChange={(e) => setBusca(e.target.value)}></input>
                    <SearchIcon sx={{ fontSize: 30, color: "#4a4a4a" }} />
                </div>

                <motion.div id="lista"
                    layout
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <AnimatePresence>
                        {itens.map(item => {

                            let url = `http://localhost:1337${item.link[0].url}`;

                            if (busca.length > 0) {
                                if (item.name.toLowerCase().startsWith(busca.toLowerCase())) {
                                    return (
                                        <motion.div layout className='itemLista' key={item.name}>

                                            <img src={url} alt="foto"></img>
                                            <span>{item.name}</span>

                                        </motion.div>
                                    )
                                }
                            }

                            else {
                                return (
                                    <motion.div layout className='itemLista' key={item.name}>

                                        <img src={url} alt="foto"></img>
                                        <span>{item.name}</span>
                                    </motion.div>

                                )
                            }

                        })}
                    </AnimatePresence>
                </motion.div>

            </div>

        </div >
    );
}

export default Main;
