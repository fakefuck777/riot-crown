# GitHub → Shopify 自动部署配置指南

## 概述
本指南说明如何配置GitHub Actions自动部署到Shopify Oxygen。

## 前置条件
1. GitHub仓库已连接到Shopify
2. Shopify Hydrogen项目已创建
3. 必要的GitHub Secrets已配置

## 必需的GitHub Secrets

在GitHub仓库设置中添加以下Secrets：

### 1. Shopify相关
- `PUBLIC_STORE_DOMAIN`: 你的Shopify店铺域名 (例: mystore.myshopify.com)
- `PUBLIC_STOREFRONT_API_TOKEN`: Shopify Storefront API令牌
- `PUBLIC_HOME_COLLECTION_HANDLE`: 首页集合句柄
- `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN`: Hydrogen部署令牌

### 2. 通知相关（可选）
- `SLACK_WEBHOOK_URL`: Slack Webhook URL（用于部署通知）

## 获取Shopify Hydrogen部署令牌

```bash
# 1. 登录Shopify CLI
shopify auth login

# 2. 获取部署令牌
shopify hydrogen list

# 3. 创建新的部署令牌
shopify hydrogen deploy --help
```

## 配置步骤

### 步骤1: 添加GitHub Secrets

1. 进入GitHub仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下Secrets:

```
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
PUBLIC_HOME_COLLECTION_HANDLE=home
SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN=your_deployment_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 步骤2: 验证工作流

1. 进入GitHub仓库 → Actions
2. 查看 "Auto Deploy to Shopify" 工作流
3. 确保工作流已启用

### 步骤3: 测试部署

```bash
# 推送到main分支触发自动部署
git push origin main

# 或手动触发工作流
# 进入Actions → Auto Deploy to Shopify → Run workflow
```

## 工作流说明

### 自动触发条件
- 推送到 `main` 分支
- 手动触发（通过Actions页面）

### 工作流步骤

1. **检出代码** - 获取最新代码
2. **设置Node.js** - 安装Node.js 20
3. **安装依赖** - npm ci
4. **TypeScript检查** - npm run typecheck
5. **ESLint检查** - npm run lint
6. **构建项目** - npm run build
7. **运行测试** - npm test
8. **部署到Shopify** - shopify hydrogen deploy
9. **创建部署状态** - 记录部署状态
10. **Slack通知** - 发送部署结果通知

## 部署状态检查

### 查看部署日志

1. GitHub仓库 → Actions
2. 点击最新的工作流运行
3. 查看各步骤的日志

### 常见问题

#### 部署失败：认证错误
- 检查 `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN` 是否正确
- 确保令牌未过期

#### 部署失败：构建错误
- 检查本地构建是否成功：`npm run build`
- 查看GitHub Actions日志中的错误信息

#### 部署失败：环境变量缺失
- 确保所有必需的Secrets已添加
- 检查Secrets名称是否正确

## 优化建议

### 1. 缓存优化
工作流已配置npm缓存，加快依赖安装速度。

### 2. 并行构建
可以添加多个构建任务并行执行：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
  test:
    runs-on: ubuntu-latest
  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
```

### 3. 条件部署
可以添加条件，仅在特定分支或标签时部署：

```yaml
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

## 监控和告警

### Slack通知
工作流配置了Slack通知：
- ✅ 部署成功时发送通知
- ❌ 部署失败时发送告警

### 部署状态
GitHub会自动记录部署状态，可在以下位置查看：
- 仓库 → Deployments
- 仓库 → Environments

## 回滚部署

如需回滚到之前的版本：

```bash
# 1. 查看部署历史
shopify hydrogen list

# 2. 回滚到特定版本
shopify hydrogen rollback --version <version-id>
```

## 安全建议

1. **定期轮换令牌** - 每3个月更新一次部署令牌
2. **限制权限** - 仅授予必要的权限
3. **审计日志** - 定期检查部署日志
4. **分支保护** - 启用main分支保护规则

## 相关文档

- [Shopify Hydrogen部署文档](https://shopify.dev/docs/custom-storefronts/hydrogen/deployment)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Shopify CLI文档](https://shopify.dev/docs/api/admin-rest/2024-01/resources/shop)
