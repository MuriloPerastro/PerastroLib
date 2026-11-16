import { useState } from 'react'
import '../styles/livros.css'
import { useBiblioteca } from '../context/BibliotecaContext'
import LivroCard from '../components/LivroCard'

function Livros() {
    const { livros, categorias, config } = useBiblioteca()

    const [pesquisa, setPesquisa] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas')
    const [statusSelecionado, setStatusSelecionado] = useState('Todos')

    const termo = pesquisa.toLowerCase().trim()

    const livrosFiltrados = livros.filter(livro => {
        const correspondeLocalizacao =
            config.modoOrganizacao === 'cdd'
                ? (livro.cdd || '').toLowerCase().includes(termo)
                : (
                    (livro.estante || '').toLowerCase().includes(termo) ||
                    (livro.secao || '').toLowerCase().includes(termo)
                )

        const correspondePesquisa =
            (livro.titulo || '').toLowerCase().includes(termo) ||
            (livro.autor || '').toLowerCase().includes(termo) ||
            correspondeLocalizacao

        const correspondeCategoria =
            categoriaSelecionada === 'Todas' ||
            (livro.categorias || [livro.categoria])
                .includes(categoriaSelecionada)

        const correspondeStatus =
            statusSelecionado === 'Todos' ||
            livro.disponibilidade === statusSelecionado

        return (
            correspondePesquisa &&
            correspondeCategoria &&
            correspondeStatus
        )
    })

    const placeholderPesquisa =
        config.modoOrganizacao === 'cdd'
            ? 'Pesquisar por título, autor ou CDD...'
            : 'Pesquisar por título, autor, estante ou seção...'

    return (
        <main className="pagina-livros">

            <div className="livros-cabecalho">
                <div>
                    <h1>Todos os Livros</h1>
                    <p>
                        Explore e gerencie todos os livros da biblioteca.
                    </p>
                </div>

                <span className="quantidade-livros">
                    {livrosFiltrados.length} livros encontrados
                </span>
            </div>

            <section className="livros-filtros">

                <div className="livros-pesquisa">
                    <input
                        type="text"
                        placeholder={placeholderPesquisa}
                        value={pesquisa}
                        onChange={evento =>
                            setPesquisa(evento.target.value)
                        }
                    />
                </div>

                <select
                    value={categoriaSelecionada}
                    onChange={evento =>
                        setCategoriaSelecionada(evento.target.value)
                    }
                >
                    <option value="Todas">Todas as categorias</option>

                    {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>
                            {categoria}
                        </option>
                    ))}
                </select>

                <select
                    value={statusSelecionado}
                    onChange={evento =>
                        setStatusSelecionado(evento.target.value)
                    }
                >
                    <option value="Todos">Todos os status</option>
                    <option value="Disponível">Disponíveis</option>
                    <option value="Emprestado">Emprestados</option>
                </select>

            </section>

            <section className="livros-grid">

                {livrosFiltrados.length > 0 ? (
                    livrosFiltrados.map(livro => (
                        <LivroCard
                            key={livro.id}
                            livro={livro}
                        />
                    ))
                ) : (
                    <p className="nenhum-livro">
                        Nenhum livro encontrado.
                    </p>
                )}

            </section>
        </main>
    )
}

export default Livros