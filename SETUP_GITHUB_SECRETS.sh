#!/bin/bash

# 🔐 GitHub Secrets 自动配置脚本
# 这个脚本会帮你在 GitHub 上配置所有必要的 secrets

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🔐 GitHub Secrets 配置助手                                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 检查 gh CLI 是否安装
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) 未安装"
    echo "请先安装: https://cli.github.com"
    exit 1
fi

echo "✓ GitHub CLI 已安装"
echo ""

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo "需要登录 GitHub..."
    gh auth login
fi

echo ""
echo "现在需要你提供以下信息："
echo ""

# 获取 Shopify CLI Token
read -p "请输入你的 Shopify CLI Token (shpat_...): " SHOPIFY_CLI_TOKEN

if [ -z "$SHOPIFY_CLI_TOKEN" ]; then
    echo "❌ Token 不能为空"
    exit 1
fi

echo ""
echo "正在配置 GitHub Secrets..."
echo ""

# 设置 secrets
gh secret set SHOPIFY_CLI_TOKEN --body "$SHOPIFY_CLI_TOKEN"
echo "✓ SHOPIFY_CLI_TOKEN 已设置"

gh secret set SHOPIFY_SHOP --body "dkgv9c-tv.myshopify.com"
echo "✓ SHOPIFY_SHOP 已设置"

gh secret set PUBLIC_STOREFRONT_API_TOKEN --body "2b101a6cd010cbe957d55d0139c0ac5e"
echo "✓ PUBLIC_STOREFRONT_API_TOKEN 已设置"

gh secret set PUBLIC_STORE_DOMAIN --body "dkgv9c-tv.myshopify.com"
echo "✓ PUBLIC_STORE_DOMAIN 已设置"

gh secret set SESSION_SECRET --body "riot-crown-dev-secret-void-2026"
echo "✓ SESSION_SECRET 已设置"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ 所有 Secrets 已配置完成！                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "现在运行以下命令来触发部署："
echo "  git push origin main"
echo ""
echo "然后检查部署状态："
echo "  https://github.com/fakefuck777/riot-crown/actions"
echo ""

