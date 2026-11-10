import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useBiblioteca } from '../context/BibliotecaContext'
import '../styles/livroDetalhes.css'

function LivroDetalhes() {
    const { id } = useParams()
    const navegar = useNavigate()

    const {
        livros,
        setLivros,
        registros,
        setRegistros,
        pessoas
    } = useBiblioteca()
    const livro = livros.find(item => item.id === Number(id))

    const [editando, setEditando] = useState(false)

    const [dadosEdicao, setDadosEdicao] = useState({
        titulo: '',
        autor: '',
        isbn: '',
        quantidade: 1,
        sinopse: '',
        categorias: ''
    })

    function abrirEdicao() {
    setDadosEdicao({
        titulo: livro.titulo || '',
        autor: livro.autor || '',
        isbn: livro.isbn || '',
        quantidade: livro.quantidade ?? 1,
        sinopse: livro.sinopse || '',
        categorias: (livro.categorias || [livro.categoria]).filter(Boolean).join(', ')
    })

    setEditando(true)
}

function atualizarCampo(evento) {
    const { name, value } = evento.target

    setDadosEdicao(dadosAtuais => ({
        ...dadosAtuais,
        [name]: value
    }))
}

function salvarEdicao(evento) {
    evento.preventDefault()

    if (!dadosEdicao.titulo.trim() || !dadosEdicao.autor.trim()) {
        alert('Preencha o título e o autor.')
        return
    }

    const categoriasAtualizadas = dadosEdicao.categorias
        .split(',')
        .map(categoria => categoria.trim())
        .filter(Boolean)

    setLivros(livrosAtuais =>
        livrosAtuais.map(item =>
            item.id === livro.id
                ? {
                    ...item,
                    titulo: dadosEdicao.titulo.trim(),
                    autor: dadosEdicao.autor.trim(),
                    isbn: dadosEdicao.isbn.trim(),
                    quantidade: Math.max(1, Number(dadosEdicao.quantidade)),
                    sinopse: dadosEdicao.sinopse,
                    categorias: categoriasAtualizadas,
                    categoria: categoriasAtualizadas[0] || ''
                }
                : item
        )
    )

    setEditando(false)
    alert('Livro atualizado com sucesso!')
}
    function excluirLivro() {
    const possuiHistorico = registros.some(
        registro => registro.livroId === livro.id
    )

    if (possuiHistorico) {
        alert(
            'Este livro possui histórico de empréstimos e não pode ser excluído. Assim, preservamos os registros da biblioteca.'
        )
        return
    }

    const confirmou = window.confirm(
        `Tem certeza que deseja excluir "${livro.titulo}"?`
    )

    if (!confirmou) return

    setLivros(livrosAtuais =>
        livrosAtuais.filter(item => item.id !== livro.id)
    )

    navegar('/livros')
}

    const historicoLivro = registros.filter(registro =>
    registro.livroId === livro?.id
)
    function devolverLivro(registroId) {
    const hoje = new Date()

    const dataHoje = [
        hoje.getFullYear(),
        String(hoje.getMonth() + 1).padStart(2, '0'),
        String(hoje.getDate()).padStart(2, '0')
    ].join('-')

    const registro = registros.find(item => item.id === registroId)

    if (!registro || registro.status === 'Devolvido') {
        return
    }

    setRegistros(registrosAtuais =>
        registrosAtuais.map(item =>
            item.id === registroId
                ? {
                    ...item,
                    status: 'Devolvido',
                    dataDevolucaoReal: dataHoje
                }
                : item
        )
    )

    const outrosEmprestimosAtivos = registros.filter(item =>
        item.livroId === livro.id &&
        item.id !== registroId &&
        item.status !== 'Devolvido'
    ).length

    const quantidadeTotal = Number(livro.quantidade ?? 1)

    setLivros(livrosAtuais =>
        livrosAtuais.map(item =>
            item.id === livro.id
                ? {
                    ...item,
                    disponibilidade:
                        outrosEmprestimosAtivos < quantidadeTotal
                            ? 'Disponível'
                            : 'Emprestado'
                }
                : item
        )
    )
}

    if (!livro) {
        const historicoLivro = registros.filter(registro =>
            registro.livroId === livro?.id )
        return (

            <main className="detalhes-livro">
                <h1>Livro não encontrado</h1>

                <button onClick={() => navegar('/livros')}>
                    Voltar para os livros
                </button>
            
            </main>
        )
    }

    return (
        <main className="detalhes-livro">

            <button
                className="detalhes-voltar"
                onClick={() => navegar('/livros')}
            >
                ← Voltar para os livros
            </button>

            <section className="detalhes-conteudo">

                <div className="detalhes-capa">
                    {livro.capa ? (
                        <img src={livro.capa} alt={livro.titulo} />
                    ) : (
                        <span>Sem capa</span>
                    )}
                </div>

                <div className="detalhes-informacoes">

                    <span className="detalhes-categoria">
                        {livro.categorias?.join(', ') || livro.categoria}
                    </span>

                    <h1>{livro.titulo}</h1>

                    <p className="detalhes-autor">
                        Por {livro.autor}
                    </p>

                    <div className="detalhes-dados">
                        <div>
                            <span>ISBN</span>
                            <strong>{livro.isbn || 'Não informado'}</strong>
                        </div>

                        <div>
                            <span>Quantidade</span>
                            <strong>{livro.quantidade ?? 'Não informada'}</strong>
                        </div>
                    </div>

                    <div className="detalhes-acoes">

                    <button
                        className="botao-emprestimo"
                        disabled={livro.disponibilidade !== 'Disponível'}
                        onClick={() => navegar(`/livros/${livro.id}/emprestimo`)}
                    >
                        Fazer empréstimo
                    </button>

                    <button
                        className="botao-editar-livro"
                        onClick={abrirEdicao}
                    >
                        ✎ Editar livro
                    </button>

                    <button
                        className="botao-excluir-livro"
                        onClick={excluirLivro}
                    >
                        × Excluir livro
                    </button>

                </div>

                </div>

                <aside className="detalhes-sinopse">
                    <h2>Sobre este livro</h2>

                    <p>
                        {livro.sinopse || 'Nenhuma sinopse cadastrada para este livro.'}
                    </p>
                </aside>

            </section>
            {editando && (
    <section className="form-edicao-livro">
        <h2>Editar livro</h2>

        <form onSubmit={salvarEdicao}>
            <label>Título</label>
            <input
                name="titulo"
                value={dadosEdicao.titulo}
                onChange={atualizarCampo}
                required
            />

            <label>Autor</label>
            <input
                name="autor"
                value={dadosEdicao.autor}
                onChange={atualizarCampo}
                required
            />

            <label>ISBN</label>
            <input
                name="isbn"
                value={dadosEdicao.isbn}
                onChange={atualizarCampo}
            />

            <label>Quantidade de exemplares</label>
            <input
                type="number"
                name="quantidade"
                min="1"
                step="1"
                value={dadosEdicao.quantidade}
                onChange={atualizarCampo}
                required
            />

            <label>Categorias</label>
            <input
                name="categorias"
                value={dadosEdicao.categorias}
                onChange={atualizarCampo}
                placeholder="Fantasia, Aventura, Romance"
            />

            <label>Sinopse</label>
            <textarea
                name="sinopse"
                value={dadosEdicao.sinopse}
                onChange={atualizarCampo}
                rows="5"
            />

            <div className="detalhes-acoes">
                <button type="submit" className="botao-emprestimo">
                    Salvar alterações
                </button>

                <button
                    type="button"
                    className="botao-excluir-livro"
                    onClick={() => setEditando(false)}
                >
                    Cancelar
                </button>
            </div>
        </form>
    </section>
)}
            <section className="detalhes-historico">
                <h2>Histórico de empréstimos</h2>

                <p>
                    {historicoLivro.length} empréstimos registrados para este livro.
                </p>

                {historicoLivro.length > 0 ? (
                    historicoLivro.map(registro => {
                        const pessoa = pessoas.find(item =>
                            item.id === registro.pessoaId
                        )

                        return (
                            <article
                                className="detalhes-historico-card"
                                key={registro.id}
                            >
                                <div>
                                    <strong>
                                        {pessoa?.nome || 'Pessoa não encontrada'}
                                    </strong>

                                    <span>
                                        {pessoa?.turma || 'Turma não informada'}
                                    </span>
                                </div>

                                <div>
                                    <span>Retirada</span>
                                    <strong>
                                        {new Date(
                                            `${registro.dataEmprestimo}T12:00:00`
                                        ).toLocaleDateString('pt-BR')}
                                    </strong>
                                </div>

                                <div>
                                    <span>Devolução prevista</span>
                                    <strong>
                                        {new Date(
                                            `${registro.dataPrevistaDevolucao}T12:00:00`
                                        ).toLocaleDateString('pt-BR')}
                                    </strong>
                                </div>

                                <div>
                                    <span>Devolução realizada</span>
                                    <strong>
                                        {registro.dataDevolucaoReal
                                            ? new Date(
                                                `${registro.dataDevolucaoReal}T12:00:00`
                                            ).toLocaleDateString('pt-BR')
                                            : 'Ainda não devolvido'}
                                    </strong>
                                </div>

                                {registro.status !== 'Devolvido' && (
                                    <button
                                        type="button"
                                        className="registro-devolver"
                                        onClick={() => devolverLivro(registro.id)}
                                    >
                                        ✓ Devolver livro
                                    </button>
                                )}

                                <span className="registro-status">
                                    {registro.status}
                                </span>
                            </article>
                        )
                    })
                ) : (
                    <p>Este livro ainda não possui empréstimos registrados.</p>
                )}
            </section>

        </main>
    )
}

export default LivroDetalhes