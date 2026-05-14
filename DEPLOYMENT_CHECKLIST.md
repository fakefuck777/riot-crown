# 🚀 RIOT CROWN Y2K 主题 - 完美部署检查清单

## 📋 部署前准备

### ✅ 代码质量检查
- [x] TypeScript 类型检查通过
- [x] ESLint 检查通过
- [x] 构建成功（无编译错误）
- [x] 所有 Bug 已修复
- [x] 代码已提交到 GitHub

### ✅ 功能验证
- [x] 首页 3D 珍珠场景正常
- [x] 滚动叙事三章节完整
- [x] 邮箱弹窗触发逻辑正确
- [x] 社交分享链路完整
- [x] TikTok Pixel 埋点就绪
- [x] Wishlist 功能正常
- [x] Bundle 推荐机制正常
- [x] 限量倒计时逻辑正确

### ✅ 环境配置
- [x] PUBLIC_STORE_DOMAIN 已配置
- [x] PUBLIC_STOREFRONT_API_TOKEN 已配置
- [x] PUBLIC_CHECKOUT_DOMAIN 已配置

---

## 🔧 部署方式选择

### 方式 1：GitHub Actions 自动部署（推荐）

**优点**：完全自动化，无需本地操作

**步骤**：

1. **配置 GitHub Secrets**
   
   进入你的 GitHub 仓库 → Settings → Secrets and variables → Actions
   
   添加以下 Secrets：
   
   ```
   SHOPIFY_CLI_TOKEN = 你的 Shopify CLI Token
   SHOPIFY_SHOP = dkgv9c-tv.myshopify.com
   PUBLIC_STOREFRONT_API_TOKEN = 2b101a6cd010cbe957d55d0139c0ac5e
   PUBLIC_STORE_DOMAIN = dkgv9c-tv.myshopify.com
   PUBLIC_HOME_COLLECTION_HANDLE = (可选，默认为首页集合)
   SLACK_WEBHOOK_URL = (可选，用于部署通知)
   ```

2. **获取 Shopify CLI Token**
   
   在本地运行：
   ```bash
   shopify auth login
   ```
   
   按照提示完成认证，然后运行：
   ```bash
   shopify auth token
   ```
   
   复制输出的 token 到 GitHub Secrets 中的 `SHOPIFY_CLI_TOKEN`

3. **触发部署**
   
   只需推送到 main 分支：
   ```bash
   git push origin main
   ```
   
   GitHub Actions 会自动：
   - 运行类型检查
   - 运行 ESLint
   - 构建项目
   - 部署到 Shopify Hydrogen
   - 发送 Slack 通知（如果配置了）

4. **监控部署**
   
   进入 GitHub 仓库 → Actions 标签页，查看部署进度

---

### 方式 2：本地部署

**优点**：可以立即看到部署结果

**步骤**：

1. **安装 Shopify CLI**
   ```bash
   npm install -g @shopify/cli
   ```

2. **认证**
   ```bash
   shopify auth login
   ```

3. **链接到你的店铺**
   ```bash
   shopify hydrogen link
   ```

4. **部署**
   ```bash
   shopify hydrogen deploy
   ```

5. **提升到生产环境**
   ```bash
   shopify hydrogen promote
   ```

---

## 📊 部署后验证

### 首页检查
- [ ] 访问 https://riotcrown.shop（或你的域名）
- [ ] 首页 3D 珍珠场景加载正常
- [ ] "RIOT CROWN" 标题显示正确
- [ ] 滚动指示器可见
- [ ] 页面响应速度正常

### 3D 交互检查
- [ ] 鼠标可以拖拽旋转 3D 珍珠
- [ ] 滚轮不会缩放场景
- [ ] 自动旋转在没有交互时进行
- [ ] 粒子系统正常运行

### 滚动叙事检查
- [ ] 向下滚动时出现三个章节
- [ ] 第一章：废土诞生（黑暗紫粉渐变）
- [ ] 第二章：女王加冕（皇冠光晕）
- [ ] 第三章：夜店狂欢（频闪灯效）
- [ ] 多语言切换正常

