// Backup e restauração do PerastroLib.
// Formato: { app, backupVersion, exportedAt, data: { ...seis conjuntos de dados } }

export const APP_ID = 'PerastroLib'
export const VERSAO_BACKUP = 1
export const TAMANHO_MAXIMO_BYTES = 50 * 1024 * 1024

export const CHAVES_ARMAZENAMENTO = {
    livros: 'perastrolib_livros',
    pessoas: 'perastrolib_pessoas',
    registros: 'perastrolib_registros',
    categorias: 'perastrolib_categorias',
    config: 'perastrolib_config',
    turmas: 'perastrolib_turmas'
}

const MODOS_VALIDOS = ['cdd', 'estante']

function ehObjeto(valor) {
    return valor !== null && typeof valor === 'object' && !Array.isArray(valor)
}

export function nomeArquivoBackup(data = new Date()) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')

    return `PerastroLib_Backup_${ano}-${mes}-${dia}.json`
}

export function criarBackup(dados) {
    return {
        app: APP_ID,
        backupVersion: VERSAO_BACKUP,
        exportedAt: new Date().toISOString(),
        data: {
            livros: dados.livros,
            pessoas: dados.pessoas,
            registros: dados.registros,
            categorias: dados.categorias,
            config: dados.config,
            turmas: dados.turmas
        }
    }
}

export function serializarBackup(dados) {
    return JSON.stringify(criarBackup(dados), null, 2)
}

function validarListaDeObjetos(lista, nome) {
    if (!Array.isArray(lista)) {
        return `O campo "${nome}" não é uma lista.`
    }

    const ids = new Set()

    for (const item of lista) {
        if (!ehObjeto(item) || item.id === undefined || item.id === null || item.id === '') {
            return `Há um item inválido em "${nome}" (sem identificador).`
        }

        if (ids.has(item.id)) {
            return `Há identificadores repetidos em "${nome}".`
        }

        ids.add(item.id)
    }

    return null
}

function validarListaDeTextos(lista, nome) {
    if (!Array.isArray(lista) || lista.some(item => typeof item !== 'string')) {
        return `O campo "${nome}" deve ser uma lista de textos.`
    }

    return null
}

// Recebe o texto do arquivo. Não altera nada: apenas valida.
// Retorna { ok: true, dados, resumo, exportedAt } ou { ok: false, erro }.
export function validarBackup(texto) {
    if (typeof texto !== 'string' || !texto.trim()) {
        return { ok: false, erro: 'O arquivo está vazio.' }
    }

    if (texto.length > TAMANHO_MAXIMO_BYTES) {
        return { ok: false, erro: 'O arquivo é grande demais para ser um backup do PerastroLib.' }
    }

    let backup

    try {
        backup = JSON.parse(texto)
    } catch {
        return { ok: false, erro: 'O arquivo não é um JSON válido ou está corrompido.' }
    }

    if (!ehObjeto(backup) || backup.app !== APP_ID) {
        return { ok: false, erro: 'Este arquivo não é um backup do PerastroLib.' }
    }

    if (!Number.isInteger(backup.backupVersion) || backup.backupVersion < 1) {
        return { ok: false, erro: 'A versão do backup é inválida.' }
    }

    if (backup.backupVersion > VERSAO_BACKUP) {
        return {
            ok: false,
            erro: 'Este backup foi criado por uma versão mais nova do PerastroLib. Atualize o aplicativo para importá-lo.'
        }
    }

    if (!ehObjeto(backup.data)) {
        return { ok: false, erro: 'O backup não contém o conjunto de dados.' }
    }

    const { livros, pessoas, registros, categorias, config, turmas } = backup.data

    const erro =
        validarListaDeObjetos(livros, 'livros') ||
        validarListaDeObjetos(pessoas, 'pessoas') ||
        validarListaDeObjetos(registros, 'registros') ||
        validarListaDeTextos(categorias, 'categorias') ||
        validarListaDeTextos(turmas, 'turmas')

    if (erro) {
        return { ok: false, erro }
    }

    if (
        !ehObjeto(config) ||
        typeof config.nomeEscola !== 'string' ||
        !config.nomeEscola.trim() ||
        !MODOS_VALIDOS.includes(config.modoOrganizacao)
    ) {
        return { ok: false, erro: 'As configurações da instituição no backup estão incompletas.' }
    }

    return {
        ok: true,
        exportedAt: typeof backup.exportedAt === 'string' ? backup.exportedAt : null,
        dados: { livros, pessoas, registros, categorias, config, turmas },
        resumo: {
            instituicao: config.nomeEscola.trim(),
            livros: livros.length,
            pessoas: pessoas.length,
            registros: registros.length
        }
    }
}

// Grava os dados no localStorage. Se qualquer gravação falhar,
// devolve todas as chaves ao valor anterior e relança o erro.
export function restaurarNoArmazenamento(dados, armazenamento = localStorage) {
    const anteriores = {}

    for (const chave of Object.values(CHAVES_ARMAZENAMENTO)) {
        anteriores[chave] = armazenamento.getItem(chave)
    }

    try {
        for (const [campo, chave] of Object.entries(CHAVES_ARMAZENAMENTO)) {
            armazenamento.setItem(chave, JSON.stringify(dados[campo]))
        }
    } catch (erro) {
        for (const [chave, valor] of Object.entries(anteriores)) {
            try {
                if (valor === null) armazenamento.removeItem(chave)
                else armazenamento.setItem(chave, valor)
            } catch (erroReversao) {
                console.error('Falha ao reverter', chave, erroReversao)
            }
        }

        throw erro
    }
}

// Exporta: usa o diálogo nativo no Electron e download no navegador.
export async function exportarArquivo(texto, nomeArquivo) {
    if (window.perastroDesktop?.exportarBackup) {
        return window.perastroDesktop.exportarBackup(texto, nomeArquivo)
    }

    const blob = new Blob([texto], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    return { ok: true }
}
