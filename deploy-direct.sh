#!/bin/bash

# RIOT CROWN - 直接部署到 Shopify Oxygen
# 使用现有的 Shopify 配置和令牌

set -e

echo "🚀 RIOT CROWN - 部署到 Shopify Oxygen"
echo "======================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查环境变量
echo -e "${BLUE}📋 检查环境变量...${NC}"

if [ -z "$PUBLIC_STORE_DOMAIN" ]; then
  echo -e "${RED}❌ 缺失 PUBLIC_STORE_DOMAIN${NC}"
  exit 1
fi

if [ -z "$PUBLIC_STOREFRONT_API_TOKEN" ]; then
  echo -e "${RED}❌ 缺失 PUBLIC_STOREFRONT_API_TOKEN${NC}"
  exit 1
fi

echo -e "${GREEN}✅ 环境变量已配置${NC}"
echo "   Store: $PUBLIC_STORE_DOMAIN"

# 检查构建目录
echo -e "${BLUE}📦 检查构建目录...${NC}"
if [ ! -d "dist" ]; then
  echo -e "${YELLOW}⚠️  dist 目录不存在，正在构建...${NC}"
  npm run build
fi
echo -e "${GREEN}✅ 构建目录已准备${NC}"

# 部署到 Shopify
echo -e "${BLUE}🚀 部署到 Shopify Oxygen...${NC}"

# 使用 Shopify CLI 部署
npx shopify hydrogen deploy \
  --shop "$PUBLIC_STORE_DOMAIN" \
  --force \
  --metadata-description "RIOT CROWN - 3D Effects & Design Upgrade" \
  2>&1

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${BLUE}📍 访问: https://$PUBLIC_STORE_DOMAIN${NC}"
echo ""
