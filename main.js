const electron = require('electron')
const  {Tray, webContents, globalShortcut, app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let tasksWin;
let searchBarWin;
let tray = null;

function createWindow () {
  // Create the browser window.
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  tasksWin = new BrowserWindow({
    width: 300,
    height: height,
    frame: false,
    x: width - 300,
    y: 0,
    transparent: true
  })

  // and load the index.html of the app.
  tasksWin.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //tasksWin.webContents.openDevTools()

  // Emitted when the window is closed.
  tasksWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    tasksWin = null
  })

  //set the window to be always on top
  tasksWin.setAlwaysOnTop(true, "pop-up-menu");

}

function createSearchWindow () {
  // Create the browser window.
  searchBarWin = new BrowserWindow({
    width: 800,
    height: 200,
    frame: false,
    transparent: true
  })

  // and load the index.html of the app.
  searchBarWin.loadURL(url.format({
    pathname: path.join(__dirname, '/app/search.html'),
    protocol: 'file:',
    slashes: true
  }))

  searchBarWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    searchBarWin = null
  })

  // Open the DevTools.
  //searchBarWin.webContents.openDevTools()
}

function setTrayIcon () {
  tray = new Tray('app/icons/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Close', type: 'normal'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  tray.on('click' () => {
    contextMenu.show();
  });
}



app.dock.hide();
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setTrayIcon();
  createWindow();
  globalShortcut.register('CommandOrControl+K', () => {
    console.log('CommandOrControl+K is pressed');
    createSearchWindow();
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (tasksWin === null) {
    createWindow()
  }
})


//the response to the add new task
ipcMain.on("add-new-task-main", (event, task) => {
  //var window = require('electron').remote.getCurrentWindow();
  //window.close();
  if (tasksWin !== null) {
    console.log("And the task is...." + task);
    tasksWin.webContents.send("add-new-task-ui", task);
  }
})
