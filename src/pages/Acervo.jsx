import '../styles/acervo.css'
import livros from '../data/livros'
import LivroCard from '../components/LivroCard'
function Acervo(){
    return(
        <main className="acervo">
            <h1>Acervo de Livros</h1>
            <p>
                Gerencie e organize os livros da biblioteca.
            </p>

            <section className='acervo-info'>

                <div className='info-card'>
                    <span className='info-label'>
                        Total de livros
                    </span>
                    <strong className='info-number'>
                        6969
                    </strong>
                    <span className='info-description'>
                        Livros Cadastrados
                    </span>
                </div>
                
                <div className='info-card'>
                    <span className='info-label'>
                        Disponíveis
                    </span>
                    <strong className='info-number'>
                        67
                    </strong>
                    <span className='info-description'>
                        Livros disponíveis para empréstimo
                    </span>
                </div>

                <div className='info-card'>
                    <span className='info-label'>
                        Emprestados
                    </span>
                    <strong className='info-number'>
                        101
                    </strong>
                    <span className='info-description'>
                        Livros com leitores
                    </span>
                </div>

            </section>
            <section className='acervo-filtros'>

                <div className='pesquisa'>
                    <input 
                    type="text"
                    placeholder='Pesquisar por título ou autor...' />
                </div>

                <div className='categorias'>

                    <button className='categoria active'>
                        Todos
                    </button>

                    <button className='categoria'>
                        InfantoJuvenil
                    </button>

                    <button className='categoria'>
                        Romance
                    </button>

                    <button className='categoria'>
                        Aventura
                    </button>
                </div>
            </section>

            <section className='livros-grid'>
                {livros.map((livro) => (
                    <LivroCard key={livro.id} livro={livro}/>
                ))}
            </section>
        </main>
    )
}
export default Acervo