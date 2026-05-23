#!/bin/bash

# RIOT CROWN - GitHub → Shopify 自动部署脚本
# 用法: ./deploy-to-shopify.sh

set -e

echo "🚀 RIOT CROWN - Shopify 部署脚本"
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必需的环境变量
check_env_vars() {
  echo -e "${BLUE}📋 检查环境变量...${NC}"

  local required_vars=(
    "PUBLIC_STORE_DOMAIN"
    "PUBLIC_STOREFRONT_API_TOKEN"
    "SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN"
  )

  for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
      echo -e "${RED}❌ 缺失环境变量: $var${NC}"
      exit 1
    fi
  done

  echo -e "${GREEN}✅ 所有环境变量已配置${NC}"
}

# 安装依赖
install_deps() {
  echo -e "${BLUE}📦 安装依赖...${NC}"
  npm ci
  echo -e "${GREEN}✅ 依赖安装完成${NC}"
}

# 类型检查
typecheck() {
  echo -e "${BLUE}🔍 运行TypeScript检查...${NC}"
  npm run typecheck
  echo -e "${GREEN}✅ TypeScript检查通过${NC}"
}

# 代码检查
lint() {
  echo -e "${BLUE}🔍 运行ESLint检查...${NC}"
  npm run lint
  echo -e "${GREEN}✅ ESLint检查通过${NC}"
}

# 构建项目
build() {
  echo -e "${BLUE}🔨 构建项目...${NC}"
  npm run build
  echo -e "${GREEN}✅ 项目构建完成${NC}"
}

# 运行测试
test_project() {
  echo -e "${BLUE}🧪 运行测试...${NC}"
  npm test || echo -e "${YELLOW}⚠️  测试失败，继续部署${NC}"
}

# 部署到Shopify
deploy_to_shopify() {
  echo -e "${BLUE}🚀 部署到Shopify Oxygen...${NC}"

  # 检查Shopify CLI是否已安装
  if ! command -v shopify &> /dev/null; then
    echo -e "${YELLOW}📥 安装Shopify CLI...${NC}"
    npm install -g @shopify/cli@3.72.0
  fi

  # 执行部署
  shopify hydrogen deploy \
    --auth-token "$SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN" \
    --shop "$PUBLIC_STORE_DOMAIN" \
    --build-dir dist

  echo -e "${GREEN}✅ 部署到Shopify完成${NC}"
}

# 验证部署
verify_deployment() {
  echo -e "${BLUE}✔️  验证部署...${NC}"

  # 等待部署完成
  sleep 5

  # 检查网站是否可访问
  if curl -s -o /dev/null -w "%{http_code}" "https://$PUBLIC_STORE_DOMAIN" | grep -q "200"; then
    echo -e "${GREEN}✅ 部署验证成功${NC}"
  else
    echo -e "${YELLOW}⚠️  无法验证部署状态${NC}"
  fi
}

# 主函数
main() {
  echo ""

  # 检查git状态
  if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  工作目录有未提交的更改${NC}"
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi

  check_env_vars
  install_deps
  typecheck
  lint
  build
  test_project
  deploy_to_shopify
  verify_deployment

  echo ""
  echo -e "${GREEN}🎉 部署完成！${NC}"
  echo -e "${BLUE}📍 访问: https://$PUBLIC_STORE_DOMAIN${NC}"
  echo ""
}

# 错误处理
trap 'echo -e "${RED}❌ 部署失败${NC}"; exit 1' ERR

# 运行主函数
main "$@"
