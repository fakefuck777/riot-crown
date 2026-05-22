#!/bin/bash

# 🚀 Riot Crown - GitHub Secrets 配置脚本
# 这个脚本会帮助你配置 GitHub Secrets 以部署到 Shopify Oxygen

set -e

echo "=========================================="
echo "🚀 Riot Crown - GitHub Secrets 配置"
echo "=========================================="
echo ""

# 检查是否安装了 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装"
    echo "请访问 https://cli.github.com 安装 GitHub CLI"
    exit 1
fi

# 检查是否已登录 GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ 未登录 GitHub"
    echo "请运行: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI 已安装并已登录"
echo ""

# 获取仓库信息
REPO=$(gh repo view --json nameWithOwner -q)
echo "📦 仓库: $REPO"
echo ""

# 提示用户输入 Secrets
echo "请输入以下信息来配置 GitHub Secrets:"
echo ""

read -p "1. SHOPIFY_CLI_TOKEN (从 shopify auth login 获取): " SHOPIFY_CLI_TOKEN
read -p "2. SHOPIFY_SHOP (例如: dkgv9c-tv.myshopify.com): " SHOPIFY_SHOP
read -p "3. PUBLIC_STOREFRONT_ID (从 .env 获取): " PUBLIC_STOREFRONT_ID
read -p "4. PUBLIC_STORE_DOMAIN (例如: dkgv9c-tv.myshopify.com): " PUBLIC_STORE_DOMAIN
read -p "5. PUBLIC_STOREFRONT_API_TOKEN (从 .env 获取): " PUBLIC_STOREFRONT_API_TOKEN
read -p "6. SESSION_SECRET (从 .env 获取): " SESSION_SECRET

echo ""
echo "正在配置 GitHub Secrets..."
echo ""

# 设置 Secrets
gh secret set SHOPIFY_CLI_TOKEN --body "$SHOPIFY_CLI_TOKEN"
echo "✅ SHOPIFY_CLI_TOKEN 已设置"

gh secret set SHOPIFY_SHOP --body "$SHOPIFY_SHOP"
echo "✅ SHOPIFY_SHOP 已设置"

gh secret set PUBLIC_STOREFRONT_ID --body "$PUBLIC_STOREFRONT_ID"
echo "✅ PUBLIC_STOREFRONT_ID 已设置"

gh secret set PUBLIC_STORE_DOMAIN --body "$PUBLIC_STORE_DOMAIN"
echo "✅ PUBLIC_STORE_DOMAIN 已设置"

gh secret set PUBLIC_STOREFRONT_API_TOKEN --body "$PUBLIC_STOREFRONT_API_TOKEN"
echo "✅ PUBLIC_STOREFRONT_API_TOKEN 已设置"

gh secret set SESSION_SECRET --body "$SESSION_SECRET"
echo "✅ SESSION_SECRET 已设置"

echo ""
echo "=========================================="
echo "✅ 所有 Secrets 已配置完成！"
echo "=========================================="
echo ""
echo "下一步:"
echo "1. 推送新提交: git push origin main"
echo "2. GitHub Actions 会自动运行"
echo "3. 网站会自动部署到 Shopify Oxygen"
echo ""
