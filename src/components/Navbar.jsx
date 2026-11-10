import { NavLink } from 'react-router'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import '../styles/navbar.css'
import { useBiblioteca } from '../context/BibliotecaContext'
function Navbar(){
    const {
    setPessoas,
    setLivros,
    categorias,
    setCategorias
} = useBiblioteca()

    const [menuAberto, setMenuAberto] = useState(false)
    const [cadastroSelecionado, setCadastroSelecionado] = useState('')
    // Dados da pessoa
    const [nomePessoa, setNomePessoa] = useState('')
    const [tipoPessoa, setTipoPessoa] = useState('')
    const [generoPessoa, setGeneroPessoa] = useState('')
    const [generoOutro, setGeneroOutro] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [turmaPessoa, setTurmaPessoa] = useState('')
    const [matriculaPessoa, setMatriculaPessoa] = useState('')
    const [emailPessoa, setEmailPessoa] = useState('')
    const [telefonePessoa, setTelefonePessoa] = useState('')


    // Dados do livro
    const [tituloLivro, setTituloLivro] = useState('')
    const [autorLivro, setAutorLivro] = useState('')
    const [categoriaLivro, setCategoriaLivro] = useState('')
    const [isbnLivro, setIsbnLivro] = useState('')
    const [quantidadeLivro, setQuantidadeLivro] = useState(1)
    const [sinopseLivro, setSinopseLivro] = useState('')
    const [capaLivro, setCapaLivro] = useState('')

    function abrirCadastro(tipo){
        setCadastroSelecionado(tipo)
        setMenuAberto(false)
    }

    function fecharCadastro(){
        setCadastroSelecionado('')
    }
    function salvarPessoa(evento) {
    evento.preventDefault()

    if (!nomePessoa.trim()) {
        alert('Digite o nome da pessoa.')
        return
    }

    if (!tipoPessoa || !generoPessoa || !dataNascimento) {
        alert('Preencha os campos obrigatórios.')
        return
    }

    if (generoPessoa === 'Outro' && !generoOutro.trim()) {
        alert('Especifique o gênero.')
        return
    }

    if (tipoPessoa === 'Aluno' && !turmaPessoa) {
        alert('Selecione a turma do aluno.')
        return
    }

    const novaPessoa = {
        id: Date.now(),
        nome: nomePessoa.trim(),
        tipo: tipoPessoa,
        genero: generoPessoa,
        generoDescricao: generoPessoa === 'Outro' ? generoOutro.trim() : '',
        dataNascimento,
        turma: turmaPessoa,
        matricula: matriculaPessoa.trim(),
        email: emailPessoa.trim(),
        telefone: telefonePessoa.trim()
    }

    setPessoas(pessoasAtuais => [...pessoasAtuais, novaPessoa])

    setNomePessoa('')
    setTipoPessoa('')
    setGeneroPessoa('')
    setGeneroOutro('')
    setDataNascimento('')
    setTurmaPessoa('')
    setMatriculaPessoa('')
    setEmailPessoa('')
    setTelefonePessoa('')

    fecharCadastro()

    alert('Pessoa cadastrada com sucesso!')
}
function salvarLivro(evento) {
    evento.preventDefault()

    if (!tituloLivro.trim() || !autorLivro.trim() || !categoriaLivro.trim()) {
        alert('Preencha o título, o autor e a categoria.')
        return
    }

    const quantidade = Number(quantidadeLivro)

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        alert('A quantidade deve ser um número inteiro maior que zero.')
        return
    }

    const novaCategoria = categoriaLivro.trim()

    const novoLivro = {
        id: Date.now(),
        titulo: tituloLivro.trim(),
        autor: autorLivro.trim(),
        categoria: novaCategoria,
        categorias: [novaCategoria],
        isbn: isbnLivro.trim(),
        quantidade,
        sinopse: sinopseLivro.trim(),
        capa: capaLivro,
        disponibilidade: 'Disponível'
    }

    setLivros(livrosAtuais => [...livrosAtuais, novoLivro])

    // Adiciona a categoria à lista, caso ainda não exista.
    setCategorias(categoriasAtuais =>
        categoriasAtuais.some(
            categoria => categoria.toLowerCase() === novaCategoria.toLowerCase()
        )
            ? categoriasAtuais
            : [...categoriasAtuais, novaCategoria]
    )

    // Limpa os campos
    setTituloLivro('')
    setAutorLivro('')
    setCategoriaLivro('')
    setIsbnLivro('')
    setQuantidadeLivro(1)
    setSinopseLivro('')
    setCapaLivro('')

    fecharCadastro()

    alert('Livro cadastrado com sucesso!')
}  
function selecionarCapa(evento) {
    const arquivo = evento.target.files?.[0]

    if (!arquivo) {
        setCapaLivro('')
        return
    }

    if (!arquivo.type.startsWith('image/')) {
        alert('Selecione um arquivo de imagem.')
        evento.target.value = ''
        return
    }

    const leitor = new FileReader()

    leitor.onload = () => {
        setCapaLivro(leitor.result)
    }

    leitor.readAsDataURL(arquivo)
}

    return (
        <header className="navbar">
            <NavLink  to="/" className="navbar-logo">
                <img 
                    src="/assets/perastrolib-icon.png"
                    alt='Ícone PerastroLib'   
                />
                <span> PerastroLib</span>
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
                            <form onSubmit={salvarPessoa}>

                                {/* NOME */}
                                <label htmlFor="nomePessoa">Nome completo *</label>

                                <input
                                    id="nomePessoa"
                                    type="text"
                                    placeholder="Digite o nome completo"
                                    value={nomePessoa}
                                    onChange={(evento) => setNomePessoa(evento.target.value)}
                                    required
                                />

                                {/* TIPO */}
                                <label htmlFor="tipoPessoa">Tipo de pessoa *</label>

                                <select
                                    id="tipoPessoa"
                                    value={tipoPessoa}
                                    onChange={(evento) => setTipoPessoa(evento.target.value)}
                                    required
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="Aluno">Aluno</option>
                                    <option value="Professor">Professor</option>
                                    <option value="Outro">Outro</option>
                                </select>

                                {/* GENERO */}
                                <label htmlFor="generoPessoa">Gênero *</label>

                                <select
                                    id="generoPessoa"
                                    value={generoPessoa}
                                    onChange={(evento) => {
                                        setGeneroPessoa(evento.target.value)
                                        setGeneroOutro('')
                                    }}
                                    required
                                >
                                    <option value="">Selecione o gênero</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>

                                {generoPessoa === 'Outro' && (
                                    <>
                                        <label htmlFor="generoOutro">Especifique o gênero *</label>

                                        <input
                                            id="generoOutro"
                                            type="text"
                                            placeholder="Digite o gênero"
                                            value={generoOutro}
                                            onChange={(evento) => setGeneroOutro(evento.target.value)}
                                            required
                                        />
                                    </>
                                )}

                                {/* DATA DE NASCIMENTO */}
                                <label htmlFor="dataNascimento">Data de nascimento *</label>

                                <input
                                    id="dataNascimento"
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(evento) => setDataNascimento(evento.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />

                                {/* TURMA */}
                                <label htmlFor="turmaPessoa">Turma</label>

                                <select
                                    id="turmaPessoa"
                                    value={turmaPessoa}
                                    onChange={(evento) => setTurmaPessoa(evento.target.value)}
                                    required={tipoPessoa === 'Aluno'}
                                >
                                    <option value="">Selecione a turma</option>
                                    <option value="1A">1A</option>
                                    <option value="1B">1B</option>
                                    <option value="1C">1C</option>
                                    <option value="2A">2A</option>
                                    <option value="2B">2B</option>
                                    <option value="2C">2C</option>
                                    <option value="3A">3A</option>
                                    <option value="3B">3B</option>
                                    <option value="3C">3C</option>
                                </select>

                                {/* INFORMAÇÕES OPCIONAIS */}
                                <h3 className="cadastro-subtitulo">
                                    Informações adicionais
                                </h3>

                                <label htmlFor="matriculaPessoa">Matrícula (opcional)</label>

                                <input
                                    id="matriculaPessoa"
                                    type="text"
                                    placeholder="Digite a matrícula"
                                    value={matriculaPessoa}
                                    onChange={(evento) => setMatriculaPessoa(evento.target.value)}
                                />

                                <label htmlFor="emailPessoa">E-mail (opcional)</label>

                                <input
                                    id="emailPessoa"
                                    type="email"
                                    placeholder="Digite o e-mail"
                                    value={emailPessoa}
                                    onChange={(evento) => setEmailPessoa(evento.target.value)}
                                />

                                <label htmlFor="telefonePessoa">Telefone (opcional)</label>

                                <input
                                    id="telefonePessoa"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={telefonePessoa}
                                    onChange={(evento) => setTelefonePessoa(evento.target.value)}
                                />

                                <button type="submit" className="modal-salvar">
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
    <form onSubmit={salvarLivro}>

        <label htmlFor="tituloLivro">Título do livro *</label>
        <input
            id="tituloLivro"
            type="text"
            placeholder="Digite o título"
            value={tituloLivro}
            onChange={evento => setTituloLivro(evento.target.value)}
            required
        />

        <label htmlFor="autorLivro">Autor *</label>
        <input
            id="autorLivro"
            type="text"
            placeholder="Digite o autor"
            value={autorLivro}
            onChange={evento => setAutorLivro(evento.target.value)}
            required
        />

        <label htmlFor="categoriaLivro">Categoria *</label>
        <input
            id="categoriaLivro"
            type="text"
            placeholder="Ex.: Fantasia"
            value={categoriaLivro}
            onChange={evento => setCategoriaLivro(evento.target.value)}
            list="lista-categorias-livro"
            required
        />

        <datalist id="lista-categorias-livro">
            {categorias.map(categoria => (
                <option key={categoria} value={categoria} />
            ))}
        </datalist>

        <label htmlFor="isbnLivro">ISBN</label>
        <input
            id="isbnLivro"
            type="text"
            placeholder="Digite o ISBN"
            value={isbnLivro}
            onChange={evento => setIsbnLivro(evento.target.value)}
        />

        <label htmlFor="quantidadeLivro">Quantidade *</label>
        <input
            id="quantidadeLivro"
            type="number"
            min="1"
            step="1"
            placeholder="Ex.: 5"
            value={quantidadeLivro}
            onChange={evento => setQuantidadeLivro(evento.target.value)}
            required
        />

        <label htmlFor="sinopseLivro">Sinopse do livro</label>
        <textarea
            id="sinopseLivro"
            className="campo-sinopse-livro"
            placeholder="Escreva aqui um resumo sobre a história do livro..."
            value={sinopseLivro}
            onChange={evento => setSinopseLivro(evento.target.value)}
            rows="5"
        />

        <label htmlFor="capaLivro">Capa do livro</label>
        <input
            id="capaLivro"
            type="file"
            accept="image/*"
            onChange={selecionarCapa}
        />

        <button type="submit" className="modal-salvar">
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