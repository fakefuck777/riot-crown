# 🚀 Shopify Hydrogen 部署指南

## 问题诊断

你的网站没有显示更新是因为：
1. GitHub Actions 需要 Shopify secrets 才能自动部署
2. 需要配置 `SHOPIFY_CLI_TOKEN` 和 `SHOPIFY_SHOP`

## 解决方案

### 方案 1：配置 GitHub Secrets（推荐）

1. **获取 Shopify CLI Token**
   ```bash
   npm install -g @shopify/cli
   shopify auth login
   shopify auth token
   ```

2. **在 GitHub 配置 Secrets**
   - 打开: https://github.com/fakefuck777/riot-crown/settings/secrets/actions
   - 添加以下 secrets:

   | Secret Name | Value |
   |---|---|
   | SHOPIFY_CLI_TOKEN | (从上面获取) |
   | SHOPIFY_SHOP | dkgv9c-tv.myshopify.com |
   | PUBLIC_STOREFRONT_API_TOKEN | 2b101a6cd010cbe957d55d0139c0ac5e |
   | PUBLIC_STORE_DOMAIN | dkgv9c-tv.myshopify.com |
   | SESSION_SECRET | riot-crown-dev-secret-void-2026 |

3. **触发部署**
   ```bash
   git push origin main
   ```

### 方案 2：本地手动部署

```bash
# 1. 安装 Shopify CLI
npm install -g @shopify/cli

# 2. 登录 Shopify
shopify auth login

# 3. 构建项目
npm run build

# 4. 部署到 Oxygen
npx shopify hydrogen deploy
```

## 检查部署状态

- GitHub Actions: https://github.com/fakefuck777/riot-crown/actions
- Shopify Oxygen: 在你的 Shopify 后台查看部署日志

## 最近的更新

✅ 标题改成同一排
✅ 标题更大（32rem）
✅ 银色金属风格
✅ 构建成功

