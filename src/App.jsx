import Navbar from './components/Navbar'
import Acervo from './pages/Acervo'
import Livros from './pages/Livros'
//import Registros from './pages/Registros'

import { Routes, Route } from 'react-router'

function App() {
    return (
        <div>
            <Navbar />

            <Routes>
                <Route path="/" element={<Acervo />} />
                <Route path="/livros" element={<Livros />} />
            
            </Routes>
        </div>
    )
}

export default App