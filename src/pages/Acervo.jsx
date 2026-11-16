import { useState } from 'react'
import '../styles/acervo.css'
import { useBiblioteca } from '../context/BibliotecaContext'
import LivroCard from '../components/LivroCard'
function Acervo(){
    const { livros, registros, config } = useBiblioteca()
    const [pesquisa, setPesquisa] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
    
    const livrosMaisEmprestados = [...livros]
    .map(livro => ({
        ...livro,
        totalEmprestimos: registros.filter(
            registro => registro.livroId === livro.id
        ).length
    }))
    .sort((a, b) => b.totalEmprestimos - a.totalEmprestimos)
    .slice(0, 6)

const livrosFiltrados = livrosMaisEmprestados.filter(livro => {
    const termo = pesquisa.toLowerCase().trim()

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
        categoriaSelecionada === 'Todos' ||
        (livro.categorias || [livro.categoria])
            .includes(categoriaSelecionada)

    return correspondePesquisa && correspondeCategoria
})  
    
    const totalLivros = livros.length

    const livrosDisponiveis =livros.filter(
        (livro) => livro.disponibilidade === 'Disponível').length

        const livrosEmprestados = livros.filter(
            (livro) => livro.disponibilidade === 'Emprestado').length
    

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
                        {totalLivros}
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
                        {livrosDisponiveis}
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
                        {livrosEmprestados}
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
                    placeholder={
                        config.modoOrganizacao === 'cdd'
                            ? 'Pesquisar por título, autor ou CDD...'
                            : 'Pesquisar por título, autor, estante ou seção...'
                    }                    value={pesquisa} 
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