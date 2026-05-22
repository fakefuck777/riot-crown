# 🔐 GitHub Secrets 配置指南

**目标**: 配置 GitHub Secrets 以启用自动部署到 Shopify Oxygen

**预计时间**: 15 分钟

---

## 📋 需要的信息

你需要以下 6 个信息来配置 GitHub Secrets:

| Secret 名称 | 值 | 来源 |
|-----------|-----|------|
| `SHOPIFY_CLI_TOKEN` | Shopify CLI 令牌 | 运行 `shopify auth login` |
| `SHOPIFY_SHOP` | 店铺域名 | `dkgv9c-tv.myshopify.com` |
| `PUBLIC_STOREFRONT_ID` | Storefront ID | 运行 `shopify hydrogen setup` |
| `PUBLIC_STORE_DOMAIN` | 店铺域名 | `dkgv9c-tv.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | Storefront API Token | `2b101a6cd010cbe957d55d0139c0ac5e` |
| `SESSION_SECRET` | 会话密钥 | `riot-crown-dev-secret-void-2026` |

---

## 🔧 方式 1：使用 GitHub CLI (推荐)

### 第 1 步：安装 GitHub CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt-get install gh

# Windows
choco install gh
```

### 第 2 步：登录 GitHub

```bash
gh auth login
```

按照提示选择:
- What is your preferred protocol for Git operations? → HTTPS
- Authenticate Git with your GitHub credentials? → Y
- How would you like to authenticate GitHub CLI? → Login with a web browser

### 第 3 步：运行配置脚本

```bash
cd /home/fake/riot-crown
chmod +x setup-github-secrets.sh
./setup-github-secrets.sh
```

脚本会提示你输入 6 个 Secrets，然后自动配置。

---

## 🔧 方式 2：手动配置 (通过 GitHub 网页)

### 第 1 步：打开 GitHub 仓库设置

1. 访问 https://github.com/fakefuck777/riot-crown
2. 点击 "Settings" 标签
3. 左侧菜单选择 "Secrets and variables" → "Actions"

### 第 2 步：添加 Secrets

点击 "New repository secret" 并添加以下 6 个 Secrets:

#### Secret 1: SHOPIFY_CLI_TOKEN
- **Name**: `SHOPIFY_CLI_TOKEN`
- **Value**: 从 `shopify auth login` 获取
- 点击 "Add secret"

#### Secret 2: SHOPIFY_SHOP
- **Name**: `SHOPIFY_SHOP`
- **Value**: `dkgv9c-tv.myshopify.com`
- 点击 "Add secret"

#### Secret 3: PUBLIC_STOREFRONT_ID
- **Name**: `PUBLIC_STOREFRONT_ID`
- **Value**: 从 `shopify hydrogen setup` 获取
- 点击 "Add secret"

#### Secret 4: PUBLIC_STORE_DOMAIN
- **Name**: `PUBLIC_STORE_DOMAIN`
- **Value**: `dkgv9c-tv.myshopify.com`
- 点击 "Add secret"

#### Secret 5: PUBLIC_STOREFRONT_API_TOKEN
- **Name**: `PUBLIC_STOREFRONT_API_TOKEN`
- **Value**: `2b101a6cd010cbe957d55d0139c0ac5e`
- 点击 "Add secret"

#### Secret 6: SESSION_SECRET
- **Name**: `SESSION_SECRET`
- **Value**: `riot-crown-dev-secret-void-2026`
- 点击 "Add secret"

---

## 📝 获取缺失的信息

### 获取 SHOPIFY_CLI_TOKEN

```bash
# 1. 安装 Shopify CLI
npm install -g @shopify/cli

# 2. 登录 Shopify
shopify auth login

# 3. 选择你的开发店铺
# 系统会生成 CLI Token

# 4. 查看 Token (在 ~/.shopify/auth.json 中)
cat ~/.shopify/auth.json
```

### 获取 PUBLIC_STOREFRONT_ID

```bash
# 1. 初始化 Hydrogen 项目
shopify hydrogen setup

# 2. 选择你的店铺
# 3. 查看生成的 .env 文件
cat .env | grep PUBLIC_STOREFRONT_ID
```

---

## ✅ 验证配置

### 检查 Secrets 是否已配置

```bash
# 使用 GitHub CLI
gh secret list

# 应该看到:
# SHOPIFY_CLI_TOKEN
# SHOPIFY_SHOP
# PUBLIC_STOREFRONT_ID
# PUBLIC_STORE_DOMAIN
# PUBLIC_STOREFRONT_API_TOKEN
# SESSION_SECRET
```

---

## 🚀 配置完成后

### 第 1 步：推送代码

```bash
git add .
git commit -m "trigger: Deploy to Oxygen"
git push origin main
```

### 第 2 步：监控部署

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看 "Deploy to Shopify Oxygen" 工作流
4. 等待所有步骤完成

### 第 3 步：验证部署

```bash
# 查看部署列表
shopify hydrogen list

# 访问部署的网站
# 应该看到你的网站在线
```

---

## 🔍 故障排除

### 问题 1：GitHub CLI 登录失败

**解决方案**:
```bash
# 重新登录
gh auth logout
gh auth login
```

### 问题 2：Secrets 配置错误

**解决方案**:
1. 访问 GitHub 仓库设置
2. 删除错误的 Secret
3. 重新添加正确的值

### 问题 3：部署失败

**检查**:
1. 查看 GitHub Actions 日志
2. 确保所有 Secrets 都正确配置
3. 确保 Shopify CLI Token 有效

---

## 📚 相关文档

- **FINAL_COMPLETION_REPORT.md** - 完成总结
- **GITHUB_OXYGEN_DEPLOYMENT.md** - 详细部署指南
- **QUICK_FIX_GUIDE.md** - 快速修复指南

---

**现在就开始配置吧！** 🚀
