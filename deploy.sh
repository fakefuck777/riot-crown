#!/bin/bash

# RIOT CROWN Y2K 主题 - Shopify Hydrogen 快速部署脚本
# 使用方法：bash deploy.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 RIOT CROWN Y2K 主题 - Shopify Hydrogen 部署脚本           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${BLUE}[1/8]${NC} 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js 未安装${NC}"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

# 检查 npm
echo -e "${BLUE}[2/8]${NC} 检查 npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm 未安装${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"

# 检查 Shopify CLI
echo -e "${BLUE}[3/8]${NC} 检查 Shopify CLI..."
if ! command -v shopify &> /dev/null; then
    echo -e "${YELLOW}⚠ Shopify CLI 未安装，正在安装...${NC}"
    npm install -g @shopify/cli
    echo -e "${GREEN}✓ Shopify CLI 已安装${NC}"
else
    SHOPIFY_VERSION=$(shopify --version)
    echo -e "${GREEN}✓ Shopify CLI ${SHOPIFY_VERSION}${NC}"
fi

# 检查认证
echo -e "${BLUE}[4/8]${NC} 检查 Shopify 认证..."
if ! shopify auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠ 未认证，正在登录...${NC}"
    shopify auth login
    echo -e "${GREEN}✓ 认证成功${NC}"
else
    SHOP_INFO=$(shopify auth whoami)
    echo -e "${GREEN}✓ 已认证：${SHOP_INFO}${NC}"
fi

# 安装依赖
echo -e "${BLUE}[5/8]${NC} 安装依赖..."
npm install
echo -e "${GREEN}✓ 依赖已安装${NC}"

# 类型检查
echo -e "${BLUE}[6/8]${NC} 运行类型检查..."
npm run typecheck
echo -e "${GREEN}✓ 类型检查通过${NC}"

# 构建项目
echo -e "${BLUE}[7/8]${NC} 构建项目..."
npm run build
echo -e "${GREEN}✓ 构建成功${NC}"

# 部署
echo -e "${BLUE}[8/8]${NC} 部署到 Shopify Hydrogen..."
echo ""
echo -e "${YELLOW}选择部署选项：${NC}"
echo "1) 部署到预发布环境"
echo "2) 提升到生产环境"
echo "3) 查看所有版本"
echo "4) 回滚到上一个版本"
echo ""
read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo -e "${YELLOW}正在部署到预发布环境...${NC}"
        shopify hydrogen deploy
        echo -e "${GREEN}✓ 部署成功！${NC}"
        echo ""
        echo "预发布 URL 已生成，请在浏览器中打开验证功能。"
        ;;
    2)
        echo -e "${YELLOW}正在提升到生产环境...${NC}"
        shopify hydrogen promote
        echo -e "${GREEN}✓ 提升成功！${NC}"
        echo ""
        echo "你的网站现在已在生产环境中运行。"
        echo "访问 https://riotcrown.shop 查看"
        ;;
    3)
        echo -e "${YELLOW}所有部署版本：${NC}"
        shopify hydrogen versions
        ;;
    4)
        echo -e "${YELLOW}正在回滚到上一个版本...${NC}"
        shopify hydrogen versions
        read -p "请输入要回滚的版本 ID: " version_id
        shopify hydrogen rollback $version_id
        echo -e "${GREEN}✓ 回滚成功！${NC}"
        ;;
    *)
        echo -e "${RED}✗ 无效选择${NC}"
        exit 1
        ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🎉 部署完成！                                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "下一步："
echo "1. 访问你的网站验证功能"
echo "2. 检查浏览器控制台是否有错误"
echo "3. 测试 3D 场景、邮箱弹窗等功能"
echo "4. 配置营销工具（TikTok Pixel、Meta Pixel 等）"
echo ""
echo "需要帮助？查看 MANUAL_DEPLOYMENT_GUIDE.md"
