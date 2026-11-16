import { Link } from 'react-router'
import '../styles/livroCard.css'
import { useBiblioteca } from '../context/BibliotecaContext'

function LivroCard({ livro }) {
    const { registros, config } = useBiblioteca()

    const totalEmprestimos = registros.filter(
        registro => registro.livroId === livro.id
    ).length

    return (
        <Link
            to={`/livros/${livro.id}`}
            className="livro-card-link"
        >
            <article className="livro-card">

                <div className="livro-capa">
                    {livro.capa ? (
                        <img
                            src={livro.capa}
                            alt={livro.titulo}
                        />
                    ) : (
                        <span>Sem capa</span>
                    )}
                </div>

                <div className="livro-informacoes">

                    <h3>{livro.titulo}</h3>

                    <p>{livro.autor}</p>

                    <div className="livro-meta">
                        <span
                            className={`livro-status ${
                                livro.disponibilidade === 'Disponível'
                                    ? 'disponivel'
                                    : 'emprestado'
                            }`}
                        >
                            {livro.disponibilidade}
                        </span>

                        <span className="livro-contagem">
                            {totalEmprestimos}{' '}
                            {totalEmprestimos === 1
                                ? 'empréstimo'
                                : 'empréstimos'}
                        </span>
                    </div>

                    <div className="livro-localizacao-card">
                        {config.modoOrganizacao === 'cdd' ? (
                            <span>
                                CDD: {livro.cdd || 'Não informada'}
                            </span>
                        ) : (
                            <span>
                                Estante: {livro.estante || '—'}
                                {' | '}
                                Seção: {livro.secao || '—'}
                            </span>
                        )}
                    </div>

                </div>
            </article>
        </Link>
    )
}

export default LivroCard