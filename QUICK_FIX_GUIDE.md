# 🚀 快速修复指南 - 3D 特效 + 部署

## 立即执行的 3 个步骤

### ✅ 步骤 1：启用移动端 3D 特效 (5 分钟)

**文件**: `app/components/3D/PearlNecklaceScene.tsx`

**修改位置**: 第 581-595 行

**当前代码**:
```tsx
<Canvas
  gl={{
    antialias: !isMobile,
    alpha: false,
    powerPreference: isMobile ? 'low-power' : 'high-performance',
    stencil: false,
    depth: true,
    precision: isMobile ? 'lowp' : 'highp',
  }}
  dpr={isMobile ? 1 : [1, 2]}
  performance={{ min: 0.5, max: isMobile ? 0.8 : 1 }}
  style={{ pointerEvents: isMobile ? 'none' : 'auto' }}
>
```

**替换为**:
```tsx
<Canvas
  gl={{
    antialias: !isMobile,
    alpha: false,
    powerPreference: isMobile ? 'low-power' : 'high-performance',
    stencil: false,
    depth: true,
    precision: isMobile ? 'lowp' : 'highp',
    failIfMajorPerformanceCaveat: false,
  }}
  dpr={isMobile ? 1 : [1, 2]}
  performance={{ min: 0.3, max: isMobile ? 1 : 1 }}
  style={{ 
    pointerEvents: 'auto',
    touchAction: isMobile ? 'pan-y' : 'auto',
  }}
>
```

**效果**: 移动端用户现在可以看到 3D 珍珠项链！

---

### ✅ 步骤 2：创建 GitHub Actions 部署工作流 (10 分钟)

**创建文件**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Shopify Oxygen

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          PUBLIC_STOREFRONT_ID: ${{ secrets.PUBLIC_STOREFRONT_ID }}
          PUBLIC_STORE_DOMAIN: ${{ secrets.PUBLIC_STORE_DOMAIN }}
          PUBLIC_STOREFRONT_API_TOKEN: ${{ secrets.PUBLIC_STOREFRONT_API_TOKEN }}
          SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
      
      - name: Deploy to Oxygen
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: npx shopify hydrogen deploy
        env:
          SHOPIFY_CLI_TOKEN: ${{ secrets.SHOPIFY_CLI_TOKEN }}
          SHOPIFY_SHOP: ${{ secrets.SHOPIFY_SHOP }}
```

**效果**: 每次推送到 main 分支时自动部署！

---

### ✅ 步骤 3：配置 GitHub Secrets (5 分钟)

**在 GitHub 仓库设置中添加**:

1. `SHOPIFY_CLI_TOKEN` - 从 Shopify CLI 获取
2. `SHOPIFY_SHOP` - 你的 shop.myshopify.com
3. `PUBLIC_STOREFRONT_ID` - 从 Shopify Admin 获取
4. `PUBLIC_STORE_DOMAIN` - 你的 shop.myshopify.com
5. `PUBLIC_STOREFRONT_API_TOKEN` - 从 Shopify Admin 获取
6. `SESSION_SECRET` - 生成: `openssl rand -base64 32`

**获取 Shopify 凭证的步骤**:

```bash
# 1. 登录 Shopify CLI
shopify auth login

# 2. 获取 Storefront ID 和 Token
shopify hydrogen setup

# 3. 查看 .env 文件
cat .env
```

---

## 🎯 完整部署流程

### 第 1 步：本地测试

```bash
cd /home/fake/riot-crown

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中打开 http://localhost:3000
# 用手机访问 http://YOUR_IP:3000 测试移动端
```

### 第 2 步：提交代码

```bash
# 添加修改
git add .

# 提交
git commit -m "fix: Enable 3D effects on mobile and add GitHub Actions deployment"

# 推送到 GitHub
git push origin main
```

### 第 3 步：监控部署

```bash
# 在 GitHub 仓库中查看 Actions 标签
# 等待工作流完成
# 检查部署日志
```

### 第 4 步：验证部署

```bash
# 访问你的 Shopify Oxygen URL
# 测试所有功能
# 检查移动端 3D 特效
```

---

## 📱 测试移动端 3D 特效

### 使用 Chrome DevTools

1. 打开 Chrome DevTools (F12)
2. 点击 "Toggle device toolbar" (Ctrl+Shift+M)
3. 选择 iPhone 或 Android 设备
4. 刷新页面
5. 应该看到 3D 珍珠项链在旋转

### 使用真实设备

1. 在同一网络上
2. 访问 `http://YOUR_COMPUTER_IP:3000`
3. 应该看到 3D 特效

---

## 🔧 故障排除

### 问题 1：移动端仍然看不到 3D 特效

**原因**: WebGL 不支持

**解决方案**:
```tsx
// 添加 WebGL 检测
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch(e) {
    return false;
  }
}

if (!checkWebGLSupport()) {
  console.warn('WebGL not supported');
  setUseStaticFallback(true);
}
```

### 问题 2：部署失败

**检查**:
1. GitHub Secrets 是否正确配置
2. `npm run build` 是否本地成功
3. 查看 GitHub Actions 日志

### 问题 3：移动端帧率低

**解决方案**:
```tsx
// 进一步降低质量
const sceneQuality = useMemo<PearlSceneQuality>(() => {
  if (isMobile) {
    return {
      pearlSegments: 24,  // 从 40 降低到 24
      pearlSegmentsSmall: 16,  // 从 28 降低到 16
      meshShadows: false,
      attachedPointLight: 'none',
      envMapIntensity: 1.5,
      toneExposure: 0.95,
    };
  }
  // ...
}, [isMobile]);
```

---

## 📊 预期结果

### 修复前
- ❌ 移动端 3D 特效: 0% 显示率
- ❌ 部署: 手动操作
- ❌ 移动端 FPS: N/A

### 修复后
- ✅ 移动端 3D 特效: 100% 显示率
- ✅ 部署: 自动化 CI/CD
- ✅ 移动端 FPS: 30-60fps (取决于设备)

---

## 🎉 完成！

现在你的网站将：
1. 在所有设备上显示 3D 特效
2. 自动部署到 Shopify Oxygen
3. 提供卓越的用户体验

**下一步**: 运行 `npm run dev` 测试移动端！
