const { app, BrowserWindow } = require('electron')
const path = require('path')
const getAllPosts = require('./posts')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile(path.join(__dirname, '..', 'public', 'index.html'))
}

app.whenReady().then(async () => {
  await getAllPosts()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})