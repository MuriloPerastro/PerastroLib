
import { useState } from 'react'
import { NavLink } from 'react-router'
import '../styles/footer.css'

function Footer() {
    const [sobreAberto, setSobreAberto] = useState(false)
    const anoAtual = new Date().getFullYear()

    return (
        <>
            <footer className="footer">
                <p className="footer-copyright">
                    © {anoAtual} PerastroLib | Desenvolvido por Murilo Perastro
                </p>

                <nav className="footer-links">
                    <NavLink to="/" end>Início</NavLink>
                    <NavLink to="/livros">Acervo</NavLink>
                    <NavLink to="/pessoas">Pessoas</NavLink>
                    <NavLink to="/registros">Empréstimos</NavLink>

                    <a
                        href="https://github.com/MuriloPerastro/PerastroLib"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Projeto
                    </a>

                    <button
                        type="button"
                        onClick={() => setSobreAberto(true)}
                    >
                        Sobre
                    </button>

                    <a href="mailto:muriloperastro@gmail.com">
                        Contato
                    </a>
                </nav>
            </footer>

            {sobreAberto && (
                <div
                    className="sobre-overlay"
                    onClick={() => setSobreAberto(false)}
                >
                    <section
                        className="sobre-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sobre-titulo"
                        onClick={(evento) => evento.stopPropagation()}
                    >
                        <button
                            className="sobre-fechar"
                            type="button"
                            onClick={() => setSobreAberto(false)}
                            aria-label="Fechar janela"
                        >
                            ×
                        </button>

                        <img
                            className="sobre-foto"
                            src={`${import.meta.env.BASE_URL}assets/muriloperastro.png`}
                            alt="Foto de Murilo Perastro"
                        />

                        <h2 id="sobre-titulo">Murilo Perastro</h2>
                        <span className="sobre-subtitulo">
                            Desenvolvedor do PerastroLib
                        </span>

                        <p className="sobre-descricao">
                            Desenvolvi o PerastroLib para facilitar o
                            gerenciamento de bibliotecas, organizar acervos
                            e tornar o controle de empréstimos mais simples
                            e eficiente.
                        </p>

                        <div className="sobre-redes">
                            <a
                                href="https://www.instagram.com/muriloperastro/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>

                            <a
                                href="https://www.linkedin.com/in/muriloperastro/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>

                            <a
                                href="https://github.com/MuriloPerastro"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub — outros projetos
                            </a>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default Footer
