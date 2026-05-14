# 🚀 Shopify Hydrogen 手动部署完整指南

## 前置要求

在开始部署前，请确保你已经有：

1. **Shopify 店铺**
   - 店铺域名：`dkgv9c-tv.myshopify.com`
   - Storefront API Token：`2b101a6cd010cbe957d55d0139c0ac5e`

2. **Node.js 和 npm**
   ```bash
   node --version  # 应该是 v18 或更高
   npm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

---

## 步骤 1：安装 Shopify CLI

### 在 macOS 上安装

```bash
# 使用 Homebrew
brew tap shopify/shopify
brew install shopify-cli

# 或者使用 npm
npm install -g @shopify/cli
```

### 在 Windows 上安装

```bash
# 使用 npm
npm install -g @shopify/cli

# 或者下载安装程序
# https://github.com/Shopify/cli/releases
```

### 在 Linux 上安装

```bash
# 使用 npm
npm install -g @shopify/cli
```

### 验证安装

```bash
shopify --version
```

应该输出类似：`Shopify CLI 3.72.0`

---

## 步骤 2：Shopify CLI 认证

### 登录到你的 Shopify 账户

```bash
shopify auth login
```

这会打开一个浏览器窗口，让你登录到 Shopify 账户。

**按照以下步骤操作：**

1. 在浏览器中输入你的 Shopify 账户邮箱
2. 输入密码
3. 完成两步验证（如果启用了）
4. 授权 Shopify CLI 访问你的账户
5. 返回终端，CLI 会自动完成认证

### 验证认证

```bash
shopify auth whoami
```

应该输出你的 Shopify 账户信息。

---

## 步骤 3：链接到你的 Hydrogen 项目

### 进入项目目录

```bash
cd /path/to/riot-crown
```

### 链接到你的店铺

```bash
shopify hydrogen link
```

**按照提示操作：**

1. 选择你的店铺：`dkgv9c-tv.myshopify.com`
2. 选择或创建一个 Hydrogen 部署环境
3. 确认链接

### 验证链接

```bash
shopify hydrogen info
```

应该显示你的店铺和项目信息。

---

## 步骤 4：本地测试（可选但推荐）

在部署前，建议先在本地测试一下：

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

访问 `http://localhost:3000` 验证功能是否正常。

按 `Ctrl+C` 停止开发服务器。

---

## 步骤 5：构建项目

```bash
npm run build
```

这会生成生产版本的代码。

**检查构建输出：**
- 应该看到 `✓ built in X.XXs`
- 不应该有错误信息

---

## 步骤 6：部署到 Shopify Hydrogen

### 部署到预发布环境

```bash
shopify hydrogen deploy
```

**部署过程：**

1. CLI 会上传你的代码到 Shopify
2. 显示部署进度
3. 完成后会输出预发布 URL

**输出示例：**
```
✓ Deployment successful!
Preview URL: https://hydrogen-preview-xxxxx.shopifycloud.com
```

### 验证预发布环境

在浏览器中打开预发布 URL，验证：
- [ ] 首页加载正常
- [ ] 3D 场景显示正确
- [ ] 功能正常工作
- [ ] 没有错误信息

---

## 步骤 7：提升到生产环境

### 查看所有部署版本

```bash
shopify hydrogen versions
```

会显示所有部署版本的列表。

### 提升最新版本到生产

```bash
shopify hydrogen promote
```

**按照提示操作：**

1. 选择要提升的版本（通常是最新的）
2. 确认提升到生产环境

**输出示例：**
```
✓ Version promoted to production!
Production URL: https://riotcrown.shop
```

---

## 步骤 8：验证生产环境

### 访问你的网站

打开 `https://riotcrown.shop`（或你的自定义域名）

### 完整的验证清单

**首页检查**
- [ ] 页面加载正常
- [ ] 3D 珍珠场景显示
- [ ] "RIOT CROWN" 标题可见
- [ ] 滚动指示器可见

**3D 交互检查**
- [ ] 鼠标可以拖拽旋转
- [ ] 滚轮不会缩放
- [ ] 自动旋转正常
- [ ] 粒子系统运行

**滚动叙事检查**
- [ ] 向下滚动出现三个章节
- [ ] 文字和动画正常
- [ ] 多语言切换正常

**营销功能检查**
- [ ] 邮箱弹窗出现
- [ ] 限量倒计时显示
- [ ] 库存进度条更新
- [ ] Bundle 推荐弹窗

