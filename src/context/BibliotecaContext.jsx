import { createContext, useContext, useState, useEffect } from 'react'
import livrosIniciais from '../data/livros'
import pessoasIniciais from '../data/pessoas'
import registrosIniciais from '../data/registros'

const BibliotecaContext = createContext(null)

function carregarDados(chave, dadosIniciais) {
    try {
        const dadosSalvos = localStorage.getItem(chave)

        return dadosSalvos
            ? JSON.parse(dadosSalvos)
            : dadosIniciais

    } catch (erro) {
        console.error(`Erro ao carregar ${chave}:`, erro)
        return dadosIniciais
    }
}

export function BibliotecaProvider({ children }) {

    const [livros, setLivros] = useState(
    () => carregarDados('perastrolib_livros', livrosIniciais)
)

const [pessoas, setPessoas] = useState(
    () => carregarDados('perastrolib_pessoas', pessoasIniciais)
)

const [registros, setRegistros] = useState(
    () => carregarDados('perastrolib_registros', registrosIniciais)
)

const [categorias, setCategorias] = useState(
    () => carregarDados('perastrolib_categorias', [
        'Infantojuvenil',
        'Fantasia',
        'Romance',
        'Aventura'
    ])
)
// Salvar livros
useEffect(() => {
    localStorage.setItem(
        'perastrolib_livros',
        JSON.stringify(livros)
    )
}, [livros])

// Salvar pessoas
useEffect(() => {
    localStorage.setItem(
        'perastrolib_pessoas',
        JSON.stringify(pessoas)
    )
}, [pessoas])

// Salvar empréstimos
useEffect(() => {
    localStorage.setItem(
        'perastrolib_registros',
        JSON.stringify(registros)
    )
}, [registros])

// Salvar categorias
useEffect(() => {
    localStorage.setItem(
        'perastrolib_categorias',
        JSON.stringify(categorias)
    )
}, [categorias])

    return (
        <BibliotecaContext.Provider
            value={{
                
                livros,
                setLivros,

                pessoas,
                setPessoas,

                registros,
                setRegistros,
                
                categorias,
                setCategorias
            }}
        >
            {children}
        </BibliotecaContext.Provider>
    )
}

export function useBiblioteca() {
    return useContext(BibliotecaContext)
}