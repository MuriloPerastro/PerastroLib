import '../styles/footer.css'

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-desenvolvedor">

                <img
                    src="/assets/muriloperastro.png"
                    alt="Murilo Perastro"
                />

                <div className="footer-creditos">
                    <strong>Murilo Perastro</strong>

                    <span>
                        Desenvolvedor do PerastroLib
                    </span>
                </div>

            </div>

            <p className="footer-mensagem">
                Desenvolvido por Murilo Perastro para o
                <strong> Colégio Estadual Edivaldo Machado Boaventura.</strong>
            </p>

            <div className="footer-redes">

                <a
                    href="https://github.com/MuriloPerastro"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub de Murilo Perastro"
                >
                    GitHub
                </a>

                <a
                    href="https://www.instagram.com/muriloperastro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Murilo Perastro"
                >
                    Instagram
                </a>

                <a
                    href="https://www.linkedin.com/in/muriloperastro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn de Murilo Perastro"
                >
                    LinkedIn
                </a>

            </div>

        </footer>
    )
}

export default Footer