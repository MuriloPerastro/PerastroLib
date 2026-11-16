import { Component } from 'react'

// Evita tela branca: se uma página falhar, mostra uma mensagem
// e mantém os dados salvos intactos.
class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { erro: null }
    }

    static getDerivedStateFromError(erro) {
        return { erro }
    }

    componentDidCatch(erro, info) {
        console.error('Erro na interface do PerastroLib:', erro, info)
    }

    render() {
        if (!this.state.erro) return this.props.children

        return (
            <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
                <h1>Algo deu errado</h1>
                <p>
                    Ocorreu um erro ao exibir esta tela. Seus dados
                    não foram apagados.
                </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                >
                    Recarregar o PerastroLib
                </button>
            </main>
        )
    }
}

export default ErrorBoundary
