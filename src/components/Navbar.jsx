import { NavLink } from 'react-router'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import '../styles/navbar.css'
function Navbar(){

    const [menuAberto, setMenuAberto] = useState(false)
    const [cadastroSelecionado, setCadastroSelecionado] = useState('')

    function abrirCadastro(tipo){
        setCadastroSelecionado(tipo)
        setMenuAberto(false)
    }

    function fecharCadastro(){
        setCadastroSelecionado('')
    }

    return (
        <header className="navbar">
            <NavLink  to="/" className="navbar-logo">
                <img 
                    src="/assets/perastrolib-icon.png"
                    alt='Ícone PerastroLib'   
                />
                <span>PerastroLib</span>
            </NavLink>
            
            <nav className="navbar-links">

                <nav className="navbar-links">
                    <NavLink to="/" end>
                        Início
                    </NavLink>

                    <NavLink to="/livros">
                        Livros
                    </NavLink>

                    <NavLink to="/pessoas">
                        Pessoas
                    </NavLink>

                    <NavLink to="/registros">
                        Registros
                    </NavLink>
                </nav>

            </nav>

            <div className="cadastro-container">
                <button className="navbar-button"
                onClick={() => setMenuAberto(!menuAberto)}>
                    + Novo Cadastro
                </button>

                {menuAberto && (
                    <div className='cadastro-menu'>

                        <button onClick={() => abrirCadastro('Pessoa')}>
                            Nova Pessoa
                        </button>

                        <button onClick={() => abrirCadastro('Categoria')}>
                            Nova Categoria
                        </button>

                        <button onClick={() => abrirCadastro('Livro')}>
                            Novo Livro
                        </button>

                    </div>
                )}
            </div>
            {cadastroSelecionado && createPortal (
                <div className='modal-fundo' onClick={fecharCadastro}>
                    <div className='modal-cadastro'
                    onClick={(evento)=> evento.stopPropagation()}>
                        <div className='modal-cabecalho'>
                            <h2>Novo Cadastro: {cadastroSelecionado}

                            </h2>

                            <button type='button' className='modal-fechar' onClick={fecharCadastro}>
                                ×
                            </button>

                        </div>
                        {cadastroSelecionado === 'Pessoa' && (
                            <form>
                                <label htmlFor='nomeCompleto'>Nome Completo</label>
                                <input id='nomeCompleto' type='text' placeholder='Digite o nome'/>

                                <label htmlFor="Matricula">Matrícula</label>
                                <input id='Matricula' type='text'placeholder='Digite a matrícula'/>

                                <label htmlFor="turma">Turma</label>
                                <input  type="text" id='turma' placeholder='Ex.: 2º ano A'/>

                                <label htmlFor='Contato' >Contato</label>
                                <input id='Contato' type='text' placeholder='Telefone ou e-mail'/>

                                <button type='button' className='modal-salvar'>
                                    Salvar Pessoa
                                </button>
                            </form>
                )}
                        {cadastroSelecionado === 'Categoria' && (
                            <form>
                                <label>Nome da categoria</label>
                                <input type="text" placeholder="Digite o nome" />

                                <button type="button" className="modal-salvar">
                                    Salvar Categoria
                                </button>
                            </form>
                        )}
                        {cadastroSelecionado === 'Livro' && (
                            <form>
                                <label>Título do livro</label>
                                <input type="text" placeholder="Digite o título" />

                                <label>Autor</label>
                                <input type="text" placeholder="Digite o autor" />

                                <label>Categoria</label>
                                <input type="text" placeholder="Digite a categoria" />

                                <label>ISBN</label>
                                <input type="text" placeholder="Digite o ISBN" />

                                <label>Quantidade</label>
                                <input type="number" min="1" placeholder="Ex.: 5" />

                                <label>Capa do livro</label>
                                <input type="file" accept="image/*" />

                                <button type="button" className="modal-salvar">
                                    Salvar Livro
                                </button>
                            </form>
                        )}
                </div>
        </div>,
    document.body
)}

        </header>
    )
}

export default Navbar