import { Routes, Route } from 'react-router'
import LivroDetalhes from './pages/LivroDetalhes'
import Navbar from './components/Navbar'
import Acervo from './pages/Acervo'
import Livros from './pages/Livros'
import Pessoas from './pages/Pessoas'
import Registros from './pages/Registros'
import Emprestimo from './pages/Emprestimo'
import Footer from './components/Footer'
function App(){
    return(
        <div>
            <Navbar />

            <Routes>
                <Route path="/" element={<Acervo />} />
                <Route path="/livros" element={<Livros />} />
                <Route path="/livros/:id/emprestimo" element={<Emprestimo />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/registros" element={<Registros />} />
                <Route path="/livros/:id" element={<LivroDetalhes />} />    
            </Routes>
            <Footer />
        </div>
    )
}

export default App