@echo off
REM RIOT CROWN Y2K 主题 - Shopify Hydrogen 快速部署脚本（Windows）
REM 使用方法：deploy.bat

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🚀 RIOT CROWN Y2K 主题 - Shopify Hydrogen 部署脚本           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM 检查 Node.js
echo [1/8] 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js 未安装
    echo 请访问 https://nodejs.org 安装 Node.js
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION%

REM 检查 npm
echo [2/8] 检查 npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm 未安装
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION%

REM 检查 Shopify CLI
echo [3/8] 检查 Shopify CLI...
shopify --version >nul 2>&1
if errorlevel 1 (
    echo ⚠ Shopify CLI 未安装，正在安装...
    call npm install -g @shopify/cli
    echo ✓ Shopify CLI 已安装
) else (
    for /f "tokens=*" %%i in ('shopify --version') do set SHOPIFY_VERSION=%%i
    echo ✓ Shopify CLI %SHOPIFY_VERSION%
)

REM 检查认证
echo [4/8] 检查 Shopify 认证...
shopify auth whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠ 未认证，正在登录...
    call shopify auth login
    echo ✓ 认证成功
) else (
    for /f "tokens=*" %%i in ('shopify auth whoami') do set SHOP_INFO=%%i
    echo ✓ 已认证：%SHOP_INFO%
)

REM 安装依赖
echo [5/8] 安装依赖...
call npm install
echo ✓ 依赖已安装

REM 类型检查
echo [6/8] 运行类型检查...
call npm run typecheck
echo ✓ 类型检查通过

REM 构建项目
echo [7/8] 构建项目...
call npm run build
echo ✓ 构建成功

REM 部署
echo [8/8] 部署到 Shopify Hydrogen...
echo.
echo 选择部署选项：
echo 1) 部署到预发布环境
echo 2) 提升到生产环境
echo 3) 查看所有版本
echo 4) 回滚到上一个版本
echo.
set /p choice="请选择 (1-4): "

if "%choice%"=="1" (
    echo 正在部署到预发布环境...
    call shopify hydrogen deploy
    echo ✓ 部署成功！
    echo.
    echo 预发布 URL 已生成，请在浏览器中打开验证功能。
) else if "%choice%"=="2" (
    echo 正在提升到生产环境...
    call shopify hydrogen promote
    echo ✓ 提升成功！
    echo.
    echo 你的网站现在已在生产环境中运行。
    echo 访问 https://riotcrown.shop 查看
) else if "%choice%"=="3" (
    echo 所有部署版本：
    call shopify hydrogen versions
) else if "%choice%"=="4" (
    echo 所有部署版本：
    call shopify hydrogen versions
    echo.
    set /p version_id="请输入要回滚的版本 ID: "
    echo 正在回滚到版本 %version_id%...
    call shopify hydrogen rollback %version_id%
    echo ✓ 回滚成功！
) else (
    echo ✗ 无效选择
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🎉 部署完成！                                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 下一步：
echo 1. 访问你的网站验证功能
echo 2. 检查浏览器控制台是否有错误
echo 3. 测试 3D 场景、邮箱弹窗等功能
echo 4. 配置营销工具（TikTok Pixel、Meta Pixel 等）
echo.
echo 需要帮助？查看 MANUAL_DEPLOYMENT_GUIDE.md
echo.
pause
