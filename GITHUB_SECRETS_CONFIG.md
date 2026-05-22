# 🔐 GitHub Secrets 配置指南 - 完整步骤

## 第一步：获取 Shopify CLI Token

### 在你的本地电脑上运行（不是这个服务器）：

```bash
# 1. 安装 Shopify CLI
npm install -g @shopify/cli

# 2. 登录到你的 Shopify 账户
shopify auth login

# 3. 获取 CLI Token
shopify auth token
```

你会看到类似这样的输出：
```
shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**复制这个 token，这很重要！**

---

## 第二步：在 GitHub 配置 Secrets

### 打开这个链接：
https://github.com/fakefuck777/riot-crown/settings/secrets/actions

### 点击 "New repository secret" 按钮，添加以下 5 个 secrets：

### Secret 1: SHOPIFY_CLI_TOKEN
- **Name**: `SHOPIFY_CLI_TOKEN`
- **Value**: 粘贴你从上面复制的 token（shpat_...）
- 点击 **Add secret**

### Secret 2: SHOPIFY_SHOP
- **Name**: `SHOPIFY_SHOP`
- **Value**: `dkgv9c-tv.myshopify.com`
- 点击 **Add secret**

### Secret 3: PUBLIC_STOREFRONT_API_TOKEN
- **Name**: `PUBLIC_STOREFRONT_API_TOKEN`
- **Value**: `2b101a6cd010cbe957d55d0139c0ac5e`
- 点击 **Add secret**

### Secret 4: PUBLIC_STORE_DOMAIN
- **Name**: `PUBLIC_STORE_DOMAIN`
- **Value**: `dkgv9c-tv.myshopify.com`
- 点击 **Add secret**

### Secret 5: SESSION_SECRET
- **Name**: `SESSION_SECRET`
- **Value**: `riot-crown-dev-secret-void-2026`
- 点击 **Add secret**

---

## 第三步：触发自动部署

配置完 secrets 后，运行：

```bash
git push origin main
```

GitHub Actions 会自动：
1. 构建你的项目
2. 运行测试
3. 部署到 Shopify Oxygen

---

## 检查部署状态

1. 打开: https://github.com/fakefuck777/riot-crown/actions
2. 查看最新的 workflow 运行
3. 如果成功，你会看到绿色的 ✓ 标记

---

## 常见问题

**Q: 我找不到 SHOPIFY_CLI_TOKEN**
A: 确保你在本地电脑上运行了 `shopify auth token` 命令

**Q: 部署失败了**
A: 检查 GitHub Actions 的日志，通常是 secrets 配置错误

**Q: 多久才能看到网站更新？**
A: 部署通常需要 2-5 分钟

