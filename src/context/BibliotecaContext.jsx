
import { createContext, useContext, useState, useEffect } from 'react'
import livrosIniciais from '../data/livros'
import pessoasIniciais from '../data/pessoas'
import registrosIniciais from '../data/registros'
import { restaurarNoArmazenamento } from '../utils/backup'

const BibliotecaContext = createContext(null)

const turmasIniciais = [
    '1A Regular',
    '1B Regular',
    '1A Tecnico',
    '1B Tecnico',
    '1 EJA',
    '1 Tempo Juvenil',
    '2A Regular',
    '2B Regular',
    '2A Tecnico',
    '2B Tecnico',
    '2 EJA',
    '2 Tempo Juvenil',
    '3A Regular',
    '3B Regular',
    '3A Tecnico',
    '3B Tecnico',
    '3 EJA'
]

// Remove itens vazios ({}) que versões anteriores gravavam como dado inicial.
function removerItensVazios(lista) {
    if (!Array.isArray(lista)) return lista

    return lista.filter(item =>
        item &&
        typeof item === 'object' &&
        Object.keys(item).length > 0
    )
}

function carregarDados(chave, dadosIniciais, limparVazios = false) {
    try {
        const dadosSalvos = localStorage.getItem(chave)

        if (!dadosSalvos) return dadosIniciais

        const dados = JSON.parse(dadosSalvos)

        return limparVazios ? removerItensVazios(dados) : dados
    } catch (erro) {
        console.error(`Erro ao carregar ${chave}:`, erro)
        return dadosIniciais
    }
}

export function BibliotecaProvider({ children }) {
    const [livros, setLivros] = useState(
        () => carregarDados('perastrolib_livros', livrosIniciais, true)
    )

    const [pessoas, setPessoas] = useState(
        () => carregarDados('perastrolib_pessoas', pessoasIniciais, true)
    )

    const [registros, setRegistros] = useState(
        () => carregarDados('perastrolib_registros', registrosIniciais, true)
    )

    const [categorias, setCategorias] = useState(
        () => carregarDados('perastrolib_categorias', [
            'Infantojuvenil',
            'Fantasia',
            'Romance',
            'Aventura'
        ])
    )

    // Configurações da instituição
    const [config, setConfig] = useState(
    () => carregarDados('perastrolib_config', {
        nomeEscola: '',
        modoOrganizacao: ''
    })
)

    // Turmas cadastradas
    const [turmas, setTurmas] = useState(
        () => carregarDados('perastrolib_turmas', turmasIniciais)
    )

    // Salvar livros
    useEffect(() => {
        localStorage.setItem('perastrolib_livros', JSON.stringify(livros))
    }, [livros])

    // Salvar pessoas
    useEffect(() => {
        localStorage.setItem('perastrolib_pessoas', JSON.stringify(pessoas))
    }, [pessoas])

    // Salvar empréstimos
    useEffect(() => {
        localStorage.setItem('perastrolib_registros', JSON.stringify(registros))
    }, [registros])

    // Salvar categorias
    useEffect(() => {
        localStorage.setItem('perastrolib_categorias', JSON.stringify(categorias))
    }, [categorias])

    // Salvar configurações
    useEffect(() => {
        localStorage.setItem('perastrolib_config', JSON.stringify(config))
    }, [config])

    // Salvar turmas
    useEffect(() => {
        localStorage.setItem('perastrolib_turmas', JSON.stringify(turmas))
    }, [turmas])

    // Restaura um backup já validado: grava no armazenamento com
    // reversão em caso de falha e só então atualiza o estado.
    function restaurarDados(dados) {
        restaurarNoArmazenamento(dados)

        setLivros(dados.livros)
        setPessoas(dados.pessoas)
        setRegistros(dados.registros)
        setCategorias(dados.categorias)
        setConfig(dados.config)
        setTurmas(dados.turmas)
    }

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
                setCategorias,
                config,
                setConfig,
                turmas,
                setTurmas,
                restaurarDados
            }}
        >
            {children}
        </BibliotecaContext.Provider>
    )
}

export function useBiblioteca() {
    return useContext(BibliotecaContext)
}
