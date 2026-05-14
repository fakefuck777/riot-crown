# GitHub → Shopify Oxygen 自动部署配置指南

## 🔑 需要配置的 GitHub Secrets

你需要在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加以下 Secrets：

### 1. OXYGEN_DEPLOYMENT_TOKEN_1000137378
**获取方式**：
```bash
# 在本地运行这个命令获取 token
shopify hydrogen deploy --token
```
或者在 Shopify Partner Dashboard 中获取 Oxygen 部署 token。

**值**：[你的 Oxygen 部署 token]

### 2. PUBLIC_STOREFRONT_API_TOKEN
**当前值**：`2b101a6cd010cbe957d55d0139c0ac5e`

### 3. PUBLIC_STORE_DOMAIN
**当前值**：`dkgv9c-tv.myshopify.com`

### 4. PUBLIC_HOME_COLLECTION_HANDLE
**当前值**：`all` 或 `products`（根据你的 Shopify 设置）

### 5. SESSION_SECRET
**当前值**：`riot-crown-dev-secret-void-2026`

---

## 📋 配置步骤

### 步骤 1：获取 Oxygen 部署 Token
```bash
cd /home/fake/riot-crown
shopify hydrogen deploy --token
```

### 步骤 2：在 GitHub 添加 Secrets
1. 打开 https://github.com/fakefuck777/riot-crown/settings/secrets/actions
2. 点击 "New repository secret"
3. 添加以下 Secrets：

| Secret 名称 | 值 |
|------------|-----|
| OXYGEN_DEPLOYMENT_TOKEN_1000137378 | [从步骤 1 获取] |
| PUBLIC_STOREFRONT_API_TOKEN | 2b101a6cd010cbe957d55d0139c0ac5e |
| PUBLIC_STORE_DOMAIN | dkgv9c-tv.myshopify.com |
| PUBLIC_HOME_COLLECTION_HANDLE | all |
| SESSION_SECRET | riot-crown-dev-secret-void-2026 |

### 步骤 3：验证部署
1. 推送代码到 main 分支
2. 检查 GitHub Actions 是否自动运行
3. 查看 https://github.com/fakefuck777/riot-crown/actions
4. 如果部署成功，你的 Shopify Oxygen 站点会自动更新

---

## 🚀 自动部署流程

现在配置好后，每次你 push 到 main 分支时：

1. ✅ GitHub Actions 自动运行
2. ✅ 代码通过 lint、typecheck、build、test
3. ✅ 自动部署到 Shopify Oxygen
4. ✅ 你的线上站点自动更新

---

## 🔗 相关链接

- GitHub Secrets 配置：https://github.com/fakefuck777/riot-crown/settings/secrets/actions
- GitHub Actions：https://github.com/fakefuck777/riot-crown/actions
- Shopify Oxygen：https://shopify.dev/docs/custom-storefronts/hydrogen/deployment
- 你的 Oxygen 部署：https://admin.shopify.com/store/dkgv9c-tv/apps/hydrogen

---

## ⚠️ 常见问题

### 部署失败怎么办？
1. 检查 GitHub Actions 日志：https://github.com/fakefuck777/riot-crown/actions
2. 确认所有 Secrets 都已正确添加
3. 确认 Oxygen 部署 token 有效

### 如何手动部署？
```bash
shopify hydrogen deploy
```

### 如何查看部署状态？
```bash
shopify hydrogen deploy --status
```

---

**配置完成后，你的 GitHub → Shopify 自动部署链路就完全接好了！**
