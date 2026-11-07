import '../styles/navbar.css'
function Navbar(){
    return (
        <header className="navbar">
            <a href="#inicio" className="navbar-logo">
                <span>PerastroLib</span>
            </a>
            <nav className="navbar-links">
                <a href="#inicio" className="active">Início</a>
                <a href="#Livros">Livros</a>
                <a href="#pessoas">Pessoas</a>
                <a href="#registros">Registros</a>
            </nav>
            <button className="navbar-button">
                + Novo Cadastro
            </button>

        </header>
    )
}

export default Navbar