**产品页检查**
- [ ] 产品页加载正常
- [ ] 3D 模型显示
- [ ] 材质切换正常
- [ ] Wishlist 按钮可用

**性能检查**
- [ ] 首页加载 < 3 秒
- [ ] 没有控制台错误
- [ ] 没有网络请求失败

---

## 常见问题和解决方案

### Q: 部署时出现 "Authentication failed" 错误

**解决方案：**
```bash
shopify auth logout
shopify auth login
```

重新认证后再试。

### Q: 部署超时

**解决方案：**
```bash
# 增加超时时间
shopify hydrogen deploy --timeout 600
```

### Q: 3D 场景在生产环境不显示

**解决方案：**
1. 清除浏览器缓存
2. 检查浏览器是否支持 WebGL
3. 查看浏览器控制台错误信息

### Q: 邮箱弹窗不出现

**解决方案：**
1. 清除 localStorage：
   ```javascript
   // 在浏览器控制台运行
   localStorage.removeItem('riot_email_captured');
   localStorage.removeItem('riot_email_popup_dismissed_at');
   ```
2. 刷新页面
3. 向下滚动到 45% 位置

### Q: 社交分享链接不工作

**解决方案：**
1. 检查 URL 是否正确
2. 验证折扣码生成
3. 测试各个平台的分享 API

### Q: 如何回滚到上一个版本？

**解决方案：**
```bash
# 查看所有版本
shopify hydrogen versions

# 回滚到指定版本
shopify hydrogen rollback <version-id>
```

---

## 部署后的下一步

### 1. 配置营销工具

```bash
# 设置 TikTok Pixel ID
export TIKTOK_PIXEL_ID=your_pixel_id

# 设置 Meta Pixel ID
export META_PIXEL_ID=your_pixel_id

# 设置 Google Analytics
export GOOGLE_GA_ID=G-XXXXXXXXXX
```

### 2. 监控性能

- 使用 Shopify Analytics 查看销售数据
- 使用 Google Analytics 4 查看用户行为
- 使用 Sentry 追踪错误

### 3. 优化转化

- A/B 测试营销文案
- 优化邮箱弹窗时机
- 调整限量倒计时

### 4. 收集反馈

- 监控用户行为
- 收集客户反馈
- 持续改进设计

---

## 快速参考命令

```bash
# 认证
shopify auth login
shopify auth logout
shopify auth whoami

# 项目管理
shopify hydrogen link
shopify hydrogen info
shopify hydrogen unlink

# 部署
shopify hydrogen deploy          # 部署到预发布
shopify hydrogen promote         # 提升到生产
shopify hydrogen versions        # 查看所有版本
shopify hydrogen rollback <id>   # 回滚到指定版本

# 本地开发
npm run dev                       # 启动开发服务器
npm run build                     # 构建生产版本
npm run preview                   # 预览生产版本
npm run typecheck                 # 类型检查
npm run lint                      # 代码检查
```

---

## 故障排除

### 如果部署失败

1. **检查日志**
   ```bash
   shopify hydrogen deploy --verbose
   ```

2. **检查本地构建**
   ```bash
   npm run build
   ```

3. **检查环境变量**
   ```bash
   echo $PUBLIC_STORE_DOMAIN
   echo $PUBLIC_STOREFRONT_API_TOKEN
   ```

4. **重新认证**
   ```bash
   shopify auth logout
   shopify auth login
   ```

### 如果网站不可访问

1. 检查 DNS 配置
2. 检查 Shopify 店铺设置
3. 检查防火墙规则
4. 联系 Shopify 支持

---

## 获取帮助

- **Shopify Hydrogen 文档**：https://shopify.dev/docs/custom-storefronts/hydrogen
- **Shopify CLI 文档**：https://shopify.dev/docs/api/admin-rest/2024-01/resources/shop
- **GitHub Issues**：https://github.com/Shopify/hydrogen/issues
- **Shopify 社区**：https://community.shopify.com

---

## 总结

部署步骤总结：

1. ✅ 安装 Shopify CLI
2. ✅ 认证到 Shopify 账户
3. ✅ 链接到 Hydrogen 项目
4. ✅ 本地测试（可选）
5. ✅ 构建项目
6. ✅ 部署到预发布环境
7. ✅ 验证预发布环境
8. ✅ 提升到生产环境
9. ✅ 验证生产环境

**预计总耗时**：30-45 分钟

祝部署顺利！🚀
