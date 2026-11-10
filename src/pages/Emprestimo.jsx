import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useBiblioteca } from '../context/BibliotecaContext'
import '../styles/emprestimo.css'

function Emprestimo() {

    const { id } = useParams()
    const navegar = useNavigate()

    const { livros, setLivros, pessoas, registros, setRegistros } =
        useBiblioteca()

    const livro = livros.find(item => item.id === Number(id))

    const quantidadeTotal = Number(livro?.quantidade ?? 1)

    const emprestimosAtivos = registros.filter(registro =>
        registro.livroId === livro?.id &&
        registro.status !== 'Devolvido'
    ).length

    

    const quantidadeDisponivel = quantidadeTotal - emprestimosAtivos

    const [pesquisa, setPesquisa] = useState('')
    const [pessoaSelecionada, setPessoaSelecionada] = useState(null)
    const [dataDevolucao, setDataDevolucao] = useState('')
    const [erro, setErro] = useState('')

    const hoje = new Date()

    function formatarData(data) {
        const ano = data.getFullYear()
        const mes = String(data.getMonth() + 1).padStart(2, '0')
        const dia = String(data.getDate()).padStart(2, '0')

        return `${ano}-${mes}-${dia}`
    }
    function formatarDataBrasileira(data) {
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}

    const dataHoje = formatarData(hoje)

    const limite = new Date(hoje)
    limite.setMonth(limite.getMonth() + 2)

    const dataLimite = formatarData(limite)

    const pessoasFiltradas = pessoas.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    (pessoa.matricula || '').toLowerCase().includes(pesquisa.toLowerCase()))

    function calcularIdade(dataNascimento, dataReferencia) {
    if (!dataNascimento) return null

    const nascimento = new Date(`${dataNascimento}T12:00:00`)
    const referencia = new Date(`${dataReferencia}T12:00:00`)

    if (
        Number.isNaN(nascimento.getTime()) ||
        Number.isNaN(referencia.getTime())
    ) {
        return null
    }

    let idade = referencia.getFullYear() - nascimento.getFullYear()

    const aindaNaoFezAniversario =
        referencia.getMonth() < nascimento.getMonth() ||
        (
            referencia.getMonth() === nascimento.getMonth() &&
            referencia.getDate() < nascimento.getDate()
        )

    if (aindaNaoFezAniversario) {
        idade--
    }

    return idade >= 0 ? idade : null
}

    function escolherData(valor) {
        setDataDevolucao(valor)
        setErro('')

        if (!valor) return

        const data = new Date(`${valor}T12:00:00`)
        const diaSemana = data.getDay()

        if (diaSemana === 0 || diaSemana === 6) {
            setErro('Escolha um dia útil. Sábados e domingos não são permitidos.')
            return
        }

        const feriados = []

        if (feriados.includes(valor)) {
            setErro('Essa data é feriado. Escolha outro dia útil.')
        }
    }

    function confirmarEmprestimo() {
        if (!pessoaSelecionada) {
            setErro('Selecione uma pessoa para continuar.')
            return
        }

        if (!dataDevolucao) {
        setErro('Escolha uma data para devolução.')
        return
    }

    const dataEscolhida = new Date(`${dataDevolucao}T12:00:00`)
    const diaSemana = dataEscolhida.getDay()

    if (
        dataDevolucao < dataHoje ||
        dataDevolucao > dataLimite ||
        diaSemana === 0 ||
        diaSemana === 6
    ) {
        setErro('Escolha uma data útil dentro do limite de dois meses.')
        return
    }

    if (quantidadeDisponivel <= 0) {
        setErro('Não existem exemplares disponíveis deste livro.')
        return
    }

        const novoRegistro = {
    id: Date.now(),

    // Identificação original
    livroId: livro.id,
    pessoaId: pessoaSelecionada.id,

    // Dados históricos do livro
    livroTitulo: livro.titulo,
    livroAutor: livro.autor,
    categoriasLivro: Array.isArray(livro.categorias)
        ? [...livro.categorias]
        : livro.categoria
            ? [livro.categoria]
            : [],

    // Dados históricos da pessoa
    pessoaNome: pessoaSelecionada.nome,
    pessoaMatricula: pessoaSelecionada.matricula || '',
    pessoaTipo: pessoaSelecionada.tipo || 'Não informado',
    turmaPessoa: pessoaSelecionada.turma || 'Não informada',
    generoPessoa: pessoaSelecionada.genero || 'Não informado',
    idadePessoa: calcularIdade(
        pessoaSelecionada.dataNascimento,
        dataHoje
    ),

    // Datas e situação do empréstimo
    dataEmprestimo: dataHoje,
    dataPrevistaDevolucao: dataDevolucao,
    dataDevolucaoReal: null,
    status: 'Em andamento'
}

        setRegistros(registrosAtuais => [
            ...registrosAtuais,
            novoRegistro
        ])

        const novaQuantidadeDisponivel = quantidadeDisponivel - 1

        setLivros(livrosAtuais =>
            livrosAtuais.map(item =>
                item.id === livro.id
                    ? {
                        ...item,
                        disponibilidade: novaQuantidadeDisponivel > 0
                            ? 'Disponível'
                            : 'Emprestado'
                    }
                    : item
            )
        )

        navegar('/registros')
    }

    if (!livro) {
        return <main className="pagina-geral"><h1>Livro não encontrado</h1></main>
    }

    return (
        <main className="pagina-geral emprestimo-pagina">

            <button
                className="emprestimo-voltar"
                onClick={() => navegar(`/livros/${livro.id}`)}
            >
                ← Voltar ao livro
            </button>

            <h1>Realizar empréstimo</h1>
            <p>Selecione a pessoa e defina a data de devolução.</p>

            <section className="emprestimo-livro">
                <strong>Livro selecionado:</strong>
                <span>{livro.titulo}</span>
                <small>Por {livro.autor}</small>
            </section>

            <section className="emprestimo-etapa">
                <h2>1. Selecionar pessoa</h2>

                <input
                    type="text"
                    placeholder="Pesquisar por nome ou matrícula..."
                    value={pesquisa}
                    onChange={evento => setPesquisa(evento.target.value)}
                />

                <div className="emprestimo-pessoas">
                    {pessoasFiltradas.map(pessoa => (
                        <button
                            type="button"
                            key={pessoa.id}
                            className={
                                pessoaSelecionada?.id === pessoa.id
                                    ? 'emprestimo-pessoa selecionada'
                                    : 'emprestimo-pessoa'
                            }
                            onClick={() => {
                                setPessoaSelecionada(pessoa)
                                setErro('')
                            }}
                        >
                            <strong>{pessoa.nome}</strong>
                            <span>Matrícula: {pessoa.matricula}</span>
                            <span>{pessoa.turma}</span>
                        </button>
                    ))}

                    {pessoasFiltradas.length === 0 && (
                        <p>Nenhuma pessoa encontrada.</p>
                    )}
                </div>
            </section>

            <section className="emprestimo-etapa">
                <h2>2. Definir devolução</h2>

                <div className="emprestimo-data-info">
                    <span>Data do empréstimo</span>
                    <strong>{hoje.toLocaleDateString('pt-BR')}</strong>
                </div>

                <label htmlFor="dataDevolucao">
                    Data prevista para devolução
                </label>

                <input
                    id="dataDevolucao"
                    type="date"
                    min={dataHoje}
                    max={dataLimite}
                    value={dataDevolucao}
                    onChange={evento => escolherData(evento.target.value)}
                />

                <small>
                    Escolha um dia de segunda a sexta, dentro dos próximos dois meses.
                </small>
            </section>

            {pessoaSelecionada && (
                <section className="emprestimo-confirmacao">
                    <h2>3. Conferir empréstimo</h2>
                    <p><strong>Livro:</strong> {livro.titulo}</p>
                    <p><strong>Pessoa:</strong> {pessoaSelecionada.nome}</p>
                    <p><strong>Devolução:</strong> {
                        dataDevolucao
                            ? new Date(`${dataDevolucao}T12:00:00`).toLocaleDateString('pt-BR')
                            : 'Não selecionada'
                    }</p>
                </section>
            )}

            {erro && <p className="emprestimo-erro">{erro}</p>}

            <button
                className="emprestimo-confirmar"
                onClick={confirmarEmprestimo}
                disabled={quantidadeDisponivel <= 0}
            >
                Confirmar empréstimo
            </button>
            <section className="emprestimo-livro">
                <strong>Exemplares disponíveis:</strong>
                <span>{Math.max(0, quantidadeDisponivel)} de {quantidadeTotal}</span>
            </section>    
        </main>
    )
}

export default Emprestimo