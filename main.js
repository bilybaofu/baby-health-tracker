const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: false,
            allowRunningInsecureContent: true
        },
        icon: path.join(__dirname, 'build/icon.png'),
        show: false,
        titleBarStyle: 'default',
        frame: true,
        transparent: false,
        resizable: true,
        maximizable: true,
        minimizable: true,
        closable: true
    });

    mainWindow.loadFile('baby.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.setTitle('🎀 婴幼儿体检报告智能识别系统 v1.0');

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '导出数据',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.babyTracker && window.babyTracker.exportData()');
                    }
                },
                {
                    label: '导入数据',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('window.babyTracker && window.babyTracker.importData()');
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '查看',
            submenu: [
                { role: 'reload', label: '重新加载' },
                { role: 'forceReload', label: '强制重新加载' },
                { role: 'toggleDevTools', label: '开发者工具' },
                { type: 'separator' },
                { role: 'resetZoom', label: '重置缩放' },
                { role: 'zoomIn', label: '放大' },
                { role: 'zoomOut', label: '缩小' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: '全屏切换' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于',
                            message: '婴幼儿体检报告智能识别系统',
                            detail: '版本: 1.0.0\n基于WHO 2006标准\n可爱卡通版\n\n© 2025',
                            buttons: ['确定']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow();
    createMenu();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
