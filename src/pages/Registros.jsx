import { useState } from 'react'
import '../styles/paginas.css'
import { useBiblioteca } from '../context/BibliotecaContext'
function Registros(){
    const { registros } = useBiblioteca()
    const [pesquisa, setPesquisa] = useState('')
    const [statusSelecionado, setStatusSelecionado] = useState('Todos')

    const registrosFiltrados = registros.filter((registro) => {
        const correspondePesquisa =
            registro.livro.toLowerCase().includes(pesquisa.toLowerCase()) ||
            registro.pessoa.toLowerCase().includes(pesquisa.toLowerCase())

        const correspondeStatus =
            statusSelecionado === 'Todos' ||
            registro.status === statusSelecionado

        return correspondePesquisa && correspondeStatus
    })
return (
    <main className="pagina-geral">
        <h1>Registros</h1>
        <p>Controle os empréstimos e as devoluções da biblioteca.</p>

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
                                <h3>{registro.livro}</h3>
                                <p>{registro.pessoa}</p>
                                <span>Matrícula: {registro.matricula}</span>
                            </div>
                        </div>

                        <div className="registro-datas">
                            <div>
                                <span>Empréstimo</span>
                                <strong>{registro.dataEmprestimo}</strong>
                            </div>

                            <div>
                                <span>Devolução prevista</span>
                                <strong>{registro.dataDevolucao}</strong>
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

                    </article>

                ))
            ) : (
                <p className="registros-vazio">
                    Nenhum registro encontrado.
                </p>
            )}

        </section>
    </main>
)
}
export default Registros