// 注意,这里的Menu和main.js中是同一个对象 !!!!!!!!!!
const {
    Menu,
    dialog,
    BrowserWindow,
    shell,
    ipcMain
} = require('electron');
const path = require('path');
const url = require('url');
// 子窗口
let about = null;
const template = [{},
    {
        label: 'Show',
        submenu: [{
                label: 'Basic',
                type: 'radio', //单选
                checked: true, //选中
                click: () => {
                    const win = BrowserWindow.fromId(1); //browserwindow不唯一
                    win.setSize(70 * 4 * 1.5, 500);
                    win.webContents.send('changeTo', 'basic'); //ipcMain没有send方法???
                },
                accelerator: 'CommandOrControl+B' // 快捷键
            },
            {
                label: 'Advanced',
                type: 'radio',
                checked: false,
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    win.setSize(70 * 8, 500);
                    win.webContents.send('changeTo', 'advanced');
                },
                accelerator: 'CommandOrControl+A'
            },
            {
                type: 'separator'
            },
            {
                // 只会刷新渲染进程
                label: 'Reload',
                role: 'reload'
            },
            {
                label: 'Force Quit',
                role: 'quit',
                accelerator: 'CmdOrCtrl+Q'
            },
            {
                label: 'Exit',
                accelerator: 'Esc',
                click: () => {
                    // 主进程(守候进程?)结束前会先掐掉渲染
                    process.exit(0)
                }
            },
            {
                type: 'separator'
            },
            {
                // 开发者视图三步走(～￣▽￣)～
                // 进入高级模式--全屏--打开开发者工具
                label: 'Dev View',
                accelerator: 'CmdOrCtrl+D',
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    win.webContents.send('changeTo', 'advanced');
                    win.setFullScreen(true)
                    win.toggleDevTools()
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [{
                label: 'Feedback',
                click: () => {
                    shell.openExternal('https://github.com/lin-xin/calculator/issues');
                }
            },
            {
                label: 'Repository',
                click: () => {
                    shell.openExternal('https://github.com/lin-xin/calculator');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'About Me',
                click: () => {
                    shell.openExternal('http://www.openidea.xin');
                }
            },
            {
                label: 'About This',
                accelerator: 'Space',
                click: () => {
                    if (about) {
                        about.close();
                        about = null;
                    } else {
                        const win = BrowserWindow.fromId(1);
                        about = new BrowserWindow({
                            parent: win,
                            modal: true,
                            width: 500,
                            height: 300,
                            minimizable: false,
                            maximizable: false,
                            resizable: false,
                            title: 'About This'
                        })
                        about.loadURL(url.format({
                            pathname: path.join(__dirname, './renderer/about.html'),
                            protocol: 'file',
                            slashes: true
                        }));
                        // about.webContents.openDevTools();
                        about.setMenu(null);
                        about.once('ready-to-show', () => {
                            about.show();
                        })
                    }
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [{
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);