# Riot Crown - Y2K Pearl Chrome Hydrogen Theme

极致黑暗 Y2K 末世风 + 珍珠 chrome 混搭的 Shopify Hydrogen 主题。

## 🎨 视觉特性

- **全屏 3D 英雄区** - 旋转珍珠项链，霓虹灯光，粒子效果
- **产品 3D 查看器** - 360° 旋转，材质切换（珍珠白/黑/镀金/银铬）
- **AR 虚拟试戴** - 脖子/手腕实时预览
- **极致黑暗美学** - 纯黑底 + 电光紫 (#FF1293) + 液态青 (#6ECBFF) + 液态金 (#C9A84C)
- **Y2K 排版** - 扭曲工业风 + 经典气泡字体

## 🚀 功能

### 核心电商
- ✅ 多语言支持 (EN/ZH/JP/KR/FR)
- ✅ 实时库存显示 + 颜色编码
- ✅ 倒计时计时器（新品发售）
- ✅ "其他人也在抢" 实时通知
- ✅ 购物车 + 快速结账

### 营销转化
- ✅ 邮件捕获弹窗（30% 滚动触发）
- ✅ 退出意图弹窗（鼠标离开）
- ✅ 捆绑推荐（加入购物车后）
- ✅ 愿望清单 + 社交分享
- ✅ 会员系统（3 级分层）

### 分析追踪
- ✅ Google Analytics 4
- ✅ Meta Pixel (Facebook/Instagram)
- ✅ TikTok Pixel
- ✅ 自定义事件追踪

### SEO
- ✅ Schema.org 结构化数据
- ✅ OG 标签社交分享
- ✅ Sitemap + Robots.txt
- ✅ 多语言 hreflang

## 📦 安装

### 前置要求
- Node.js 18+
- npm 或 yarn
- Shopify CLI 3.72+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/riot-crown.git
cd riot-crown

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 Shopify 凭证

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 环境变量配置

**必需：**
```
SESSION_SECRET=your-32-char-random-string
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-token
PUBLIC_STORE_DOMAIN=your-shop.myshopify.com
```

**可选（营销）：**
```
KLAVIYO_API_KEY=your-key
TIKTOK_PIXEL_ID=your-id
META_PIXEL_ID=your-id
GOOGLE_GA_ID=G-XXXXXXXXXX
```

## 🏗️ 项目结构

```
app/
├── components/
│   ├── HeroY2K.tsx              # 3D 英雄区
│   ├── Product3DViewer.tsx      # 产品 3D 查看器
│   ├── CountdownTimer.tsx       # 倒计时
│   ├── InventoryBadge.tsx       # 库存徽章
│   ├── OthersBuyingNotif.tsx    # 实时通知
│   ├── EmailCapturePopup.tsx    # 邮件弹窗
│   ├── ExitIntentPopup.tsx      # 退出弹窗
│   ├── BundleRecommendation.tsx # 捆绑推荐
│   ├── WishlistButton.tsx       # 收藏按钮
│   └── MemberBadge.tsx          # 会员徽章
├── lib/
│   ├── MemberContext.tsx        # 会员系统
│   ├── analyticsEvents.ts       # 事件追踪
│   └── ...
├── routes/
│   ├── _index.tsx              # 首页
│   ├── wishlist.tsx            # 愿望清单页
│   ├── robots.txt.tsx          # SEO
│   ├── sitemap.xml.tsx         # 网站地图
│   └── ...
└── styles/
    └── global.css
```

## 🎯 关键组件

### HeroY2K
全屏 3D 英雄区，包含：
- 11 个珍珠（粉/金/青色）
- 800 个粒子系统
- 6 个霓虹灯光源
- 鼠标/触摸交互旋转
- 自动旋转（无交互时）

```tsx
import { HeroY2K } from '~/components/HeroY2K';

export default function Home() {
  return <HeroY2K />;
}
```

### Product3DViewer
产品 3D 查看器：
- 360° 旋转
- 4 种材质切换
- AR 虚拟试戴按钮
- 收藏按钮

```tsx
import { Product3DViewer } from '~/components/Product3DViewer';

export default function ProductPage() {
  return (
    <Product3DViewer
      modelUrl="/models/necklace.glb"
      productName="Millennium Pearl Necklace"
    />
  );
}
```

### 会员系统
```tsx
import { useMember } from '~/lib/MemberContext';

export function MyComponent() {
  const { tier, discountPercentage, hasEarlyAccess } = useMember();
  
  return (
    <div>
      <p>等级: {tier}</p>
      <p>折扣: {discountPercentage}%</p>
      {hasEarlyAccess && <p>✓ 抢先购买已解锁</p>}
    </div>
  );
}
```

### 事件追踪
```tsx
import { trackProductView, track3DModelView, trackAddToCart } from '~/lib/analyticsEvents';

// 追踪产品查看
trackProductView('product-123', 'Pearl Necklace', 299);

// 追踪 3D 模型查看
track3DModelView('product-123', 'Pearl Necklace');

// 追踪加入购物车
trackAddToCart('product-123', 'Pearl Necklace', 299, 1);
```

## 🚢 部署

### 部署到 Shopify Oxygen

1. **推送到 GitHub**
```bash
git add .
git commit -m "feat: Y2K pearl chrome theme"
git push origin main
```

2. **配置 GitHub Secrets**
在 GitHub 仓库设置中添加：
- `SHOPIFY_CLI_TOKEN` - Shopify CLI 令牌
- `SHOPIFY_SHOP` - 你的 shop.myshopify.com

3. **自动部署**
GitHub Actions 会自动：
- 运行 TypeScript 检查
- 运行 ESLint
- 构建项目
- 部署到 Shopify Oxygen

### 手动部署

```bash
# 构建
npm run build

# 预览
npm run preview

# 部署
shopify hydrogen deploy
```

## 📊 性能指标

目标：
- Hero 加载 < 3 秒
- 3D 模型切换 < 100ms
- AR 渲染 60fps
- 页面加载 < 2 秒
- Core Web Vitals 全绿

## 🔍 SEO

- ✅ Schema.org 产品结构化数据
- ✅ OG 标签（社交分享）
- ✅ Sitemap 自动生成
- ✅ Robots.txt 配置
- ✅ 多语言 hreflang

## 📱 浏览器支持

- Chrome/Edge (最新)
- Firefox (最新)
- Safari (最新)
- iOS Safari (最新)
- Android Chrome (最新)

## ♿ 无障碍

- ✅ 键盘导航
- ✅ 屏幕阅读器支持
- ✅ 颜色对比度 WCAG AA
- ✅ 尊重 prefers-reduced-motion

## 🛠️ 开发

### 命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 类型检查
npm run typecheck

# Lint
npm run lint

# 测试
npm run test

# E2E 测试
npm run e2e
```

### 添加新组件

1. 在 `app/components/` 中创建组件
2. 导出为命名导出
3. 在需要的地方导入使用

### 添加新路由

1. 在 `app/routes/` 中创建文件
2. 使用 Remix 文件约定
3. 导出默认组件

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 PR！

## 📧 联系

- Email: hello@riotcrown.shop
- Instagram: @riotcrown
- TikTok: @riotcrown

---

**Made with ♡ for the Y2K aesthetic lovers**
