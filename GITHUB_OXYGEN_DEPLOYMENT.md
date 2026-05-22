# 🚀 GitHub → Shopify Oxygen 部署完整指南

## 📋 前置条件

- ✅ GitHub 账户
- ✅ Shopify 开发者账户
- ✅ 已安装 Shopify CLI (`shopify --version`)
- ✅ 已安装 Node.js 18+ (`node --version`)

---

## 第 1 步：获取 Shopify 凭证

### 1.1 获取 Shopify CLI Token

```bash
# 登录 Shopify
shopify auth login

# 选择你的开发店铺
# 系统会生成 CLI Token
```

### 1.2 获取 Storefront ID 和 API Token

```bash
# 在项目目录运行
shopify hydrogen setup

# 按照提示选择你的店铺
# 系统会自动生成 .env 文件
```

### 1.3 查看生成的凭证

```bash
cat .env
```

你会看到类似的输出：
```
PUBLIC_STOREFRONT_ID=gid://shopify/StorefrontAPI/...
PUBLIC_STORE_DOMAIN=your-shop.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-token
SESSION_SECRET=your-session-secret
```

---

## 第 2 步：配置 GitHub Secrets

### 2.1 打开 GitHub 仓库设置

1. 访问 `https://github.com/YOUR_USERNAME/riot-crown`
2. 点击 "Settings" 标签
3. 左侧菜单选择 "Secrets and variables" → "Actions"

### 2.2 添加以下 Secrets

点击 "New repository secret" 并添加：

| Secret 名称 | 值 | 来源 |
|-----------|-----|------|
| `SHOPIFY_CLI_TOKEN` | 你的 CLI Token | `shopify auth login` 后获取 |
| `SHOPIFY_SHOP` | `your-shop.myshopify.com` | Shopify Admin |
| `PUBLIC_STOREFRONT_ID` | `gid://shopify/StorefrontAPI/...` | `.env` 文件 |
| `PUBLIC_STORE_DOMAIN` | `your-shop.myshopify.com` | `.env` 文件 |
| `PUBLIC_STOREFRONT_API_TOKEN` | 你的 Storefront Token | `.env` 文件 |
| `SESSION_SECRET` | 32 字符随机字符串 | 生成: `openssl rand -base64 32` |

### 2.3 验证 Secrets 已添加

```bash
# 在 GitHub 网页上查看
# Settings → Secrets and variables → Actions
# 应该看到 6 个 Secrets
```

---

## 第 3 步：推送代码到 GitHub

### 3.1 初始化 Git 仓库（如果还没有）

```bash
cd /home/fake/riot-crown

# 初始化
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Riot Crown Y2K theme"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/riot-crown.git

# 重命名分支为 main
git branch -M main

# 推送
git push -u origin main
```

### 3.2 验证推送成功

```bash
# 访问 GitHub 仓库
# 应该看到所有文件已上传
```

---

## 第 4 步：验证 GitHub Actions 工作流

### 4.1 查看工作流

1. 访问 `https://github.com/YOUR_USERNAME/riot-crown`
2. 点击 "Actions" 标签
3. 应该看到 "Deploy to Shopify Oxygen" 工作流

### 4.2 查看工作流运行

1. 点击最新的工作流运行
2. 查看每个步骤的日志
3. 确保所有步骤都通过 ✅

### 4.3 如果工作流失败

**常见错误**:

1. **Secrets 未配置**
   - 检查 Settings → Secrets
   - 确保所有 6 个 Secrets 都已添加

2. **构建失败**
   - 查看 "Build" 步骤的日志
   - 运行 `npm run build` 本地测试

3. **部署失败**
   - 查看 "Deploy to Oxygen" 步骤的日志
   - 确保 `SHOPIFY_CLI_TOKEN` 有效

---

## 第 5 步：验证部署

### 5.1 查看部署状态

```bash
# 在项目目录运行
shopify hydrogen list

# 应该看到你的部署列表
```

### 5.2 访问部署的网站

```bash
# 获取部署 URL
shopify hydrogen list

# 访问 URL
# 应该看到你的网站在线
```

### 5.3 测试功能

- [ ] 首页加载正常
- [ ] 3D 珍珠项链显示
- [ ] 移动端 3D 特效显示
- [ ] 购物车功能正常
- [ ] 支付流程正常
- [ ] 没有控制台错误

---

## 第 6 步：自动部署工作流

### 6.1 工作流如何工作

每次你推送到 `main` 分支时：

1. GitHub Actions 自动运行
2. 安装依赖
3. 运行 TypeScript 检查
4. 运行 ESLint
5. 构建项目
6. 部署到 Shopify Oxygen

### 6.2 推送代码并自动部署

```bash
# 修改代码
# ...

# 提交
git add .
git commit -m "feat: Improve 3D effects on mobile"

# 推送（自动触发部署）
git push origin main

# 在 GitHub Actions 中查看部署进度
```

### 6.3 监控部署

1. 访问 `https://github.com/YOUR_USERNAME/riot-crown/actions`
2. 查看最新的工作流运行
3. 等待所有步骤完成
4. 检查部署是否成功

---

## 🔧 故障排除

### 问题 1：`SHOPIFY_CLI_TOKEN` 无效

**解决方案**:
```bash
# 重新生成 Token
shopify auth logout
shopify auth login

# 更新 GitHub Secret
```

### 问题 2：构建失败

**解决方案**:
```bash
# 本地测试构建
npm run build

# 查看错误信息
# 修复错误
# 推送修复
```

### 问题 3：部署失败

**解决方案**:
```bash
# 查看 GitHub Actions 日志
# 查看 "Deploy to Oxygen" 步骤
# 检查错误信息

# 常见原因：
# - Secrets 配置错误
# - 构建失败
# - Shopify CLI 版本过旧
```

### 问题 4：网站在线但功能不正常

**解决方案**:
```bash
# 检查环境变量
# 确保所有 Secrets 都正确配置

# 查看 Shopify Oxygen 日志
shopify hydrogen logs

# 检查浏览器控制台错误
# 修复错误并重新部署
```

---

## 📊 部署检查清单

### 部署前
- [ ] 所有代码已提交
- [ ] 本地构建成功 (`npm run build`)
- [ ] 本地测试通过 (`npm run dev`)
- [ ] 所有 Secrets 已配置
- [ ] GitHub Actions 工作流已创建

### 部署中
- [ ] GitHub Actions 工作流正在运行
- [ ] 所有步骤都通过
- [ ] 部署到 Oxygen 成功

### 部署后
- [ ] 网站在线
- [ ] 首页加载正常
- [ ] 3D 特效显示
- [ ] 移动端功能正常
- [ ] 没有控制台错误
- [ ] 购物车功能正常

---

## 🎉 完成！

现在你的网站已经：
1. ✅ 推送到 GitHub
2. ✅ 配置了自动部署
3. ✅ 部署到 Shopify Oxygen
4. ✅ 在线运行

**下一步**: 
- 监控网站性能
- 收集用户反馈
- 持续优化

---

## 📚 参考资源

- [Shopify Hydrogen 文档](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [Shopify Oxygen 部署指南](https://shopify.dev/docs/custom-storefronts/oxygen)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Shopify CLI 文档](https://shopify.dev/docs/api/admin-rest/2024-01/resources/shop)

---

**有问题？** 查看 GitHub Actions 日志或运行 `shopify hydrogen logs` 获取更多信息。
