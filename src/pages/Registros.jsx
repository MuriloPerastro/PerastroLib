import { useState } from 'react'
import '../styles/paginas.css'
import { useBiblioteca } from '../context/BibliotecaContext'
function Registros(){
    const { registros, setRegistros, livros, setLivros, pessoas } = useBiblioteca()
    
    const [pesquisa, setPesquisa] = useState('')
    const [statusSelecionado, setStatusSelecionado] = useState('Todos')

    const [abaAtiva, setAbaAtiva] = useState('gerenciamento')
    function devolverLivro(registroId) {
    const hoje = new Date()

    const dataHoje = [
        hoje.getFullYear(),
        String(hoje.getMonth() + 1).padStart(2, '0'),
        String(hoje.getDate()).padStart(2, '0')
    ].join('-')

    const registroDevolvido = registros.find(
        registro => registro.id === registroId
    )

    if (!registroDevolvido || registroDevolvido.status === 'Devolvido') {
        return
    }

    setRegistros(registrosAtuais =>
        registrosAtuais.map(registro =>
            registro.id === registroId
                ? {
                    ...registro,
                    status: 'Devolvido',
                    dataDevolucaoReal: dataHoje
                }
                : registro
        )
    )

    const emprestimosAtivosDepoisDaDevolucao =
        registros.filter(registro =>
            registro.livroId === registroDevolvido.livroId &&
            registro.id !== registroId &&
            registro.status !== 'Devolvido'
        ).length

    setLivros(livrosAtuais =>
        livrosAtuais.map(livro => {
            if (livro.id !== registroDevolvido.livroId) {
                return livro
            }

            const quantidadeTotal = Number(livro.quantidade ?? 1)

            return {
                ...livro,
                disponibilidade:
                    emprestimosAtivosDepoisDaDevolucao < quantidadeTotal
                        ? 'Disponível'
                        : 'Emprestado'
            }
        })
    )
}
function excluirRegistro(registroId) {
    const registro = registros.find(
        item => item.id === registroId
    )

    if (!registro) return

    const livro = livros.find(
        item => item.id === registro.livroId
    )

    const confirmou = window.confirm(
        `Deseja excluir definitivamente o empréstimo de "${livro?.titulo || 'Livro não encontrado'}"?\n\nEssa ação não poderá ser desfeita.`
    )

    if (!confirmou) return

    // Remove somente o registro selecionado.
    setRegistros(registrosAtuais =>
        registrosAtuais.filter(
            item => item.id !== registroId
        )
    )

    // Se o empréstimo ainda estava ativo, recalcula a disponibilidade.
    if (registro.status !== 'Devolvido') {
        const emprestimosAtivosRestantes = registros.filter(
            item =>
                item.livroId === registro.livroId &&
                item.id !== registroId &&
                item.status !== 'Devolvido'
        ).length

        setLivros(livrosAtuais =>
            livrosAtuais.map(item => {
                if (item.id !== registro.livroId) return item

                const quantidadeTotal = Math.max(
                    1,
                    Number(item.quantidade ?? 1)
                )

                return {
                    ...item,
                    disponibilidade:
                        emprestimosAtivosRestantes < quantidadeTotal
                            ? 'Disponível'
                            : 'Emprestado'
                }
            })
        )
    }

    alert('Registro excluído definitivamente.')
}
    const registrosFiltrados = registros.filter(registro => {
    const livro = livros.find(item => item.id === registro.livroId)
    const pessoa = pessoas.find(item => item.id === registro.pessoaId)

    const nomeLivro = livro?.titulo || ''
    const nomePessoa = pessoa?.nome || ''

    const correspondePesquisa =
        nomeLivro.toLowerCase().includes(pesquisa.toLowerCase()) ||
        nomePessoa.toLowerCase().includes(pesquisa.toLowerCase())

    const correspondeStatus =
        statusSelecionado === 'Todos' ||
        registro.status === statusSelecionado

    return correspondePesquisa && correspondeStatus
})

// Calcula a idade da pessoa na data do empréstimo.
function calcularIdadeNaData(dataNascimento, dataReferencia) {
    if (!dataNascimento || !dataReferencia) return null

    const nascimento = new Date(`${dataNascimento}T12:00:00`)
    const referencia = new Date(`${dataReferencia}T12:00:00`)

    if (
        Number.isNaN(nascimento.getTime()) ||
        Number.isNaN(referencia.getTime())
    ) {
        return null
    }

    let idade = referencia.getFullYear() - nascimento.getFullYear()

    if (
        referencia.getMonth() < nascimento.getMonth() ||
        (
            referencia.getMonth() === nascimento.getMonth() &&
            referencia.getDate() < nascimento.getDate()
        )
    ) {
        idade--
    }

    return idade >= 0 ? idade : null
}

// Enriquece os registros antigos com os dados atuais,
// sem alterar nem sobrescrever o histórico salvo.
const registrosComDados = registros.map(registro => {
    const pessoaAtual = pessoas.find(
        pessoa => pessoa.id === registro.pessoaId
    )

    const livroAtual = livros.find(
        livro => livro.id === registro.livroId
    )

    const categorias = registro.categoriasLivro ||
        (livroAtual?.categorias?.length
            ? livroAtual.categorias
            : livroAtual?.categoria
                ? [livroAtual.categoria]
                : [])

    return {
        ...registro,

        livroTitulo:
            registro.livroTitulo ||
            livroAtual?.titulo ||
            'Livro não encontrado',

        categoriasLivro: categorias,

        pessoaTipo:
            registro.pessoaTipo ||
            pessoaAtual?.tipo ||
            'Não informado',

        turmaPessoa:
            registro.turmaPessoa ||
            pessoaAtual?.turma ||
            'Não informada',

        generoPessoa:
            registro.generoPessoa ||
            pessoaAtual?.genero ||
            'Não informado',

        idadePessoa:
            registro.idadePessoa ??
            calcularIdadeNaData(
                pessoaAtual?.dataNascimento,
                registro.dataEmprestimo
            )
    }
})

// Indicadores principais
const totalEmprestimos = registros.length

const totalAtivos = registros.filter(
    registro => registro.status !== 'Devolvido'
).length

const totalDevolvidos = registros.filter(
    registro => registro.status === 'Devolvido'
).length

const totalLeitores = new Set(
    registros.map(registro => registro.pessoaId)
).size

// Agrupa os registros por uma informação.
function agruparRegistros(chave) {
    const contagem = {}

    registrosComDados.forEach(registro => {
        const valor = registro[chave] || 'Não informado'
        contagem[valor] = (contagem[valor] || 0) + 1
    })

    return Object.entries(contagem)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
}

// Livros mais emprestados
const livrosPopulares = agruparRegistros('livroTitulo').slice(0, 5)

// Empréstimos por gênero da pessoa
const emprestimosPorGenero = agruparRegistros('generoPessoa')

// Empréstimos por turma
const emprestimosPorTurma = agruparRegistros('turmaPessoa')
    .filter(item => item.nome !== 'Não informada')
    .slice(0, 5)

// Categorias literárias mais emprestadas
const contagemCategorias = {}

registrosComDados.forEach(registro => {
    const categorias = [...new Set(registro.categoriasLivro || [])]

    categorias.forEach(categoria => {
        contagemCategorias[categoria] =
            (contagemCategorias[categoria] || 0) + 1
    })
})

const categoriasPopulares = Object.entries(contagemCategorias)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5)

