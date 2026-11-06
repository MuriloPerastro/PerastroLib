
import { useState } from 'react'
import './App.css'

const livrosIniciais = [
  { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', cor: 'blue' },
  { titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J. K. Rowling', cor: 'purple' },
  { titulo: 'O Menino do Pijama Listrado', autor: 'John Boyne', cor: 'green' },
  { titulo: 'Diário de um Banana', autor: 'Jeff Kinney', cor: 'orange' },
  { titulo: 'A Bolsa Amarela', autor: 'Lygia Bojunga', cor: 'pink' },
  { titulo: 'Alice no País das Maravilhas', autor: 'Lewis Carroll', cor: 'cyan' },
  { titulo: 'O Hobbit', autor: 'J. R. R. Tolkien', cor: 'brown' },
  { titulo: 'Extraordinário', autor: 'R. J. Palacio', cor: 'indigo' },
]

function BookIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 13C18 8 10 8 5 10V36C12 34 19 35 24 40V13Z"
        fill="#2563eb" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 13C30 8 38 8 43 10V36C36 34 29 35 24 40V13Z"
        fill="#f8fafc" stroke="#bfdbfe" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 13V40" stroke="#2563eb" strokeWidth="2" />
    </svg>
  )
}

function SocialIcon({ tipo }) {
  if (tipo === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    )
  }

  if (tipo === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.2 9h3.6v12H3.2V9Zm5.8 0h3.4v1.6h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.25 2.35 4.25 5.4V21h-3.6v-6.08c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.56-2.3 3.2V21H9V9Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.92.1-.72.39-1.21.71-1.49-2.48-.28-5.08-1.24-5.08-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.04-1.15 3.04-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3.01 0 4.28-2.6 5.22-5.09 5.5.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  )
}

function App() {
  const [pagina, setPagina] = useState('Início')
  const [livros, setLivros] = useState(livrosIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')

  function adicionarLivro(event) {
    event.preventDefault()

    if (!titulo.trim() || !autor.trim()) return

    setLivros([
      ...livros,
      { titulo, autor, cor: 'blue' }
    ])

    setTitulo('')
    setAutor('')
    setModalAberto(false)
  }

  return (
    <div className="site">

      {/* NAVEGAÇÃO */}
      <header className="navbar">
        <a className="brand" href="#inicio" onClick={() => setPagina('Início')}>
          <span className="brand-icon"><BookIcon /></span>
          <span>PerastroLib</span>
        </a>

        <nav className="nav-menu">
          {['Início', 'Livros', 'Pessoas', 'Registros'].map((item) => (
            <button
              key={item}
              className={`nav-link ${pagina === item ? 'active' : ''}`}
              onClick={() => setPagina(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <button className="new-button" onClick={() => setModalAberto(true)}>
          <span>＋</span> Novo Cadastro
        </button>
      </header>

      {/* CONTEÚDO */}
      <main className="container" id="inicio">

        <section className="page-heading">
          <div>
            <h1>Acervo</h1>
            <p>{livros.length} títulos na biblioteca</p>
          </div>
        </section>

        <section className="collection" id="acervo">
          <div className="section-heading">
            <h2>Infantojuvenil</h2>
            <span>{livros.length} livros</span>
          </div>

          <div className="book-grid">
            {livros.map((livro, index) => (
              <article className="book-item" key={index}>
                <div className={`book-cover ${livro.cor}`}>
                  <span className="cover-decoration">✦</span>
                  <div className="cover-content">
                    <h3>{livro.titulo}</h3>
                    <p>{livro.autor}</p>
                  </div>
                  <span className="cover-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="book-info">
                  <h3>{livro.titulo}</h3>
                  <p>{livro.autor}</p>
                  <span className="availability">
                    <span></span> Disponível
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* RODAPÉ */}
      <footer className="footer">
        <p>
          Desenvolvido por <strong>SEU NOME</strong> · Projeto de Extensão
          <br />
          PerastroLib © 2026
        </p>

        <div className="social-links">
          <a href="https://instagram.com/SEU_USUARIO" target="_blank" rel="noreferrer" aria-label="Instagram">
            <SocialIcon tipo="instagram" />
          </a>
          <a href="https://linkedin.com/in/SEU_USUARIO" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <SocialIcon tipo="linkedin" />
          </a>
          <a href="https://github.com/SEU_USUARIO" target="_blank" rel="noreferrer" aria-label="GitHub">
            <SocialIcon tipo="github" />
          </a>
        </div>
      </footer>

      {/* MODAL DE CADASTRO */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <form className="modal" onSubmit={adicionarLivro} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setModalAberto(false)}>×</button>
            <h2>Novo livro</h2>
            <p>Adicione um título ao acervo da biblioteca.</p>

            <label>Título do livro</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Digite o título" required />

            <label>Autor</label>
            <input value={autor} onChange={(e) => setAutor(e.target.value)} placeholder="Digite o autor" required />

            <button className="new-button modal-submit" type="submit">
              Cadastrar livro
            </button>
          </form>
        </div>
      )}

    </div>
  )
}

export default App
