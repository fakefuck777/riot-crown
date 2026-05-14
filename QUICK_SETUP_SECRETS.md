# ⚡ GitHub Secrets 快速配置清单

## 🔑 需要立即添加的 5 个 Secrets

打开：https://github.com/fakefuck777/riot-crown/settings/secrets/actions

### 点击 "New repository secret"，逐个添加：

#### 1️⃣ PUBLIC_STOREFRONT_API_TOKEN
```
2b101a6cd010cbe957d55d0139c0ac5e
```

#### 2️⃣ PUBLIC_STORE_DOMAIN
```
dkgv9c-tv.myshopify.com
```

#### 3️⃣ PUBLIC_HOME_COLLECTION_HANDLE
```
all
```

#### 4️⃣ SESSION_SECRET
```
riot-crown-dev-secret-void-2026
```

#### 5️⃣ OXYGEN_DEPLOYMENT_TOKEN_1000137378
**这个需要从 Shopify 获取。两种方式：**

**方式 A：从 Shopify Partner Dashboard**
1. 打开 https://partners.shopify.com
2. 进入你的 Hydrogen Storefront
3. 找到 "Deployment" 或 "Oxygen" 部分
4. 复制 Deployment Token

**方式 B：从本地命令行**
```bash
cd /home/fake/riot-crown
shopify auth login
shopify hydrogen deploy --token
```

---

## ✅ 配置完成后

1. 所有 5 个 Secrets 都已添加
2. 下次 push 到 main 时，GitHub Actions 会自动：
   - 运行 lint、typecheck、build、test
   - 自动部署到 Shopify Oxygen
   - 你的线上站点自动更新

---

## 🚀 验证部署

配置完成后，检查：
- https://github.com/fakefuck777/riot-crown/actions
- 看是否有绿色的 ✅ 部署成功

---

**现在就去配置这 5 个 Secrets，然后你的 GitHub → Shopify 自动部署就完全接好了！**
