import { useState } from 'react'
import '../styles/paginas.css'
import { useBiblioteca } from '../context/BibliotecaContext'

function Pessoas(){
    const { pessoas, setPessoas, registros } = useBiblioteca()
    const [pesquisa, setPesquisa] = useState('')
    const [tipoSelecionado, setTipoSelecionado] = useState('Todos')
    const [pessoaEditando, setPessoaEditando] = useState(null)
        
        function abrirEdicao(pessoa) {
        setPessoaEditando({ ...pessoa })
    }

    function atualizarCampo(campo, valor) {
        setPessoaEditando(pessoaAtual => ({
            ...pessoaAtual,
            [campo]: valor
        }))
    }

    function salvarEdicao(evento) {
        evento.preventDefault()

        if (!pessoaEditando.nome.trim()) {
            alert('O nome é obrigatório.')
            return
        }

        if (
            !pessoaEditando.tipo ||
            !pessoaEditando.genero ||
            !pessoaEditando.dataNascimento
        ) {
            alert('Preencha os campos obrigatórios.')
            return
        }

        if (
            pessoaEditando.genero === 'Outro' &&
            !pessoaEditando.generoDescricao?.trim()
        ) {
            alert('Especifique o gênero.')
            return
        }

        if (
            pessoaEditando.tipo === 'Aluno' &&
            !pessoaEditando.turma
        ) {
            alert('Selecione a turma do aluno.')
            return
        }

        setPessoas(pessoasAtuais =>
            pessoasAtuais.map(pessoa =>
                pessoa.id === pessoaEditando.id
                    ? { ...pessoaEditando }
                    : pessoa
            )
        )

        setPessoaEditando(null)

        alert('Pessoa atualizada com sucesso!')
    }

    function excluirPessoa(pessoa) {
    const possuiEmprestimoAtivo = registros.some(registro =>
        registro.pessoaId === pessoa.id &&
        (
            registro.status === 'Em andamento' ||
            registro.status === 'Atrasado'
        )
    )

    if (possuiEmprestimoAtivo) {
        alert(
            'Não é possível excluir esta pessoa, pois ela possui empréstimos que ainda não foram devolvidos.'
        )
        return
    }

    const confirmar = window.confirm(
        `Tem certeza que deseja excluir ${pessoa.nome}?`
    )

    if (!confirmar) return

    setPessoas(pessoasAtuais =>
        pessoasAtuais.filter(item => item.id !== pessoa.id)
    )
}


        
    const pessoasFiltradas = pessoas.filter((pessoa) => {
    const correspondePesquisa =
        pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (pessoa.matricula || '').toLowerCase().includes(pesquisa.toLowerCase())

    const correspondeTipo =
        tipoSelecionado === 'Todos' ||
        pessoa.tipo === tipoSelecionado

    return correspondePesquisa && correspondeTipo
})
    return(
        <main className="pagina-geral">
            <h1>Pessoas</h1>
            <p>Gerencie os alunos, professores e leitores da biblioteca.</p>
            
            <section className="pessoas-resumo">

                <div className="pessoa-resumo-card">
                    <span>Total de pessoas</span>
                    <strong>{pessoas.length}</strong>
                </div>

                <div className="pessoa-resumo-card">
                    <span>Alunos</span>
                    <strong>
                        {pessoas.filter(pessoa => pessoa.tipo === 'Aluno').length}
                    </strong>
                </div>

                <div className="pessoa-resumo-card">
                    <span>Professores</span>
                    <strong>
                        {pessoas.filter(pessoa => pessoa.tipo === 'Professor').length}
                    </strong>
                </div>

            </section>

            <section className='pessoas-filtros'>
                <input 
                type="text"
                placeholder='Pesquisar por nome ou matricula...'
                value={pesquisa}
                onChange={(evento)=> setPesquisa(evento.target.value)}
                />
                <div className='pessoas-tipos'>
                    <button className={tipoSelecionado=='Todos'?'active':''}onClick={()=> setTipoSelecionado('Todos')}>Todos</button>

                    <button
                        className={tipoSelecionado === 'Aluno' ? 'active' : ''}
                        onClick={() => setTipoSelecionado('Aluno')}>
                            Alunos
                    </button>

                    <button
                        className={tipoSelecionado === 'Outro' ? 'active' : ''}
                        onClick={() => setTipoSelecionado('Outro')}
                    >
                        Outros
                    </button>
                    
                    <button
                        className={tipoSelecionado === 'Professor' ? 'active' : ''}
                        onClick={() => setTipoSelecionado('Professor')}>
                            Professores
                    </button>
                </div>
            </section>

            <section className='pessoas-lista'>
                {pessoasFiltradas.length > 0 ? (
                    pessoasFiltradas.map((pessoa) => (
                    <article className='pessoa-card' key={pessoa.id}>
                    <div className='pessoa-avatar'>
                        {pessoa.nome.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className='pessoa-dados'>

                        <h3>{pessoa.nome}</h3>

                        <p>{pessoa.tipo}</p>

                        {pessoa.genero && (
                            <p>
                                Gênero: {pessoa.genero === 'Outro'
                                    ? pessoa.generoDescricao || 'Outro'
                                    : pessoa.genero}
                            </p>
                        )}

                        {pessoa.dataNascimento && (
                            <p>
                                Nascimento: {pessoa.dataNascimento.split('-').reverse().join('/')}
                            </p>
                        )}

                        {pessoa.matricula && (
                            <p>Matrícula: {pessoa.matricula}</p>
                        )}

                        {pessoa.turma && (
                            <p>Turma: {pessoa.turma}</p>
                        )}

                        {pessoa.email && (
                            <p>{pessoa.email}</p>
                        )}

                        {pessoa.telefone && (
                            <p>{pessoa.telefone}</p>
                        )}

                        {!pessoa.email && !pessoa.telefone && pessoa.contato && (
                            <p>{pessoa.contato}</p>
                        )}

                    </div>

                        <span className='Pessoa-tipo'>
                            {pessoa.tipo}
                        </span>
                        <div className="pessoa-acoes">

                        <button
                            type="button"
                            className="pessoa-editar"
                            title="Editar pessoa"
                            onClick={() => abrirEdicao(pessoa)}
                        >
                            ✎
                        </button>

                        <button
                            type="button"
                            className="pessoa-excluir"
                            title="Excluir pessoa"
                            onClick={() => excluirPessoa(pessoa)}
                        >
                            ×
                        </button>

                    </div>
                    </article>
                        
                ))

            )   : ( 
            <p className="pessoas-vazio">
                Nenhuma pessoa encontrada.
            </p>
            )}

            </section>
            {pessoaEditando && (
        <div
            className="modal-fundo"
            onClick={() => setPessoaEditando(null)}
        >
            <div
                className="modal-cadastro"
                onClick={(evento) => evento.stopPropagation()}
            >
                <div className="modal-cabecalho">
                    <h2>Editar Pessoa</h2>

                    <button
                        type="button"
                        className="modal-fechar"
                        onClick={() => setPessoaEditando(null)}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={salvarEdicao}>

                    <label htmlFor="editarNome">Nome completo *</label>
                    <input
                        id="editarNome"
                        type="text"
                        value={pessoaEditando.nome}
                        onChange={evento =>
                            atualizarCampo('nome', evento.target.value)
                        }
                        required
                    />

                    <label htmlFor="editarTipo">Tipo de pessoa *</label>
                    <select
                        id="editarTipo"
                        value={pessoaEditando.tipo}
                        onChange={evento =>
                            atualizarCampo('tipo', evento.target.value)
                        }
                        required
                    >
                        <option value="Aluno">Aluno</option>
                        <option value="Professor">Professor</option>
                        <option value="Outro">Outro</option>
                    </select>

                    <label htmlFor="editarGenero">Gênero *</label>
                    <select
                        id="editarGenero"
                        value={pessoaEditando.genero || ''}
                        onChange={evento => {
                            atualizarCampo('genero', evento.target.value)

                            if (evento.target.value !== 'Outro') {
                                atualizarCampo('generoDescricao', '')
                            }
                        }}
                        required
                    >
                        <option value="">Selecione o gênero</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>

                    {pessoaEditando.genero === 'Outro' && (
                        <>
                            <label htmlFor="editarGeneroOutro">
                                Especifique o gênero *
                            </label>

                            <input
                                id="editarGeneroOutro"
                                type="text"
                                value={pessoaEditando.generoDescricao || ''}
                                onChange={evento =>
                                    atualizarCampo('generoDescricao', evento.target.value)
                                }
                                required
                            />
                        </>
                    )}

                    <label htmlFor="editarNascimento">
                        Data de nascimento *
                    </label>
                    <input
                        id="editarNascimento"
                        type="date"
                        value={pessoaEditando.dataNascimento || ''}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={evento =>
                            atualizarCampo('dataNascimento', evento.target.value)
                        }
                        required
                    />

                    <label htmlFor="editarTurma">Turma</label>
                    <select
                        id="editarTurma"
                        value={pessoaEditando.turma || ''}
                        onChange={evento =>
                            atualizarCampo('turma', evento.target.value)
                        }
                        required={pessoaEditando.tipo === 'Aluno'}
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

                    <h3 className="cadastro-subtitulo">
                        Informações adicionais
                    </h3>

                    <label htmlFor="editarMatricula">Matrícula</label>
                    <input
                        id="editarMatricula"
                        type="text"
                        value={pessoaEditando.matricula || ''}
                        onChange={evento =>
                            atualizarCampo('matricula', evento.target.value)
                        }
                    />

                    <label htmlFor="editarEmail">E-mail</label>
                    <input
                        id="editarEmail"
                        type="email"
                        value={pessoaEditando.email || ''}
                        onChange={evento =>
                            atualizarCampo('email', evento.target.value)
                        }
                    />

                    <label htmlFor="editarTelefone">Telefone</label>
                    <input
                        id="editarTelefone"
                        type="tel"
                        value={pessoaEditando.telefone || ''}
                        onChange={evento =>
                            atualizarCampo('telefone', evento.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="modal-salvar"
                    >
                        Salvar alterações
                    </button>

                </form>
            </div>
        </div>
    )}        
        </main>
        
    )
}

export default Pessoas