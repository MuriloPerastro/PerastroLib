import { useState } from 'react'
import '../styles/livros.css'
import livros from '../data/livros'
import LivroCard from '../components/LivroCard'

function Livros(){

    const [pesquisa, setPesquisa] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas')
    const [statusSelecionado, setStatusSelecionado] = useState('Todos')

    const livrosFiltrados = livros.filter((livro) => {

        const correspondePesquisa =
            livro.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
            livro.autor.toLowerCase().includes(pesquisa.toLowerCase())

        const correspondeCategoria =
            categoriaSelecionada === 'Todas' ||
            livro.categoria === categoriaSelecionada

        const correspondeStatus =
            statusSelecionado === 'Todos' ||
            livro.disponibilidade === statusSelecionado

        return correspondePesquisa && correspondeCategoria && correspondeStatus
    })

    return(
        <main className="pagina-livros">

            <div className="livros-cabecalho">
                <div>
                    <h1>Todos os Livros</h1>
                    <p>Explore e gerencie todos os livros da biblioteca.</p>
                </div>

                <span className="quantidade-livros">
                    {livrosFiltrados.length} livros encontrados
                </span>
            </div>

            <section className="livros-filtros">

                <div className="livros-pesquisa">
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou autor..."
                        value={pesquisa}
                        onChange={(evento) => setPesquisa(evento.target.value)}
                    />
                </div>

                <select
                    value={categoriaSelecionada}
                    onChange={(evento) => setCategoriaSelecionada(evento.target.value)}
                >
                    <option value="Todas">Todas as categorias</option>
                    <option value="Infantojuvenil">Infantojuvenil</option>
                    <option value="Fantasia">Fantasia</option>
                    <option value="Romance">Romance</option>
                    <option value="Aventura">Aventura</option>
                </select>

                <select
                    value={statusSelecionado}
                    onChange={(evento) => setStatusSelecionado(evento.target.value)}
                >
                    <option value="Todos">Todos os status</option>
                    <option value="Disponível">Disponíveis</option>
                    <option value="Emprestado">Emprestados</option>
                </select>

            </section>

            <section className="livros-grid">

                {livrosFiltrados.length > 0 ? (

                    livrosFiltrados.map((livro) => (
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