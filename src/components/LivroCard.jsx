import {Link} from 'react-router'
import '../styles/livroCard.css'

function LivroCard({ livro}){
    return(
        <Link to={`/livros/${livro.id}`} className="livro-card-link">
            <article className='livro-card'>
            <div className='livro-capa'>
                {livro.capa ?(
                    <img src={livro.capa} alt={livro.titulo}/>
            ):(
                    <span>Sem capa</span>
            )}
            </div>
            <div className='livro-informacoes'>
                <h3> {livro.titulo} </h3>

                <p> {livro.autor} </p>

                <span className={`livro-status ${
                    livro.disponibilidade === 'Disponível'
                    ? 'disponivel'
                    : 'emprestado'
                }`}>
                    {livro.disponibilidade}
                </span>
            </div>
            </article>
    </Link>
    )
}
export default LivroCard