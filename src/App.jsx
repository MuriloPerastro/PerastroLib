import { Routes, Route } from 'react-router'

import { useBiblioteca } from './context/BibliotecaContext'

import LivroDetalhes from './pages/LivroDetalhes'
import ConfiguracaoInicial from './pages/ConfiguracaoInicial'
import Configuracoes from './pages/Configuracoes'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Acervo from './pages/Acervo'
import Livros from './pages/Livros'
import Pessoas from './pages/Pessoas'
import Registros from './pages/Registros'
import Emprestimo from './pages/Emprestimo'

function App() {
    const { config } = useBiblioteca()

    // Exige nome e modo de organização na configuração inicial.
    if (
        !config?.nomeEscola?.trim() ||
        !config?.modoOrganizacao
    ) {
        return <ConfiguracaoInicial />
    }

    return (
        <div className="app-shell">
            <Navbar />

            <div className="app-conteudo">
                <Routes>
                    <Route path="/" element={<Acervo />} />
                    <Route path="/livros" element={<Livros />} />
                    <Route path="/livros/:id/emprestimo" element={<Emprestimo />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="/pessoas" element={<Pessoas />} />
                    <Route path="/registros" element={<Registros />} />
                    <Route path="/livros/:id" element={<LivroDetalhes />} />
                </Routes>
            </div>

            <Footer />
        </div>
    )
}

export default App