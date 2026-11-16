const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('perastroDesktop', {
    isDesktop: true,
    exportarBackup: (conteudo, nomeSugerido) =>
        ipcRenderer.invoke('backup:exportar', { conteudo, nomeSugerido }),
    importarBackup: () =>
        ipcRenderer.invoke('backup:importar')
})
