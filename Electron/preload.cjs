
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('perastroDesktop', {
    isDesktop: true
})