// Distribuição por faixa etária
const faixasEtarias = [
    { nome: 'Até 10 anos', minimo: 0, maximo: 10 },
    { nome: '11 a 14 anos', minimo: 11, maximo: 14 },
    { nome: '15 a 17 anos', minimo: 15, maximo: 17 },
    { nome: '18 a 24 anos', minimo: 18, maximo: 24 },
    { nome: '25 anos ou mais', minimo: 25, maximo: Infinity }
]

const emprestimosPorIdade = faixasEtarias.map(faixa => ({
    nome: faixa.nome,
    quantidade: registrosComDados.filter(registro =>
        registro.idadePessoa !== null &&
        registro.idadePessoa >= faixa.minimo &&
        registro.idadePessoa <= faixa.maximo
    ).length
}))

// Tempo médio entre retirada e devolução.
// Empréstimos ainda ativos não entram nessa média.
const duracoes = registros
    .filter(registro =>
        registro.status === 'Devolvido' &&
        registro.dataEmprestimo &&
        registro.dataDevolucaoReal
    )
    .map(registro => {
        const retirada = new Date(`${registro.dataEmprestimo}T12:00:00`)
        const devolucao = new Date(`${registro.dataDevolucaoReal}T12:00:00`)

        return Math.max(
            0,
            Math.round((devolucao - retirada) / (1000 * 60 * 60 * 24))
        )
    })

