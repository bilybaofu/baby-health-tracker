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
            // 关键修改：允许网络访问和跨域
            webSecurity: false,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            enableClipboardAccess: true,
            // 新增：允许所有权限
            permissions: ['camera', 'microphone', 'geolocation', 'notifications'],
            // 新增：禁用同源策略
            additionalArguments: [
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--allow-running-insecure-content',
                '--disable-same-origin-policy'
            ]
        },
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

    // 新增：网络请求拦截和修改
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        // 设置更真实的User-Agent
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        details.requestHeaders['Accept'] = '*/*';
        details.requestHeaders['Accept-Language'] = 'zh-CN,zh;q=0.9,en;q=0.8';
        details.requestHeaders['Cache-Control'] = 'no-cache';
        details.requestHeaders['Pragma'] = 'no-cache';
        
        callback({ requestHeaders: details.requestHeaders });
    });

    // 新增：允许所有跨域请求
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        const responseHeaders = details.responseHeaders || {};
        
        // 添加CORS头
        responseHeaders['Access-Control-Allow-Origin'] = ['*'];
        responseHeaders['Access-Control-Allow-Methods'] = ['GET, POST, PUT, DELETE, OPTIONS'];
        responseHeaders['Access-Control-Allow-Headers'] = ['Content-Type, Authorization, X-Requested-With'];
        responseHeaders['Access-Control-Allow-Credentials'] = ['true'];
        
        callback({ responseHeaders });
    });

    // 新增：网络错误处理
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.log('网络加载失败:', errorCode, errorDescription, validatedURL);
    });

    // 新增：控制台日志监听
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`控制台[${level}]: ${message}`);
    });

    // 新增：右键上下文菜单（包含粘贴功能）
    mainWindow.webContents.on('context-menu', (event, params) => {
        const contextMenu = Menu.buildFromTemplate([
            { role: 'cut', label: '剪切', enabled: params.isEditable },
            { role: 'copy', label: '复制', enabled: params.selectionText.length > 0 },
            { role: 'paste', label: '粘贴', enabled: params.isEditable },
            { type: 'separator' },
            { role: 'selectall', label: '全选' },
            { type: 'separator' },
            { role: 'reload', label: '重新加载' },
            { role: 'toggleDevTools', label: '开发者工具' }
        ]);
        
        contextMenu.popup(mainWindow);
    });

    // 新增：页面加载完成后的初始化
    mainWindow.webContents.once('dom-ready', () => {
        console.log('页面DOM加载完成');
        
        // 注入网络检测脚本
        mainWindow.webContents.executeJavaScript(`
            console.log('开始检测网络连接...');
            
            // 检测网络连通性
            function checkNetworkConnectivity() {
                fetch('https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js', {
                    method: 'HEAD',
                    mode: 'no-cors'
                }).then(() => {
                    console.log('CDN连接正常');
                }).catch(err => {
                    console.log('CDN连接失败:', err);
                });
            }
            
            checkNetworkConnectivity();
            
            // 5秒后再次检测OCR库
            setTimeout(() => {
                if (typeof Tesseract !== 'undefined') {
                    console.log('✅ OCR库加载成功');
                } else {
                    console.log('❌ OCR库仍未加载');
                }
            }, 5000);
        `);
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
                    label: '重新加载OCR',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            console.log('手动重新加载OCR...');
                            if (window.babyTracker) {
                                window.babyTracker.showMessage('🔄 正在重新加载OCR库...', 'info');
                            }
                            location.reload();
                        `);
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
        // 编辑菜单（包含复制粘贴）
        {
            label: '编辑',
            submenu: [
                { role: 'undo', label: '撤销' },
                { role: 'redo', label: '重做' },
                { type: 'separator' },
                { role: 'cut', label: '剪切' },
                { role: 'copy', label: '复制' },
                { role: 'paste', label: '粘贴' },
                { type: 'separator' },
                { role: 'selectall', label: '全选' }
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
            label: '网络',
            submenu: [
                {
                    label: '检测OCR连接',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            console.log('检测OCR库状态...');
                            if (typeof Tesseract !== 'undefined') {
                                alert('✅ OCR库已加载成功！');
                            } else {
                                alert('❌ OCR库未加载，尝试重新加载页面');
                            }
                        `);
                    }
                },
                {
                    label: '清除缓存',
                    click: () => {
                        mainWindow.webContents.session.clearCache().then(() => {
                            mainWindow.webContents.reload();
                        });
                    }
                }
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
                            detail: '版本: 1.0.2 - 网络优化版\n基于WHO 2006标准\n可爱卡通版\n\n© 2025',
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

// 新增：应用启动前的网络配置
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('allow-running-insecure-content');
app.commandLine.appendSwitch('disable-same-origin-policy');

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

// 新增：证书错误忽略（用于HTTPS请求）
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});
