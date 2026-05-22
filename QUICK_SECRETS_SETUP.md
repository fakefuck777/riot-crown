# ⚡ GitHub Secrets 快速配置 (5 分钟)

## 🎯 你需要做的 3 件事

### 1️⃣ 获取 Shopify CLI Token (2 分钟)

```bash
# 安装 Shopify CLI
npm install -g @shopify/cli

# 登录 Shopify
shopify auth login

# 选择你的开发店铺
# 系统会显示 CLI Token
```

**记录下 CLI Token**

### 2️⃣ 获取 Storefront ID (2 分钟)

```bash
# 初始化 Hydrogen
shopify hydrogen setup

# 选择你的店铺
# 查看 .env 文件
cat .env | grep PUBLIC_STOREFRONT_ID
```

**记录下 PUBLIC_STOREFRONT_ID**

### 3️⃣ 配置 GitHub Secrets (1 分钟)

**访问**: https://github.com/fakefuck777/riot-crown/settings/secrets/actions

**添加 6 个 Secrets**:

```
SHOPIFY_CLI_TOKEN = <从步骤 1 获取>
SHOPIFY_SHOP = dkgv9c-tv.myshopify.com
PUBLIC_STOREFRONT_ID = <从步骤 2 获取>
PUBLIC_STORE_DOMAIN = dkgv9c-tv.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN = 2b101a6cd010cbe957d55d0139c0ac5e
SESSION_SECRET = riot-crown-dev-secret-void-2026
```

---

## ✅ 完成后

```bash
# 推送代码触发部署
git add .
git commit -m "trigger: Deploy to Oxygen"
git push origin main

# 等待 GitHub Actions 完成
# 网站会自动部署到 Shopify Oxygen
```

---

**就这么简单！** 🚀
