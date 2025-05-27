# 👶 婴幼儿健康跟踪系统

[![Version](https://img.shields.io/badge/version-v11.0-brightgreen.svg)](https://github.com/yourusername/baby-health-tracker)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![OCR](https://img.shields.io/badge/OCR-百度云-red.svg)](https://cloud.baidu.com/doc/OCR/)
[![AI](https://img.shields.io/badge/AI-Deepseek-purple.svg)](https://platform.deepseek.com/)

基于WHO 2006标准的智能婴幼儿生长发育分析工具 - **百度OCR增强版**

## 🌟 主要特性

### 🔍 智能识别
- **百度OCR API** - 高精度中英文体检报告识别
- **AI智能解析** - Deepseek API驱动的数据提取
- **可编辑结果** - 支持手动修正识别错误

### 📊 专业分析
- **WHO 2006标准** - 精确到0.1月龄的线性插值计算
- **实时百分位** - 身高、体重、头围百分位自动计算
- **生长曲线** - 交互式图表显示发育趋势

### 🍼 个性化指导
- **AI喂养建议** - 基于个体数据的营养指导
- **健康分析** - 自动识别发育异常并提供建议
- **趋势追踪** - 多次体检数据对比分析

### 💾 数据安全
- **本地存储** - 所有数据仅保存在浏览器本地
- **导入导出** - 支持数据备份和迁移
- **隐私保护** - 无服务器上传，保护隐私安全

## 🚀 快速开始

### 1. 直接使用（推荐）
访问在线版本：[https://yourusername.github.io/baby-health-tracker](https://yourusername.github.io/baby-health-tracker)

### 2. 本地部署
```bash
# 克隆项目
git clone https://github.com/yourusername/baby-health-tracker.git
cd baby-health-tracker

# 启动本地服务器（任选其一）
# 方法1：使用Python
python -m http.server 8000

# 方法2：使用Node.js
npx serve .

# 方法3：使用npm（如果已安装依赖）
npm start
