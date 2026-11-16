
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
    pessoas,
    config
} = useBiblioteca()

    const livro = livros.find(item => item.id === Number(id))

    const [editando, setEditando] = useState(false)

    const [dadosEdicao, setDadosEdicao] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    quantidade: 1,
    cdd: '',
    estante: '',
    secao: '',
    sinopse: '',
    categorias: ''
})

    // Histórico de empréstimos deste livro
    const historicoLivro = registros.filter(
        registro => registro.livroId === livro?.id
    )

    // Quantidade de empréstimos que ainda não foram devolvidos
    const emprestimosAtivos = historicoLivro.filter(
        registro => registro.status !== 'Devolvido'
    ).length

    const quantidadeTotal = Number(livro?.quantidade ?? 1)

    const possuiExemplarDisponivel =
        emprestimosAtivos < quantidadeTotal

    // Formata datas para o padrão brasileiro
    function formatarData(data) {
        if (!data) return 'Não informada'

        const dataFormatada = new Date(`${data}T12:00:00`)

        if (Number.isNaN(dataFormatada.getTime())) {
            return 'Não informada'
        }

        return dataFormatada.toLocaleDateString('pt-BR')
    }

    // Abre o formulário preenchido com os dados atuais
    function abrirEdicao() {
        setDadosEdicao({
            titulo: livro.titulo || '',
            autor: livro.autor || '',
            isbn: livro.isbn || '',
            quantidade: livro.quantidade ?? 1,
            estante: livro.estante || '',
            cdd: livro.cdd || '',
            secao: livro.secao || '',
            sinopse: livro.sinopse || '',
            categorias: (
                livro.categorias ||
                [livro.categoria]
            )
                .filter(Boolean)
                .join(', ')
        })

        setEditando(true)
    }

    // Atualiza os campos do formulário
    function atualizarCampo(evento) {
        const { name, value } = evento.target

        setDadosEdicao(dadosAtuais => ({
            ...dadosAtuais,
            [name]: value
        }))
    }

    // Salva as alterações do livro
    function salvarEdicao(evento) {
        evento.preventDefault()

        if (
            !dadosEdicao.titulo.trim() ||
            !dadosEdicao.autor.trim()
        ) {
            alert('Preencha o título e o autor.')
            return
        }

        const novaQuantidade = Number(dadosEdicao.quantidade)

        if (
            !Number.isInteger(novaQuantidade) ||
            novaQuantidade < 1
        ) {
            alert('Informe uma quantidade válida de exemplares.')
            return
        }

        if (novaQuantidade < emprestimosAtivos) {
            alert(
                `Não é possível cadastrar menos de ${emprestimosAtivos} exemplares, pois essa quantidade está emprestada no momento.`
            )
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
                        quantidade: novaQuantidade,
                        ...(config.modoOrganizacao === 'cdd'
                        ? {
                            cdd: dadosEdicao.cdd.trim(),
                            estante: undefined,
                            secao: undefined
                        }
                        : {
                            cdd: undefined,
                            estante: dadosEdicao.estante.trim(),
                            secao: dadosEdicao.secao.trim()
                        }),
                        sinopse: dadosEdicao.sinopse,
                        categorias: categoriasAtualizadas,
                        categoria: categoriasAtualizadas[0] || '',
                        disponibilidade:
                            emprestimosAtivos < novaQuantidade
                                ? 'Disponível'
                                : 'Emprestado'
                    }
                    : item
            )
        )

        setEditando(false)

        alert('Livro atualizado com sucesso!')
    }

    // Exclui o livro somente se não possuir histórico
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

    // Devolve um exemplar e mantém o registro no histórico
    function devolverLivro(registroId) {
        const registro = registros.find(
            item => item.id === registroId
        )

        if (!registro || registro.status === 'Devolvido') {
            return
        }

        const hoje = new Date()

        const dataHoje = [
            hoje.getFullYear(),
            String(hoje.getMonth() + 1).padStart(2, '0'),
            String(hoje.getDate()).padStart(2, '0')
        ].join('-')

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

        const outrosEmprestimosAtivos = registros.filter(
            item =>
                item.livroId === livro.id &&
                item.id !== registroId &&
                item.status !== 'Devolvido'
        ).length

        setLivros(livrosAtuais =>
            livrosAtuais.map(item =>
                item.id === livro.id
                    ? {
                        ...item,
                        disponibilidade:
                            outrosEmprestimosAtivos < Number(item.quantidade ?? 1)
                                ? 'Disponível'
                                : 'Emprestado'
                    }
                    : item
            )
        )
    }

    // Livro não encontrado
    if (!livro) {
        return (
            <main className="detalhes-livro">
                <section className="livro-nao-encontrado">
                    <h1>Livro não encontrado</h1>

                    <p>
                        O livro que você está procurando não existe
                        ou foi removido do acervo.
                    </p>

                    <button
                        type="button"
                        className="detalhes-voltar"
                        onClick={() => navegar('/livros')}
                    >
                        ← Voltar para os livros
                    </button>
                </section>
            </main>
        )
    }

    return (
        <main className="detalhes-livro">

            {/* BOTÃO VOLTAR */}
            <button
                type="button"
                className="detalhes-voltar"
                onClick={() => navegar('/livros')}
            >
                ← Voltar para os livros
            </button>

            {/* CONTEÚDO PRINCIPAL */}
            <section className="detalhes-conteudo">

                {/* CAPA */}
                <div className="detalhes-capa">
                    {livro.capa ? (
                        <img
                            src={livro.capa}
                            alt={`Capa do livro ${livro.titulo}`}
                        />
                    ) : (
                        <span>Sem capa</span>
                    )}
                </div>

                {/* INFORMAÇÕES */}
                <div className="detalhes-informacoes">

                    <span className="detalhes-categoria">
                        {livro.categorias?.length
                            ? livro.categorias.join(', ')
                            : livro.categoria || 'Sem categoria'}
                    </span>

                    <h1>{livro.titulo}</h1>

                    <p className="detalhes-autor">
                        Por {livro.autor}
                    </p>

                    <span
                        className={`detalhes-status ${
                            possuiExemplarDisponivel
                                ? 'disponivel'
                                : 'emprestado'
                        }`}
                    >
                        {possuiExemplarDisponivel
                            ? 'Disponível'
                            : 'Emprestado'}
                    </span>

                    {/* DADOS DO LIVRO */}
                    <div className="detalhes-dados">
                        <div>
                            <span>ISBN</span>
                            <strong>
                                {livro.isbn || 'Não informado'}
                            </strong>
                        </div>

                        <div>
                            <span>Quantidade</span>
                            <strong>{quantidadeTotal}</strong>
                        </div>

                        <div>
                            <span>Exemplares disponíveis</span>
                            <strong>
                                {Math.max(
                                    0,
                                    quantidadeTotal - emprestimosAtivos
                                )}
                            </strong>
                        </div>
                    </div>

                    {/* LOCALIZAÇÃO FÍSICA */}
                    {/* LOCALIZAÇÃO DO LIVRO */}
                    <div className="detalhes-localizacao">

                        {config.modoOrganizacao === 'cdd' ? (
                            <div>
                                <span>Classificação CDD</span>
                                <strong>
                                    {livro.cdd || 'Não informada'}
                                </strong>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <span>Estante</span>
                                    <strong>
                                        {livro.estante || 'Não informada'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Seção</span>
                                    <strong>
                                        {livro.secao || 'Não informada'}
                                    </strong>
                                </div>
                            </>
                        )}

                    </div>
                    {/* AÇÕES */}
                    <div className="detalhes-acoes">

                        <button
                            type="button"
                            className="botao-emprestimo"
                            disabled={!possuiExemplarDisponivel}
                            onClick={() =>
                                navegar(`/livros/${livro.id}/emprestimo`)
                            }
                        >
                            Fazer empréstimo
                        </button>

                        <button
                            type="button"
                            className="botao-editar-livro"
                            onClick={abrirEdicao}
                        >
                            ✎ Editar livro
                        </button>

                        <button
                            type="button"
                            className="botao-excluir-livro"
                            onClick={excluirLivro}
                        >
                            × Excluir livro
                        </button>

                    </div>
                </div>

                {/* SINOPSE */}
                <aside className="detalhes-sinopse">
                    <h2>Sobre este livro</h2>

                    <p>
                        {livro.sinopse ||
                            'Nenhuma sinopse cadastrada para este livro.'}
                    </p>
                </aside>

            </section>

            {/* FORMULÁRIO DE EDIÇÃO */}
            {editando && (
                <section className="form-edicao-livro">

                    <div className="form-edicao-cabecalho">
                        <div>
                            <h2>Editar livro</h2>
                            <p>
                                Atualize as informações e a localização
                                do exemplar no acervo.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="fechar-edicao"
                            onClick={() => setEditando(false)}
                            aria-label="Fechar edição"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={salvarEdicao}>

                        <div className="campo-edicao campo-largo">
                            <label htmlFor="titulo">Título</label>
                            <input
                                id="titulo"
                                name="titulo"
                                value={dadosEdicao.titulo}
                                onChange={atualizarCampo}
                                required
                            />
                        </div>

                        <div className="campo-edicao campo-largo">
                            <label htmlFor="autor">Autor</label>
                            <input
                                id="autor"
                                name="autor"
                                value={dadosEdicao.autor}
                                onChange={atualizarCampo}
                                required
                            />
                        </div>

                        <div className="campo-edicao">
                            <label htmlFor="isbn">ISBN</label>
                            <input
                                id="isbn"
                                name="isbn"
                                value={dadosEdicao.isbn}
                                onChange={atualizarCampo}
                                placeholder="ISBN do livro"
                            />
                        </div>

                        <div className="campo-edicao">
                            <label htmlFor="quantidade">
                                Quantidade de exemplares
                            </label>
                            <input
                                id="quantidade"
                                type="number"
                                name="quantidade"
                                min="1"
                                step="1"
                                value={dadosEdicao.quantidade}
                                onChange={atualizarCampo}
                                required
                            />
                        </div>

                        {config.modoOrganizacao === 'cdd' ? (
                        <div className="campo-edicao">
                            <label htmlFor="cdd">
                                Classificação CDD
                            </label>

                            <input
                                id="cdd"
                                type="text"
                                name="cdd"
                                value={dadosEdicao.cdd}
                                onChange={atualizarCampo}
                                placeholder="Ex.: 869.3, 500, B869"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="campo-edicao">
                                <label htmlFor="estante">Estante</label>

                                <input
                                    id="estante"
                                    type="text"
                                    name="estante"
                                    value={dadosEdicao.estante}
                                    onChange={atualizarCampo}
                                    placeholder="Ex.: A, B, 1, 2..."
                                />
                            </div>

                            <div className="campo-edicao">
                                <label htmlFor="secao">Seção</label>

                                <input
                                    id="secao"
                                    type="text"
                                    name="secao"
                                    value={dadosEdicao.secao}
                                    onChange={atualizarCampo}
                                    placeholder="Ex.: 1, 2, BA, ABC..."
                                />
                            </div>
                        </>
                    )}

                        <div className="campo-edicao campo-largo">
                            <label htmlFor="categorias">Categorias</label>
                            <input
                                id="categorias"
                                name="categorias"
                                value={dadosEdicao.categorias}
                                onChange={atualizarCampo}
                                placeholder="Fantasia, Aventura, Romance"
                            />
                            <small>
                                Separe as categorias por vírgula.
                            </small>
                        </div>

                        <div className="campo-edicao campo-largo">
                            <label htmlFor="sinopse">Sinopse</label>
                            <textarea
                                id="sinopse"
                                name="sinopse"
                                value={dadosEdicao.sinopse}
                                onChange={atualizarCampo}
                                rows="5"
                                placeholder="Descreva o conteúdo do livro..."
                            />
                        </div>

                        <div className="detalhes-acoes formulario-acoes">
                            <button
                                type="submit"
                                className="botao-emprestimo"
                            >
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

            {/* HISTÓRICO DE EMPRÉSTIMOS */}
            <section className="detalhes-historico">

                <h2>Histórico de empréstimos</h2>

                <p>
                    {historicoLivro.length}{' '}
                    {historicoLivro.length === 1
                        ? 'empréstimo registrado'
                        : 'empréstimos registrados'}{' '}
                    para este livro.
                </p>

                {historicoLivro.length > 0 ? (
                    historicoLivro.map(registro => {
                        const pessoa = pessoas.find(
                            item => item.id === registro.pessoaId
                        )

                        return (
                            <article
                                className="detalhes-historico-card"
                                key={registro.id}
                            >
                                <div>
                                    <span>Leitor</span>
                                    <strong>
                                        {registro.pessoaNome ||
                                            pessoa?.nome ||
                                            'Pessoa não encontrada'}
                                    </strong>

                                    <span>
                                        {registro.turmaPessoa ||
                                            pessoa?.turma ||
                                            'N/D'}
                                    </span>
                                </div>

                                <div>
                                    <span>Retirada</span>
                                    <strong>
                                        {formatarData(registro.dataEmprestimo)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Devolução prevista</span>
                                    <strong>
                                        {formatarData(
                                            registro.dataPrevistaDevolucao
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Devolução realizada</span>
                                    <strong>
                                        {registro.dataDevolucaoReal
                                            ? formatarData(
                                                registro.dataDevolucaoReal
                                            )
                                            : 'Ainda não devolvido'}
                                    </strong>
                                </div>

                                <div className="historico-acoes">
                                    {registro.status !== 'Devolvido' && (
                                        <button
                                            type="button"
                                            className="registro-devolver"
                                            onClick={() =>
                                                devolverLivro(registro.id)
                                            }
                                        >
                                            ✓ Devolver livro
                                        </button>
                                    )}

                                    <span
                                        className={`registro-status ${
                                            registro.status === 'Devolvido'
                                                ? 'status-devolvido'
                                                : 'status-andamento'
                                        }`}
                                    >
                                        {registro.status}
                                    </span>
                                </div>

                            </article>
                        )
                    })
                ) : (
                    <p className="historico-vazio">
                        Este livro ainda não possui empréstimos registrados.
                    </p>
                )}

            </section>

        </main>
    )
}

export default LivroDetalhes
