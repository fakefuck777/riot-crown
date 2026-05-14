# GitHub Secrets 配置指南

## 快速配置步骤

### 1. 获取 Shopify CLI Token

在你的本地机器上运行：

```bash
# 首先安装 Shopify CLI（如果还没安装）
npm install -g @shopify/cli

# 登录到你的 Shopify 账户
shopify auth login

# 获取 CLI Token
shopify auth token
```

复制输出的 token，这就是你的 `SHOPIFY_CLI_TOKEN`

### 2. 进入 GitHub Secrets 配置页面

1. 打开你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮

### 3. 添加以下 Secrets

#### Secret 1: SHOPIFY_CLI_TOKEN
- **Name**: `SHOPIFY_CLI_TOKEN`
- **Value**: 从上面获取的 CLI Token
- 点击 **Add secret**

#### Secret 2: SHOPIFY_SHOP
- **Name**: `SHOPIFY_SHOP`
- **Value**: `dkgv9c-tv.myshopify.com`
- 点击 **Add secret**

#### Secret 3: PUBLIC_STOREFRONT_API_TOKEN
- **Name**: `PUBLIC_STOREFRONT_API_TOKEN`
- **Value**: `2b101a6cd010cbe957d55d0139c0ac5e`
- 点击 **Add secret**

#### Secret 4: PUBLIC_STORE_DOMAIN
- **Name**: `PUBLIC_STORE_DOMAIN`
- **Value**: `dkgv9c-tv.myshopify.com`
- 点击 **Add secret**

#### Secret 5: PUBLIC_HOME_COLLECTION_HANDLE（可选）
- **Name**: `PUBLIC_HOME_COLLECTION_HANDLE`
- **Value**: `all` 或你的首页集合 handle
- 点击 **Add secret**

#### Secret 6: SLACK_WEBHOOK_URL（可选，用于部署通知）
- **Name**: `SLACK_WEBHOOK_URL`
- **Value**: 你的 Slack Webhook URL（如果有的话）
- 点击 **Add secret**

### 4. 验证配置

所有 Secrets 添加完成后，你应该看到：

```
✓ SHOPIFY_CLI_TOKEN
✓ SHOPIFY_SHOP
✓ PUBLIC_STOREFRONT_API_TOKEN
✓ PUBLIC_STORE_DOMAIN
✓ PUBLIC_HOME_COLLECTION_HANDLE (可选)
✓ SLACK_WEBHOOK_URL (可选)
```

---

## 触发自动部署

配置完成后，只需推送到 main 分支：

```bash
git push origin main
```

GitHub Actions 会自动：
1. 检查代码质量
2. 构建项目
3. 部署到 Shopify Hydrogen
4. 发送通知（如果配置了 Slack）

---

## 监控部署进度

1. 进入你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看最新的工作流运行
4. 点击进入查看详细日志

---

## 常见问题

### Q: 我在哪里找到 Shopify CLI Token？

A: 运行 `shopify auth token` 命令，它会输出你的 token。

### Q: 我可以重复使用同一个 token 吗？

A: 可以，但为了安全起见，建议定期更新 token。

### Q: 如果部署失败了怎么办？

A: 检查 GitHub Actions 日志，查看具体错误信息，然后在本地修复问题后重新推送。

### Q: 我需要配置 Slack 通知吗？

A: 不需要，这是可选的。如果你想在部署成功或失败时收到通知，可以配置 Slack Webhook。

---

## 下一步

配置完成后，你可以：

1. **立即部署**：推送到 main 分支
2. **测试部署**：创建一个测试分支，验证工作流是否正常
3. **监控部署**：在 Actions 标签页查看部署进度

祝部署顺利！🚀
