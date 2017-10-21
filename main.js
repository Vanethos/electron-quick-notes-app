const electron = require('electron')
const  {Tray, Menu, webContents, globalShortcut, app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

// https://www.npmjs.com/package/electron-localshortcut
const electronLocalshortcut = require('electron-localshortcut');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let tasksWin;
let searchBarWin;
let aboutMeWin;
let tray;

const debug = false;

function createWindow () {
  // Create the browser window.
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  var marginTop = 100;
  var finalHeight = height - marginTop;
  tasksWin = new BrowserWindow({
    width: 300,
    height: finalHeight,
    frame: false,
    x: width - 300,
    y: marginTop,
    transparent: true
  })

  // and load the index.html of the app.
  tasksWin.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // since we start with NO elements on the list, we minimize the window
  tasksWin.minimize();

  // Open the DevTools.
  if (debug) {
    tasksWin.webContents.openDevTools()
  }

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

  electronLocalshortcut.register(searchBarWin, 'Esc', () => {
        searchBarWin.close();
  });

  // Open the DevTools.
  if (debug) {
    searchBarWin.webContents.openDevTools()
  }
}

function createAboutMeWin() {
  aboutMeWin = new BrowserWindow({
    width: 800,
    height: 600,
  })

  aboutMeWin.loadURL('https://vanethos.github.io/')

  aboutMeWin.on('close', () => {
    aboutMeWin = null;
  });
}

function setTrayIcon () {
  tray = new Tray('app/icons/icon.png');
  // for macOSX
  tray.setPressedImage('app/icons/iconHighlight.png');
  const trayMenuTemplate = [
    {
               label: 'Quick Notes',
               enabled: false
            },

            {
               label: 'New Task',
               accelerator: 'CommandOrControl+K',
               click: function () {
                 if (searchBarWin == null) {
                   // if we don't have one, create a bar
                   createSearchWindow();
                 }
               }
            },

            {
               label: 'About Me',
               click: function () {
                 if (aboutMeWin == null) {
                   createAboutMeWin();
                 }
               }
            },

            {
               label: 'Close',
               click: function () {
                  app.quit();
               }
            }
  ]
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  tray.setContextMenu(contextMenu)
}

function registerGlobalCommands() {
  globalShortcut.register('CommandOrControl+K', () => {
    // check if we already have a window on the screen
    if (searchBarWin == null) {
      // if we don't have one, create a bar
      createSearchWindow();
    } else {
      // close the current one;
      searchBarWin.close();
      searchBarWin = null;
    }
  });
}



app.dock.hide();
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setTrayIcon();
  createWindow();
  registerGlobalCommands();
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
    if (tasksWin.isMinimized()) {
      tasksWin.restore();
    }
    console.log("And the task is...." + task);
    tasksWin.webContents.send("add-new-task-ui", task);
  }
})
