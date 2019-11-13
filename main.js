// only add update server if it's not being run from cli
if (require.main !== module) {
  require('update-electron-app')({
    logger: require('electron-log')
  })
}

const path = require('path')
const glob = require('glob')
const {app, BrowserWindow, Menu} = require('electron')

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Al-quran APIs')

let mainWindow = null

function initialize () {
  makeSingleInstance()
  loadApp()

  function createWindow () {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 640,
    }
	
	
    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }
	
	
	Menu.setApplicationMenu(false)
	mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
	
    if (debug) {
      mainWindow.webContents.openDevTools()
      //mainWindow.maximize()
      //mainWindow.minimize()
	  require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function loadApp () {
  //const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  //files.forEach((file) => { require(file) })
}

initialize()
