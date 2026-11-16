
const { app, BrowserWindow } = require('electron')
const path = require('path')

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

    if (app.isPackaged) {
    janela.loadFile(path.join(__dirname, '../dist/index.html'))
    } else {
    janela.loadURL('http://localhost:5173')
    }
}

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