const tempoMedioEmprestimo = duracoes.length
    ? Math.round(
        duracoes.reduce((total, dias) => total + dias, 0) /
        duracoes.length
    )
    : 0

return (
    <main className="pagina-geral">
        <h1>Registros</h1>
        <p>Controle os empréstimos e as devoluções da biblioteca.</p>

        <nav className="registros-abas">
    <button
        type="button"
        className={abaAtiva === 'gerenciamento' ? 'active' : ''}
        onClick={() => setAbaAtiva('gerenciamento')}
    >
        <span>☷</span> Gerenciamento
    </button>

    <button
        type="button"
        className={abaAtiva === 'dashboard' ? 'active' : ''}
        onClick={() => setAbaAtiva('dashboard')}
    >
        <span>▥</span> Dashboard
    </button>
</nav>
        {abaAtiva === 'gerenciamento' && (
    <>
        <section className="registros-resumo">

            <div className="registro-resumo-card">
                <span>Total de registros</span>
                <strong>{registros.length}</strong>
            </div>

            <div className="registro-resumo-card">
                <span>Em andamento</span>
                <strong>
                    {registros.filter(registro => registro.status === 'Em andamento').length}
                </strong>
            </div>

            <div className="registro-resumo-card">
                <span>Atrasados</span>
                <strong>
                    {registros.filter(registro => registro.status === 'Atrasado').length}
                </strong>
            </div>

            <div className="registro-resumo-card">
                <span>Devolvidos</span>
                <strong>
                    {registros.filter(registro => registro.status === 'Devolvido').length}
                </strong>
            </div>

        </section>

        <section className="registros-filtros">

            <input
                type="text"
                placeholder="Pesquisar por livro ou pessoa..."
                value={pesquisa}
                onChange={(evento) => setPesquisa(evento.target.value)}
            />

            <div className="registros-tipos">

                <button
                    className={statusSelecionado === 'Todos' ? 'active' : ''}
                    onClick={() => setStatusSelecionado('Todos')}
                >
                    Todos
                </button>

                <button
                    className={statusSelecionado === 'Em andamento' ? 'active' : ''}
                    onClick={() => setStatusSelecionado('Em andamento')}
                >
                    Em andamento
                </button>

                <button
                    className={statusSelecionado === 'Atrasado' ? 'active' : ''}
                    onClick={() => setStatusSelecionado('Atrasado')}
                >
                    Atrasados
                </button>

                <button
                    className={statusSelecionado === 'Devolvido' ? 'active' : ''}
                    onClick={() => setStatusSelecionado('Devolvido')}
                >
                    Devolvidos
                </button>

            </div>
        </section>

        <section className="registros-lista">

            {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((registro) => (

                    <article className="registro-card" key={registro.id}>

                        <div className="registro-principal">
                            <div className="registro-icone">
                                📚
                            </div>

                            <div className="registro-dados">
                                <h3>
                                    {livros.find(item => item.id === registro.livroId)?.titulo || 'Livro não encontrado'}
                                </h3>

                                <p>
                                    {pessoas.find(item => item.id === registro.pessoaId)?.nome || 'Pessoa não encontrada'}
                                </p>

                                <span>
                                    Matrícula: {
                                        pessoas.find(item => item.id === registro.pessoaId)?.matricula || 'Não informada'
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="registro-datas">
                            <div>
                                <span>Empréstimo</span>
                                <strong>
                                    {new Date(`${registro.dataEmprestimo}T12:00:00`).toLocaleDateString('pt-BR')}
                                </strong>
                            </div>

                            <div>
                                <span>Devolução prevista</span>
                                <strong>
                                    {new Date(`${registro.dataPrevistaDevolucao}T12:00:00`).toLocaleDateString('pt-BR')}
                                </strong>
                            </div>

                            <div>
                                <span>Devolução realizada</span>
                                <strong>
                                    {registro.dataDevolucaoReal
                                        ? new Date(`${registro.dataDevolucaoReal}T12:00:00`).toLocaleDateString('pt-BR')
                                        : 'Ainda não devolvido'}
                                </strong>
                            </div>
                        </div>

                        <span className={`registro-status ${
                            registro.status === 'Em andamento'
                                ? 'status-andamento'
                                : registro.status === 'Atrasado'
                                    ? 'status-atrasado'
                                    : 'status-devolvido'
                        }`}>
                            {registro.status}
                        </span>
                    
                    {registro.status !== 'Devolvido' && (
                        <button
                            type="button"
                            className="registro-devolver"
                            onClick={() => devolverLivro(registro.id)}
                        >
                            <span>✓</span>
                            Devolver livro
                        </button>
                    )}
                    <button
                        type="button"
                        className="registro-excluir"
                        onClick={() => excluirRegistro(registro.id)}
                    >
                        <span>×</span>
                        Excluir registro
                    </button>

                    </article>

                ))
            ) : (
                <p className="registros-vazio">
                    Nenhum registro encontrado.
                </p>
            )}

        </section>
        </>
)} 
{abaAtiva === 'dashboard' && (
    <section className="dashboard-registros">

        <div className="dashboard-cabecalho">
            <div>
                <h2>Visão geral da biblioteca</h2>
                <p>
                    Acompanhe os empréstimos e descubra os hábitos
                    de leitura da comunidade.
                </p>
            </div>
        </div>

        {/* Indicadores principais */}
        <div className="dashboard-indicadores">

            <article className="dashboard-indicador">
                <span>Total de empréstimos</span>
                <strong>{totalEmprestimos}</strong>
                <small>Registros existentes</small>
            </article>

            <article className="dashboard-indicador">
                <span>Em andamento</span>
                <strong>{totalAtivos}</strong>
                <small>Empréstimos não devolvidos</small>
            </article>

            <article className="dashboard-indicador">
                <span>Devolvidos</span>
                <strong>{totalDevolvidos}</strong>
                <small>Empréstimos concluídos</small>
            </article>

            <article className="dashboard-indicador">
                <span>Leitores</span>
                <strong>{totalLeitores}</strong>
                <small>Pessoas com empréstimos registrados</small>
            </article>

            <article className="dashboard-indicador">
                <span>Tempo médio</span>
                <strong>{tempoMedioEmprestimo} dias</strong>
                <small>
                    {duracoes.length} empréstimos concluídos analisados
                </small>
            </article>

        </div>

        {/* Livros e categorias */}
        <div className="dashboard-graficos">

            <article className="dashboard-painel">
                <h3>Livros mais emprestados</h3>
                <p>Os títulos com maior circulação.</p>

                {livrosPopulares.length === 0 ? (
                    <span className="dashboard-vazio">
                        Ainda não existem empréstimos.
                    </span>
                ) : (
                    livrosPopulares.map(item => {
                        const maior = Math.max(
                            1,
                            ...livrosPopulares.map(livro => livro.quantidade)
                        )

                        return (
                            <div className="dashboard-barra-item" key={item.nome}>
                                <div className="dashboard-barra-legenda">
                                    <span>{item.nome}</span>
                                    <strong>{item.quantidade}</strong>
                                </div>

                                <div className="dashboard-barra-fundo">
                                    <div
                                        className="dashboard-barra preenchimento-azul"
                                        style={{
                                            width: `${item.quantidade / maior * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </article>

            <article className="dashboard-painel">
                <h3>Categorias literárias populares</h3>
                <p>O que a comunidade está lendo?</p>

                {categoriasPopulares.length === 0 ? (
                    <span className="dashboard-vazio">
                        Ainda não existem categorias nos empréstimos.
                    </span>
                ) : (
                    categoriasPopulares.map(item => {
                        const maior = Math.max(
                            1,
                            ...categoriasPopulares.map(categoria => categoria.quantidade)
                        )

                        return (
                            <div className="dashboard-barra-item" key={item.nome}>
                                <div className="dashboard-barra-legenda">
                                    <span>{item.nome}</span>
                                    <strong>{item.quantidade}</strong>
                                </div>

                                <div className="dashboard-barra-fundo">
                                    <div
                                        className="dashboard-barra preenchimento-verde"
                                        style={{
                                            width: `${item.quantidade / maior * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </article>

            {/* Gênero da pessoa */}
            <article className="dashboard-painel">
                <h3>Empréstimos por gênero da pessoa</h3>
                <p>Distribuição dos registros por gênero informado.</p>

                {emprestimosPorGenero.length === 0 ? (
                    <span className="dashboard-vazio">
                        Ainda não existem dados.
                    </span>
                ) : (
                    emprestimosPorGenero.map(item => {
                        const maior = Math.max(
                            1,
                            ...emprestimosPorGenero.map(genero => genero.quantidade)
                        )

                        return (
                            <div className="dashboard-barra-item" key={item.nome}>
                                <div className="dashboard-barra-legenda">
                                    <span>{item.nome}</span>
                                    <strong>{item.quantidade}</strong>
                                </div>

                                <div className="dashboard-barra-fundo">
                                    <div
                                        className="dashboard-barra preenchimento-roxo"
                                        style={{
                                            width: `${item.quantidade / maior * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </article>

            {/* Faixas etárias */}
            <article className="dashboard-painel">
                <h3>Leitura por faixa etária</h3>
                <p>Empréstimos agrupados pela idade na retirada.</p>

                {emprestimosPorIdade.map(item => {
                    const maior = Math.max(
                        1,
                        ...emprestimosPorIdade.map(faixa => faixa.quantidade)
                    )

                    return (
                        <div className="dashboard-barra-item" key={item.nome}>
                            <div className="dashboard-barra-legenda">
                                <span>{item.nome}</span>
                                <strong>{item.quantidade}</strong>
                            </div>

                            <div className="dashboard-barra-fundo">
                                <div
                                    className="dashboard-barra preenchimento-amarelo"
                                    style={{
                                        width: `${item.quantidade / maior * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </article>

            {/* Turmas */}
            <article className="dashboard-painel">
                <h3>Turmas com mais empréstimos</h3>
                <p>Participação das turmas na circulação de livros.</p>

                {emprestimosPorTurma.length === 0 ? (
                    <span className="dashboard-vazio">
                        Não há turmas identificadas nos registros.
                    </span>
                ) : (
                    emprestimosPorTurma.map(item => {
                        const maior = Math.max(
                            1,
                            ...emprestimosPorTurma.map(turma => turma.quantidade)
                        )

                        return (
                            <div className="dashboard-barra-item" key={item.nome}>
                                <div className="dashboard-barra-legenda">
                                    <span>{item.nome}</span>
                                    <strong>{item.quantidade}</strong>
                                </div>

                                <div className="dashboard-barra-fundo">
                                    <div
                                        className="dashboard-barra preenchimento-azul"
                                        style={{
                                            width: `${item.quantidade / maior * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </article>

        </div>

        <p className="dashboard-nota">
            Os indicadores contam registros de empréstimos, não pessoas únicas,
            exceto o indicador de leitores. Informações não disponíveis nos
            registros antigos podem aparecer como não informadas.
        </p>

    </section>
)}

</main>
)
}
export default Registros