### 营销功能检查
- [ ] 邮箱弹窗在 45% 滚动位置出现
- [ ] 邮箱弹窗只出现一次（3 天冷却）
- [ ] 限量倒计时显示正确
- [ ] 库存进度条更新正常
- [ ] Bundle 推荐弹窗出现

### 产品页检查
- [ ] 产品页加载正常
- [ ] 3D 模型显示正确
- [ ] 材质切换功能正常
- [ ] Wishlist 按钮可用
- [ ] 社交分享按钮可用

### 多语言检查
- [ ] 语言切换器可见
- [ ] 支持 EN/ZH/JP/KR/FR
- [ ] 页面内容正确翻译
- [ ] URL 包含语言前缀

### 性能检查
- [ ] 首页加载时间 < 3 秒
- [ ] 3D 场景帧率 > 30 FPS
- [ ] 没有控制台错误
- [ ] 没有网络请求失败

### SEO 检查
- [ ] /robots.txt 可访问
- [ ] /sitemap.xml 可访问
- [ ] 页面 meta 标签正确
- [ ] Open Graph 标签正确

### 分析埋点检查
- [ ] TikTok Pixel 已加载（检查网络标签）
- [ ] 页面浏览事件已上报
- [ ] 产品浏览事件已上报
- [ ] 加购事件已上报

---

## 🔄 部署后更新

### 如果需要修改代码

1. 在本地修改代码
2. 运行测试：
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
3. 提交并推送：
   ```bash
   git add .
   git commit -m "描述你的改动"
   git push origin main
   ```
4. GitHub Actions 会自动部署新版本

### 如果部署失败

1. 检查 GitHub Actions 日志
2. 查看具体错误信息
3. 在本地修复问题
4. 重新提交和推送

### 回滚到上一个版本

```bash
shopify hydrogen versions
shopify hydrogen rollback <version-id>
```

---

## 📞 故障排除

### 问题：部署超时

**解决方案**：
- 检查网络连接
- 增加超时时间
- 尝试重新部署

### 问题：Shopify CLI 认证失败

**解决方案**：
```bash
shopify auth logout
shopify auth login
```

### 问题：3D 场景不显示

**解决方案**：
- 检查浏览器是否支持 WebGL
- 清除浏览器缓存
- 检查控制台错误信息

### 问题：邮箱弹窗不出现

**解决方案**：
- 检查 localStorage 是否被禁用
- 清除 localStorage 中的 `riot_email_captured` 和 `riot_email_popup_dismissed_at`
- 确保滚动到 45% 位置

### 问题：社交分享链接不工作

**解决方案**：
- 检查 URL 编码是否正确
- 验证折扣码生成逻辑
- 测试各个平台的分享 API

---

## 📈 监控和维护

### 推荐的监控工具

1. **Shopify Analytics**
   - 查看销售数据
   - 监控转化率
   - 分析用户行为

2. **Google Analytics 4**
   - 实时用户数据
   - 页面性能指标
   - 转化漏斗分析

3. **Sentry**（错误追踪）
   - 捕获前端错误
   - 性能监控
   - 用户会话回放

4. **Shopify Web Vitals**
   - Core Web Vitals 指标
   - 页面加载性能
   - 用户体验评分

### 定期检查清单

- [ ] 每周检查销售数据
- [ ] 每周检查错误日志
- [ ] 每月检查性能指标
- [ ] 每月检查用户反馈

---

## 🎉 部署完成！

恭喜！你的 RIOT CROWN Y2K 主题已经成功部署到 Shopify Hydrogen！

### 下一步

1. **配置营销**
   - 设置 TikTok Pixel ID
   - 配置 Meta Pixel
   - 设置 Google Analytics

2. **优化转化**
   - A/B 测试不同的文案
   - 优化邮箱弹窗时机
   - 调整限量倒计时

3. **收集反馈**
   - 监控用户行为
   - 收集客户反馈
   - 持续改进设计

4. **扩展功能**
   - 实现真实 AR 试戴
   - 添加 UGC 照片墙
   - 集成会员系统

---

**部署日期**：2026-05-14
**项目版本**：1.0.0
**状态**：✅ 就绪部署
