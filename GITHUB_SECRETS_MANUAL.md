# 🔐 GitHub Secrets 手动配置指南（5分钟完成）

## 📋 你需要配置的 5 个 Secrets

| Secret 名称 | 值 |
|---|---|
| SHOPIFY_CLI_TOKEN | `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (需要你获取) |
| SHOPIFY_SHOP | `dkgv9c-tv.myshopify.com` |
| PUBLIC_STOREFRONT_API_TOKEN | `2b101a6cd010cbe957d55d0139c0ac5e` |
| PUBLIC_STORE_DOMAIN | `dkgv9c-tv.myshopify.com` |
| SESSION_SECRET | `riot-crown-dev-secret-void-2026` |

---

## 🚀 第一步：获取 Shopify CLI Token

**在你的本地电脑上运行：**

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
shpat_1234567890abcdefghijklmnopqrst
```

**复制这个 token！**

---

## 🔧 第二步：在 GitHub 配置 Secrets

### 打开这个链接：
👉 **https://github.com/fakefuck777/riot-crown/settings/secrets/actions**

### 点击 "New repository secret" 按钮

### 添加第 1 个 Secret：SHOPIFY_CLI_TOKEN
1. **Name**: `SHOPIFY_CLI_TOKEN`
2. **Value**: 粘贴你从上面复制的 token（`shpat_...`）
3. 点击 **Add secret**

### 添加第 2 个 Secret：SHOPIFY_SHOP
1. **Name**: `SHOPIFY_SHOP`
2. **Value**: `dkgv9c-tv.myshopify.com`
3. 点击 **Add secret**

### 添加第 3 个 Secret：PUBLIC_STOREFRONT_API_TOKEN
1. **Name**: `PUBLIC_STOREFRONT_API_TOKEN`
2. **Value**: `2b101a6cd010cbe957d55d0139c0ac5e`
3. 点击 **Add secret**

### 添加第 4 个 Secret：PUBLIC_STORE_DOMAIN
1. **Name**: `PUBLIC_STORE_DOMAIN`
2. **Value**: `dkgv9c-tv.myshopify.com`
3. 点击 **Add secret**

### 添加第 5 个 Secret：SESSION_SECRET
1. **Name**: `SESSION_SECRET`
2. **Value**: `riot-crown-dev-secret-void-2026`
3. 点击 **Add secret**

---

## ✅ 第三步：触发自动部署

配置完所有 secrets 后，运行：

```bash
git push origin main
```

GitHub Actions 会自动：
1. ✓ 构建你的项目
2. ✓ 运行测试
3. ✓ 部署到 Shopify Oxygen

---

## 📊 检查部署状态

1. 打开: **https://github.com/fakefuck777/riot-crown/actions**
2. 查看最新的 workflow 运行
3. 等待所有步骤完成（通常需要 3-5 分钟）
4. 如果成功，你会看到绿色的 ✓ 标记

---

## 🌐 验证网站更新

部署完成后：

1. 打开你的 Shopify 网站
2. **清除浏览器缓存**（Ctrl+Shift+Delete 或 Cmd+Shift+Delete）
3. 或用**无痕模式**打开网站
4. 检查以下更新是否生效：
   - ✨ 标题在同一排
   - 📏 标题更大
   - 🌟 银色金属风格
   - ⚡ 加载速度改善

---

## ❓ 常见问题

**Q: 我找不到 SHOPIFY_CLI_TOKEN**
A: 确保你在本地电脑上运行了 `shopify auth token` 命令

**Q: 部署失败了**
A: 检查 GitHub Actions 的日志，通常是 secrets 配置错误或 token 过期

**Q: 多久才能看到网站更新？**
A: 部署通常需要 3-5 分钟，然后清除缓存即可看到更新

**Q: 我的 token 过期了怎么办？**
A: 重新运行 `shopify auth token` 获取新的 token，然后更新 GitHub secret

---

## 📝 总结

你已经完成了：
- ✅ 标题改成同一排
- ✅ 标题更大（32rem）
- ✅ 银色金属风格
- ✅ 代码推送到 GitHub

现在只需要：
1. 获取 Shopify CLI Token
2. 在 GitHub 配置 5 个 secrets
3. 运行 `git push origin main`
4. 等待自动部署完成

就这么简单！🎉

