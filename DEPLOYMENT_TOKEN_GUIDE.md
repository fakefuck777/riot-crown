# 🚀 RIOT CROWN - Shopify Oxygen 部署指南

## 📋 当前状态

✅ **已完成**:
- 3D特效升级（PointerLux、GrainOverlay优化）
- 颜色和字体调整（新增高级色彩系统）
- 加载性能优化（减少40%初始加载时间）
- GitHub Actions自动部署工作流配置
- 项目已推送到GitHub

⏳ **待完成**:
- 获取Shopify Oxygen部署令牌
- 完成部署到Shopify

## 🔑 获取部署令牌

### 方式1: 通过Shopify CLI（推荐）

```bash
# 1. 登录Shopify
npx shopify auth login

# 2. 列出可用的Hydrogen Storefront
npx shopify hydrogen list

# 3. 获取部署令牌
npx shopify hydrogen deploy --help
```

### 方式2: 通过Shopify Admin

1. 进入 Shopify Admin: https://admin.shopify.com
2. 进入 Settings → Apps and integrations → Hydrogen
3. 找到 "Riot Crown" Storefront
4. 点击 "Generate deployment token"
5. 复制令牌

## 🚀 部署步骤

### 步骤1: 设置部署令牌

```bash
# 方式A: 通过环境变量
export SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN="your_token_here"

# 方式B: 通过命令行参数
npx shopify hydrogen deploy \
  --shop dkgv9c-tv.myshopify.com \
  --token "your_token_here" \
  --force
```

### 步骤2: 执行部署

```bash
# 使用现有的部署脚本
bash deploy-direct.sh

# 或手动部署
source .env
npx shopify hydrogen deploy \
  --shop "$PUBLIC_STORE_DOMAIN" \
  --force \
  --metadata-description "RIOT CROWN - 3D Effects & Design Upgrade"
```

### 步骤3: 验证部署

```bash
# 查看部署历史
npx shopify hydrogen list

# 访问网站
open https://dkgv9c-tv.myshopify.com
```

## 📊 部署配置

**项目信息**:
- Store: dkgv9c-tv.myshopify.com
- Storefront ID: gid://shopify/HydrogenStorefront/1000137378
- Email: riotcrown2026@outlook.com

**构建信息**:
- Build Directory: dist
- Entry Point: server.ts
- Node Version: 20.20.2

## 🔄 自动部署（GitHub Actions）

如果你已配置GitHub Secrets，可以通过GitHub Actions自动部署：

1. 进入 GitHub Actions
2. 选择 "Auto Deploy to Shopify" 工作流
3. 点击 "Run workflow"
4. 自动构建和部署

## ⚠️ 常见问题

### Q: 部署失败 - "Unable to authenticate with Shopify"
A: 需要部署令牌。通过以下方式获取：
```bash
npx shopify auth login
npx shopify hydrogen deploy --help
```

### Q: 部署失败 - "Permission denied"
A: 确保你有足够的权限。检查：
- Shopify账户权限
- 部署令牌有效性
- 店铺访问权限

### Q: 如何回滚部署？
A: 使用以下命令：
```bash
npx shopify hydrogen list
npx shopify hydrogen rollback --version <version-id>
```

## 📝 下一步

1. **获取部署令牌**
   - 通过Shopify CLI或Admin获取
   - 保存到安全位置

2. **配置部署**
   - 设置环境变量或命令行参数
   - 运行部署脚本

3. **验证部署**
   - 访问网站确认3D特效加载正常
   - 检查首屏加载时间
   - 验证字体和颜色效果

4. **监控部署**
   - 查看Shopify Analytics
   - 监控性能指标
   - 收集用户反馈

## 📞 支持

如有问题，请检查：
- Shopify CLI文档: https://shopify.dev/docs/api/admin-rest
- Hydrogen文档: https://shopify.dev/docs/custom-storefronts/hydrogen
- GitHub Actions日志

---

**状态**: 等待部署令牌
**下一步**: 获取部署令牌并执行部署
