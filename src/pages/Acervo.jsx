import { useState } from 'react'
import '../styles/acervo.css'
import livros from '../data/livros'
import LivroCard from '../components/LivroCard'
function Acervo(){

    const [pesquisa, setPesquisa] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
    
    const livrosFiltrados = livros.filter((livro)=> {
        const correspondePesquisa = 
        livro.titulo.toLocaleLowerCase().includes(pesquisa.toLocaleLowerCase()) || livro.autor.toLocaleLowerCase().includes(pesquisa.toLocaleLowerCase())

        const correspondeCategoria = categoriaSelecionada === 'Todos' || livro.categoria === categoriaSelecionada

        return correspondePesquisa && correspondeCategoria
    })
    
    

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
                    placeholder='Pesquisar por título ou autor...'
                    value={pesquisa} 
                    onChange={(evento)=> setPesquisa(evento.target.value)}
                    />

                </div>

                <div className='categorias'>

                    <button className={`categoria ${categoriaSelecionada === 'Todos' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Todos')} >
                        Todos
                    </button>

                    <button className={`categoria ${categoriaSelecionada =='Infantojuvenil' ? 'active':''}`} onClick={()=>setCategoriaSelecionada('Infantojuvenil')}>
                        Infantojuvenil
                    </button>

                    <button className={`categoria ${categoriaSelecionada === 'Fantasia' ? 'active': ''}`}onClick={() => setCategoriaSelecionada('Fantasia')}>
                        Fantasia
                    </button>

                    <button
                        className={`categoria ${categoriaSelecionada === 'Romance' ? 'active' : ''}`}
                        onClick={() => setCategoriaSelecionada('Romance')}>
                        Romance
                    </button>

                    <button
                    className={`categoria ${categoriaSelecionada === 'Aventura' ? 'active' : ''}`}
                    onClick={() => setCategoriaSelecionada('Aventura')}>
                        Aventura
                    </button>

                </div>
            </section>

            <section className='livros-grid'>
                {livrosFiltrados.length >0 ?(
                    livrosFiltrados.map((livro) => (
                        <LivroCard key={livro.id} livro={livro}/>
                    ))

                ):(
                    <p className='nenhum-livro'>Nenhum livro encontrado</p>
                )}
            </section>

            
        </main>
    )
}
export default Acervo