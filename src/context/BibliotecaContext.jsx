import { createContext, useContext, useState } from 'react'

import livrosIniciais from '../data/livros'
import pessoasIniciais from '../data/pessoas'
import registrosIniciais from '../data/registros'

const BibliotecaContext = createContext(null)

export function BibliotecaProvider({ children }) {

    const [livros, setLivros] = useState(livrosIniciais)
    const [pessoas, setPessoas] = useState(pessoasIniciais)
    const [registros, setRegistros] = useState(registrosIniciais)

    return (
        <BibliotecaContext.Provider
            value={{
                livros,
                setLivros,

                pessoas,
                setPessoas,

                registros,
                setRegistros
            }}
        >
            {children}
        </BibliotecaContext.Provider>
    )
}

export function useBiblioteca() {
    return useContext(BibliotecaContext)
}