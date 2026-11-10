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
    <section className="dashboard-em-construcao">
        <div className="dashboard-em-construcao-icone">
            📊
        </div>

        <h2>Dashboard da biblioteca</h2>

        <p>
            Estamos preparando os indicadores e gráficos
            para analisar os hábitos de leitura da biblioteca.
        </p>

        <span>
            Próxima etapa: análise de leitores, turmas,
            idades, gêneros e popularidade dos livros.
        </span>
    </section>
)}

</main>
)
}
export default Registros