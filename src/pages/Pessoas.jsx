import { useState } from 'react'
import '../styles/paginas.css'
import { useBiblioteca } from '../context/BibliotecaContext'

function Pessoas(){
    const { pessoas } = useBiblioteca()
    const [pesquisa, setPesquisa] = useState('')
    const [tipoSelecionado, setTipoSelecionado] = useState('Todos')

    const pessoasFiltradas = pessoas.filter((pessoa) => {
    const correspondePesquisa =
        pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (pessoa.matricula || '').toLowerCase().includes(pesquisa.toLowerCase())

    const correspondeTipo =
        tipoSelecionado === 'Todos' ||
        pessoa.tipo === tipoSelecionado

    return correspondePesquisa && correspondeTipo
})
    return(
        <main className="pagina-geral">
            <h1>Pessoas</h1>
            <p>Gerencie os alunos, professores e leitores da biblioteca.</p>
            
            <section className="pessoas-resumo">

                <div className="pessoa-resumo-card">
                    <span>Total de pessoas</span>
                    <strong>{pessoas.length}</strong>
                </div>

                <div className="pessoa-resumo-card">
                    <span>Alunos</span>
                    <strong>
                        {pessoas.filter(pessoa => pessoa.tipo === 'Aluno').length}
                    </strong>
                </div>

                <div className="pessoa-resumo-card">
                    <span>Professores</span>
                    <strong>
                        {pessoas.filter(pessoa => pessoa.tipo === 'Professor').length}
                    </strong>
                </div>

            </section>

            <section className='pessoas-filtros'>
                <input 
                type="text"
                placeholder='Pesquisar por nome ou matricula...'
                value={pesquisa}
                onChange={(evento)=> setPesquisa(evento.target.value)}
                />
                <div className='pessoas-tipos'>
                    <button className={tipoSelecionado=='Todos'?'active':''}onClick={()=> setTipoSelecionado('Todos')}>Todos</button>

                    <button
                        className={tipoSelecionado === 'Aluno' ? 'active' : ''}
                        onClick={() => setTipoSelecionado('Aluno')}>
                            Alunos
                    </button>

                    <button
                        className={tipoSelecionado === 'Outro' ? 'active' : ''}
                        onClick={() => setTipoSelecionado('Outro')}
                    >
                        Outros
                    </button>
                    
                    <button
                        className={tipoSelecionado === 'Professor' ? 'active' : ''}
                        onClick={() => setTipoSelecionado('Professor')}>
                            Professores
                    </button>
                </div>
            </section>

            <section className='pessoas-lista'>
                {pessoasFiltradas.length > 0 ? (
                    pessoasFiltradas.map((pessoa) => (
                    <article className='pessoa-card' key={pessoa.id}>
                    <div className='pessoa-avatar'>
                        {pessoa.nome.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className='pessoa-dados'>

                        <h3>{pessoa.nome}</h3>

                        <p>{pessoa.tipo}</p>

                        {pessoa.genero && (
                            <p>
                                Gênero: {pessoa.genero === 'Outro'
                                    ? pessoa.generoDescricao || 'Outro'
                                    : pessoa.genero}
                            </p>
                        )}

                        {pessoa.dataNascimento && (
                            <p>
                                Nascimento: {pessoa.dataNascimento.split('-').reverse().join('/')}
                            </p>
                        )}

                        {pessoa.matricula && (
                            <p>Matrícula: {pessoa.matricula}</p>
                        )}

                        {pessoa.turma && (
                            <p>Turma: {pessoa.turma}</p>
                        )}

                        {pessoa.email && (
                            <p>{pessoa.email}</p>
                        )}

                        {pessoa.telefone && (
                            <p>{pessoa.telefone}</p>
                        )}

                        {!pessoa.email && !pessoa.telefone && pessoa.contato && (
                            <p>{pessoa.contato}</p>
                        )}

                    </div>

                        <span className='Pessoa-tipo'>
                            {pessoa.tipo}
                        </span>
                    </article>
                        
                ))

            )   : ( 
            <p className="pessoas-vazio">
                Nenhuma pessoa encontrada.
            </p>
            )}

            </section>

        </main>
        
    )
}

export default Pessoas