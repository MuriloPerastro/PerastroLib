import { useState } from 'react'
import { useBiblioteca } from '../context/BibliotecaContext'
import '../styles/configuracao.css'

function ConfiguracaoInicial() {
    const { config, setConfig } = useBiblioteca()

    const [nomeEscola, setNomeEscola] = useState(
        config?.nomeEscola || ''
    )

    const [modoOrganizacao, setModoOrganizacao] = useState(
        config?.modoOrganizacao || ''
    )

    function salvarConfiguracao(evento) {
        evento.preventDefault()

        const nome = nomeEscola.trim()

        if (!nome) {
            alert('Digite o nome da escola ou biblioteca.')
            return
        }

        if (!modoOrganizacao) {
            alert('Selecione como deseja organizar os livros.')
            return
        }

        setConfig(configAtual => ({
            ...configAtual,
            nomeEscola: nome,
            modoOrganizacao
        }))
    }

    return (
        <main className="config-inicial">
            <form
                className="config-inicial-card"
                onSubmit={salvarConfiguracao}
            >
                <div className="config-inicial-logo">
                    <h1>PerastroLib</h1>
                    <p>Gerenciamento de Biblioteca</p>
                </div>

                <div className="config-inicial-texto">
                    <h2>Bem-vindo ao PerastroLib!</h2>
                    <p>
                        Antes de começar, vamos configurar
                        sua biblioteca.
                    </p>
                </div>

                <label htmlFor="nomeEscola">
                    Nome da escola ou biblioteca
                </label>

                <input
                    id="nomeEscola"
                    type="text"
                    placeholder="Digite o nome da instituição"
                    value={nomeEscola}
                    onChange={evento =>
                        setNomeEscola(evento.target.value)
                    }
                    required
                    autoFocus
                />

                <label htmlFor="modoOrganizacao">
                    Como deseja organizar os livros?
                </label>

                <select
                    id="modoOrganizacao"
                    value={modoOrganizacao}
                    onChange={evento =>
                        setModoOrganizacao(evento.target.value)
                    }
                    required
                >
                    <option value="">
                        Selecione uma opção
                    </option>

                    <option value="cdd">
                        CDD — Classificação Decimal de Dewey
                    </option>

                    <option value="estante">
                        Estante e Seção
                    </option>
                </select>

                <button type="submit">
                    Começar a usar
                </button>

                <small>
                    Você poderá alterar essas informações depois.
                </small>
            </form>
        </main>
    )
}

export default ConfiguracaoInicial