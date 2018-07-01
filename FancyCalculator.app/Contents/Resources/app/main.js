/*
 * @Author: JimJin 
 * @Date: 2018年 5月28日 星期一 16时27分54秒 CST
 * @version: 3.0.0
 * * * * * * * * * * * * * * */


// 苹果icns图标素材推荐网站:
// https://findicons.com/

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');
const path = require('path');
const url = require('url');


// *
global['version'] = app.getVersion();

app.on('ready', () => {
    // 必须写在'ready'的回调中 :-( 
    require('./menu.js'); //相当于静态引用,阻塞执行(￣▽￣)" ----> 目标js文件全部执行..
    let win = new BrowserWindow({
        width: 420,
        height: 500,
        // fullscreen: false,
        resizable: true
    });
    // win.webContents.openDevTools();
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'renderer', 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    win.on('closed', () => {
        win = null; // 释放
    })

});

app.on('window-all-closed', () => {
    app.quit();
    process.exit(0);
})


ipcMain.on('exit', () => {
    process.exit(0)
})


// 注意, dependencies必须在本地安装; dev-dependencies不需
