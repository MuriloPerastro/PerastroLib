import { useState } from 'react'
import { useBiblioteca } from '../context/BibliotecaContext'
import '../styles/configuracoes.css'

function Configuracoes() {
    const {
        config,
        setConfig,
        livros,
        setLivros,
        turmas,
        setTurmas,
        pessoas,
        setPessoas
    } = useBiblioteca()

    const [nomeEscola, setNomeEscola] = useState(
        config.nomeEscola || ''
    )

    const [novaTurma, setNovaTurma] = useState('')
    const [editando, setEditando] = useState(null)
    const [nomeEdicao, setNomeEdicao] = useState('')

    function salvarEscola(evento) {
        evento.preventDefault()

        const nome = nomeEscola.trim()

        if (!nome) return

        setConfig(atual => ({
            ...atual,
            nomeEscola: nome
        }))

        alert('Nome da instituição atualizado!')
    }

    function alterarModoOrganizacao(evento) {
        const novoModo = evento.target.value

        if (!novoModo || novoModo === config.modoOrganizacao) {
            return
        }

        const nomeModo = novoModo === 'cdd'
            ? 'CDD'
            : 'Estante e Seção'

        const confirmar = window.confirm(
            `Deseja realmente mudar a organização para ${nomeModo}?\n\n` +
            'Os dados de localização cadastrados no modo anterior ' +
            'serão apagados de todos os livros.\n\n' +
            'Essa operação não poderá ser desfeita.'
        )

        if (!confirmar) {
            return
        }

        // Remove os campos do modo anterior de todos os livros.
        setLivros(livrosAtuais =>
            livrosAtuais.map(livro => {
                const atualizado = { ...livro }

                if (novoModo === 'cdd') {
                    delete atualizado.estante
                    delete atualizado.secao
                } else {
                    delete atualizado.cdd
                }

                return atualizado
            })
        )

        setConfig(atual => ({
            ...atual,
            modoOrganizacao: novoModo
        }))

        alert(`Modo de organização alterado para ${nomeModo}!`)
    }

    function adicionarTurma(evento) {
        evento.preventDefault()

        const nome = novaTurma.trim()

        if (!nome) return

        if (turmas.some(turma =>
            turma.toLowerCase() === nome.toLowerCase()
        )) {
            alert('Essa turma já está cadastrada.')
            return
        }

        setTurmas(atual => [...atual, nome])
        setNovaTurma('')
    }

    function iniciarEdicao(turma) {
        setEditando(turma)
        setNomeEdicao(turma)
    }

    function salvarEdicao(turmaAntiga) {
        const nome = nomeEdicao.trim()

        if (!nome) {
            alert('Digite o nome da turma.')
            return
        }

        if (nome.toLowerCase() === 'n/d') {
            alert('N/D é uma opção reservada e não pode ser usada como nome de turma.')
            return
        }

        if (
            turmas.some(turma =>
                turma !== turmaAntiga &&
                turma.toLowerCase() === nome.toLowerCase()
            )
        ) {
            alert('Já existe uma turma com esse nome.')
            return
        }

        setTurmas(atual =>
            atual.map(turma =>
                turma === turmaAntiga ? nome : turma
            )
        )

        setPessoas(atual =>
            atual.map(pessoa =>
                pessoa.turma === turmaAntiga
                    ? { ...pessoa, turma: nome }
                    : pessoa
            )
        )

        setEditando(null)
        setNomeEdicao('')

        alert('Turma e cadastros atualizados com sucesso!')
    }

    function removerTurma(turma) {
        const pessoasVinculadas = pessoas.filter(
            pessoa => pessoa.turma === turma
        )

        if (pessoasVinculadas.length > 0) {
            alert(
                `Não é possível remover esta turma ainda.\n\n` +
                `${pessoasVinculadas.length} pessoa(s) ainda estão vinculadas a ela.\n\n` +
                'Altere a turma dessas pessoas para outra opção ou N/D antes de removê-la.'
            )
            return
        }

        const confirmar = window.confirm(
            `Deseja realmente remover a turma "${turma}"?`
        )

        if (!confirmar) return

        setTurmas(atual =>
            atual.filter(item => item !== turma)
        )

        alert('Turma removida com sucesso!')
    }

    return (
        <main className="configuracoes-page">

            <header className="configuracoes-header">
                <div>
                    <h1>Configurações</h1>
                    <p>Personalize sua biblioteca.</p>
                </div>
            </header>

            <section className="configuracoes-card">
                <h2>Instituição</h2>

                <form onSubmit={salvarEscola}>
                    <label htmlFor="nomeEscola">
                        Nome da escola ou biblioteca
                    </label>

                    <div className="configuracoes-form-linha">
                        <input
                            id="nomeEscola"
                            value={nomeEscola}
                            onChange={evento =>
                                setNomeEscola(evento.target.value)
                            }
                            placeholder="Nome da instituição"
                            required
                        />

                        <button type="submit">
                            Salvar nome
                        </button>
                    </div>
                </form>
            </section>

            <section className="configuracoes-card">
                <h2>Organização do acervo</h2>

                <p>
                    Escolha como os livros serão classificados
                    e localizados na biblioteca.
                </p>

                <label htmlFor="modoOrganizacao">
                    Modo de organização
                </label>

                <select
                    id="modoOrganizacao"
                    className="configuracoes-modo-select"
                    value={config.modoOrganizacao || ''}
                    onChange={alterarModoOrganizacao}
                >
                    <option value="cdd">
                        CDD — Classificação Decimal de Dewey
                    </option>

                    <option value="estante">
                        Estante e Seção
                    </option>
                </select>

                <small>
                    Ao trocar o modo, os campos de localização do modo
                    anterior serão apagados dos livros.
                </small>
            </section>

            <section className="configuracoes-card">
                <div className="configuracoes-titulo-turmas">
                    <div>
                        <h2>Gerenciar turmas</h2>
                        <p>
                            Adicione, renomeie ou remova as turmas
                            da instituição.
                        </p>
                    </div>

                    <span>{turmas.length} turmas</span>
                </div>

                <form
                    className="configuracoes-form-linha"
                    onSubmit={adicionarTurma}
                >
                    <input
                        value={novaTurma}
                        onChange={evento =>
                            setNovaTurma(evento.target.value)
                        }
                        placeholder="Ex.: 3º Ano Técnico"
                    />

                    <button type="submit">
                        Adicionar turma
                    </button>
                </form>

                <div className="configuracoes-lista">
                    {turmas.map(turma => (
                        <div
                            className="configuracoes-turma"
                            key={turma}
                        >
                            {editando === turma ? (
                                <>
                                    <input
                                        value={nomeEdicao}
                                        onChange={evento =>
                                            setNomeEdicao(evento.target.value)
                                        }
                                        autoFocus
                                    />

                                    <div className="configuracoes-acoes">
                                        <button
                                            type="button"
                                            onClick={() => salvarEdicao(turma)}
                                        >
                                            Salvar
                                        </button>

                                        <button
                                            type="button"
                                            className="botao-cancelar"
                                            onClick={() => setEditando(null)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>{turma}</span>

                                    <div className="configuracoes-acoes">
                                        <button
                                            type="button"
                                            className="botao-editar"
                                            onClick={() => iniciarEdicao(turma)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="botao-remover"
                                            onClick={() => removerTurma(turma)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {turmas.length === 0 && (
                        <p className="configuracoes-vazio">
                            Nenhuma turma cadastrada.
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Configuracoes