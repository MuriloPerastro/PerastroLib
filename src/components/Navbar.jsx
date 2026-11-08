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
            <a href="#inicio" className="navbar-logo">
                <img 
                    src="/assets/perastrolib-icon.png"
                    alt='Ícone PerastroLib'   
                />
                <span>PerastroLib</span>
            </a>
            <nav className="navbar-links">
                <a href="#inicio" className="active">Início</a>
                <a href="#Livros">Livros</a>
                <a href="#pessoas">Pessoas</a>
                <a href="#registros">Registros</a>
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

                        <button onClick={() => abrirCadastro('Pessoa')}>
                            Nova Categoria
                        </button>

                        <button onClick={() => abrirCadastro('Pessoa')}>
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
                            <button className='modal-fechar' onClick={fecharCadastro}>

                            </button>
                        </div>
                        {cadastroSelecionado === 'Pessoa' && (
                            <form>
                                <label>Nome Completo</label>
                                <input type='text' placeholder='Digite o nome'/>

                                <label>Matrícula</label>
                                <input type='text'placeholder='Digite a matrícula'/>

                                <label htmlFor="Turma"></label>
                                <input type="text" placeholder='Ex.: 2º ano A' />

                                <label >Contato</label>
                                <input type='text' placeholder='Telefone ou e-mail'/>

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