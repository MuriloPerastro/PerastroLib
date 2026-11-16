const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs/promises')

const TAMANHO_MAXIMO_BACKUP = 50 * 1024 * 1024
const FILTRO_JSON = [{ name: 'Backup do PerastroLib (JSON)', extensions: ['json'] }]

function criarJanela() {
    const janela = new BrowserWindow({
        icon: path.join(__dirname, '../public/assets/perastrolib-icon.ico'),
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 650,
        title: 'PerastroLib',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    // Links externos abrem no navegador padrão, nunca em nova janela do app.
    janela.webContents.setWindowOpenHandler(({ url }) => {
        if (/^(https?:|mailto:)/i.test(url)) shell.openExternal(url)
        return { action: 'deny' }
    })

    // A janela principal nunca navega para fora do aplicativo.
    janela.webContents.on('will-navigate', (evento, url) => {
        if (!url.startsWith('file://') && !url.startsWith('http://localhost:5173')) {
            evento.preventDefault()
            if (/^(https?:|mailto:)/i.test(url)) shell.openExternal(url)
        }
    })

    if (app.isPackaged) {
        janela.loadFile(path.join(__dirname, '../dist/index.html'))
    } else {
        janela.loadURL('http://localhost:5173')
    }
}

// Salva o backup escolhendo o local em um diálogo nativo.
ipcMain.handle('backup:exportar', async (evento, { conteudo, nomeSugerido } = {}) => {
    try {
        if (typeof conteudo !== 'string' || !conteudo) {
            return { ok: false, erro: 'Não há dados para exportar.' }
        }

        const janela = BrowserWindow.fromWebContents(evento.sender)
        const nome = path.basename(String(nomeSugerido || 'PerastroLib_Backup.json'))

        const resultado = await dialog.showSaveDialog(janela, {
            title: 'Exportar backup do PerastroLib',
            defaultPath: path.join(app.getPath('documents'), nome),
            filters: FILTRO_JSON
        })

        if (resultado.canceled || !resultado.filePath) {
            return { ok: false, cancelado: true }
        }

        await fs.writeFile(resultado.filePath, conteudo, 'utf-8')

        return { ok: true, caminho: resultado.filePath }
    } catch (erro) {
        return { ok: false, erro: `Não foi possível salvar o arquivo: ${erro.message}` }
    }
})

// Apenas lê o arquivo escolhido; a validação e a restauração ficam no app.
ipcMain.handle('backup:importar', async evento => {
    try {
        const janela = BrowserWindow.fromWebContents(evento.sender)

        const resultado = await dialog.showOpenDialog(janela, {
            title: 'Importar backup do PerastroLib',
            properties: ['openFile'],
            filters: FILTRO_JSON
        })

        if (resultado.canceled || resultado.filePaths.length === 0) {
            return { ok: false, cancelado: true }
        }

        const caminho = resultado.filePaths[0]
        const info = await fs.stat(caminho)

        if (info.size > TAMANHO_MAXIMO_BACKUP) {
            return { ok: false, erro: 'O arquivo é grande demais para ser um backup do PerastroLib.' }
        }

        const conteudo = await fs.readFile(caminho, 'utf-8')

        return { ok: true, conteudo, nomeArquivo: path.basename(caminho) }
    } catch (erro) {
        return { ok: false, erro: `Não foi possível ler o arquivo: ${erro.message}` }
    }
})

app.whenReady().then(() => {
    criarJanela()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            criarJanela()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
