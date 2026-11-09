import { useParams, useNavigate } from 'react-router'
import { useBiblioteca } from '../context/BibliotecaContext'
import '../styles/livroDetalhes.css'

function LivroDetalhes() {
    const { id } = useParams()
    const navegar = useNavigate()

    const { livros } = useBiblioteca()

    const livro = livros.find(item => item.id === Number(id))


    if (!livro) {
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
                        {livro.categoria}
                    </span>

                    <h1>{livro.titulo}</h1>

                    <p className="detalhes-autor">
                        Por {livro.autor}
                    </p>

                    <div className={`detalhes-status ${
                        livro.disponibilidade === 'Disponível'
                            ? 'disponivel'
                            : 'emprestado'
                    }`}>
                        {livro.disponibilidade}
                    </div>

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
                            className="botao-excluir-livro"
                            onClick={() => alert('A exclusão será implementada junto com a persistência dos dados.')}
                        >
                            Excluir livro
                        </button>

                    </div>

                </div>

            </section>

        </main>
    )
}

export default LivroDetalhes