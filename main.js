/**
 * 婴幼儿健康跟踪系统 - 主入口文件
 * 百度OCR增强版 v11.0
 * 
 * 主要功能：
 * - 初始化应用程序
 * - 检查浏览器兼容性
 * - 设置全局错误处理
 * - 加载必要的依赖项
 */

// 全局配置
window.APP_CONFIG = {
    name: '婴幼儿健康跟踪系统',
    version: '11.0',
    codename: 'BaiduOCR-Enhanced',
    author: 'Baby Health Tracker Team',
    buildDate: '2025-05-27',
    
    // API配置
    apis: {
        baidu: {
            ocrEndpoint: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
            tokenEndpoint: 'https://aip.baidubce.com/oauth/2.0/token'
        },
        deepseek: {
            endpoint: 'https://api.deepseek.com/v1/chat/completions'
        }
    },
    
    // 功能开关
    features: {
        ocrEnabled: true,
        aiEnabled: true,
        exportEnabled: true,
        chartEnabled: true
    }
};

// 浏览器兼容性检查
function checkBrowserSupport() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        canvas: !!document.createElement('canvas').getContext,
        fileReader: typeof FileReader !== 'undefined',
        formData: typeof FormData !== 'undefined'
    };

    const unsupported = Object.keys(features).filter(key => !features[key]);
    
    if (unsupported.length > 0) {
        console.warn('⚠️ 浏览器不支持以下功能:', unsupported);
        showCompatibilityWarning(unsupported);
        return false;
    }
    
    console.log('✅ 浏览器兼容性检查通过');
    return true;
}

// 显示兼容性警告
function showCompatibilityWarning(unsupported) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    warningDiv.innerHTML = `
        <strong>⚠️ 浏览器兼容性警告</strong><br>
        您的浏览器不支持以下功能：${unsupported.join(', ')}<br>
        建议使用最新版的 Chrome、Firefox、Safari 或 Edge 浏览器
        <button onclick="this.parentElement.remove()" style="margin-left: 15px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">关闭</button>
    `;
    
    document.body.insertBefore(warningDiv, document.body.firstChild);
}

// 全局错误处理
function setupErrorHandling() {
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', function(event) {
        console.error('🚨 未处理的Promise拒绝:', event.reason);
        
        // 如果是API相关错误，显示用户友好的提示
        if (event.reason && typeof event.reason === 'string') {
            if (event.reason.includes('API') || event.reason.includes('网络')) {
                showErrorMessage('网络连接或API服务异常，请检查网络连接或稍后重试');
            }
        }
        
        // 防止浏览器默认的错误提示
        event.preventDefault();
    });

    // 捕获JavaScript错误
    window.addEventListener('error', function(event) {
        console.error('🚨 JavaScript错误:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });
}

// 显示错误消息
function showErrorMessage(message) {
    if (window.babyTracker && window.babyTracker.showMessage) {
        window.babyTracker.showMessage(message, 'error');
    } else {
        alert(message);
    }
}

// 检查必要的依赖项
function checkDependencies() {
    const dependencies = [
        { name: 'Chart.js', check: () => typeof Chart !== 'undefined' }
    ];

    const missing = dependencies.filter(dep => !dep.check());
    
    if (missing.length > 0) {
        console.warn('⚠️ 缺少依赖项:', missing.map(d => d.name));
        return false;
    }
    
    console.log('✅ 依赖项检查通过');
    return true;
}

// 性能监控
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`📊 页面加载时间: ${loadTime}ms`);
                
                if (loadTime > 3000) {
                    console.warn('⚠️ 页面加载较慢，建议优化');
                }
            }, 0);
        });
    }
}

// 初始化应用程序
function initializeApp() {
    console.log(`🎀 正在初始化 ${window.APP_CONFIG.name} v${window.APP_CONFIG.version}`);
    
    // 检查浏览器支持
    if (!checkBrowserSupport()) {
        return;
    }
    
    // 设置错误处理
    setupErrorHandling();
    
    // 性能监控
    setupPerformanceMonitoring();
    
    // 检查依赖项（延迟检查，因为可能还在加载）
    setTimeout(() => {
        checkDependencies();
    }, 100);
    
    console.log('✅ 应用程序初始化完成');
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// 导出配置供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.APP_CONFIG;
}
