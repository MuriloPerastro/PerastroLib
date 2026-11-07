import '../styles/navbar.css'

function Navbar(){
    return (
        <header className="navbar">
            <a href="#inicio" className="navbar-logo">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                </svg>
            </a>
            <nav className="navbar-links">
                <a href="#inicio" className="active">Início</a>
                <a href="#Livros">Livros</a>
                <a href="pessoas">Pessoas</a>
                <a href="registros">Registros</a>
            </nav>
            <button className="navbar-button">
                + Novo Cadastro
            </button>

        </header>
    )
}