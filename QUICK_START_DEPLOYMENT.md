# 🚀 手动部署快速开始指南

## 最快的部署方式（3 种选择）

### 方式 1：使用自动化脚本（推荐）⭐

**最简单，只需 2 步！**

#### macOS / Linux

```bash
# 1. 进入项目目录
cd /path/to/riot-crown

# 2. 运行部署脚本
bash deploy.sh
```

#### Windows

```bash
# 1. 进入项目目录
cd C:\path\to\riot-crown

# 2. 运行部署脚本
deploy.bat
```

**脚本会自动：**
- ✅ 检查 Node.js 和 npm
- ✅ 安装 Shopify CLI（如果需要）
- ✅ 认证到 Shopify
- ✅ 安装依赖
- ✅ 运行类型检查
- ✅ 构建项目
- ✅ 提供部署选项

---

### 方式 2：手动部署（详细步骤）

如果你想手动控制每一步，参考 `MANUAL_DEPLOYMENT_GUIDE.md`

---

### 方式 3：快速命令（适合有经验的开发者）

```bash
# 1. 安装 Shopify CLI
npm install -g @shopify/cli

# 2. 认证
shopify auth login

# 3. 链接项目
shopify hydrogen link

# 4. 构建
npm run build

# 5. 部署到预发布
shopify hydrogen deploy

# 6. 提升到生产
shopify hydrogen promote
```

---

## 部署前检查清单

在运行脚本前，请确保：

- [ ] 你有 Shopify 店铺账户
- [ ] 你已安装 Node.js v18+
- [ ] 你已安装 Git
- [ ] 你有网络连接
- [ ] 你有足够的磁盘空间（至少 500MB）

---

## 部署过程中会发生什么

### 第 1-3 步：环境检查
脚本会检查你的系统是否满足要求。

### 第 4 步：Shopify 认证
脚本会打开浏览器让你登录 Shopify 账户。

**按照以下步骤操作：**
1. 输入你的 Shopify 邮箱
2. 输入密码
3. 完成两步验证（如果启用）
4. 授权 Shopify CLI
5. 返回终端，脚本会自动继续

### 第 5-7 步：构建和部署
脚本会自动安装依赖、运行检查、构建项目。

### 第 8 步：选择部署选项

脚本会询问你想要：

**选项 1：部署到预发布环境**
- 用于测试
- 生成预发布 URL
- 可以在生产前验证

**选项 2：提升到生产环境**
- 将最新版本设为生产版本
- 网站立即上线
- 用户可以访问

**选项 3：查看所有版本**
- 显示所有部署版本
- 查看版本信息

**选项 4：回滚到上一个版本**
- 如果出现问题可以回滚
- 选择要回滚的版本 ID

---

## 部署后验证

### 立即检查

1. **访问你的网站**
   ```
   https://riotcrown.shop
   ```

2. **检查首页**
   - [ ] 页面加载正常
   - [ ] 3D 珍珠场景显示
   - [ ] 没有错误信息

3. **测试 3D 交互**
   - [ ] 鼠标可以拖拽旋转
   - [ ] 滚轮不会缩放
   - [ ] 自动旋转正常

4. **测试滚动叙事**
   - [ ] 向下滚动出现三个章节
   - [ ] 文字和动画正常

5. **测试营销功能**
   - [ ] 邮箱弹窗出现
   - [ ] 限量倒计时显示
   - [ ] Bundle 推荐弹窗

### 检查浏览器控制台

按 `F12` 打开开发者工具，检查 Console 标签：
- 不应该有红色错误
- 可能有黄色警告（正常）

---

## 常见问题

### Q: 部署需要多长时间？

A: 通常 5-10 分钟，包括：
- 认证：1-2 分钟
- 安装依赖：2-3 分钟
- 构建：2-3 分钟
- 部署：1-2 分钟

### Q: 我可以在部署前测试吗？

A: 可以！运行：
```bash
npm run dev
```
然后访问 `http://localhost:3000`

### Q: 如果部署失败了怎么办？

A: 
1. 检查错误信息
2. 确保网络连接正常
3. 重新运行脚本
4. 如果还是失败，查看 `MANUAL_DEPLOYMENT_GUIDE.md` 的故障排除部分

### Q: 我可以回滚吗？

A: 可以！选择脚本中的选项 4，或运行：
```bash
shopify hydrogen versions
shopify hydrogen rollback <version-id>
```

### Q: 部署后如何更新网站？

A: 
1. 修改代码
2. 提交到 GitHub
3. 运行脚本重新部署
4. 或者推送到 main 分支让 GitHub Actions 自动部署

---

## 获取帮助

### 查看详细文档

- **手动部署指南**：`MANUAL_DEPLOYMENT_GUIDE.md`
- **部署检查清单**：`DEPLOYMENT_CHECKLIST.md`
- **部署总结**：`DEPLOYMENT_SUMMARY.md`

### 查看日志

如果部署失败，查看详细日志：
```bash
shopify hydrogen deploy --verbose
```

### 联系支持

- Shopify 文档：https://shopify.dev/docs/custom-storefronts/hydrogen
- GitHub Issues：https://github.com/Shopify/hydrogen/issues

---

## 下一步

部署完成后：

1. **配置营销工具**
   - 设置 TikTok Pixel ID
   - 配置 Meta Pixel
   - 设置 Google Analytics

2. **监控性能**
   - 查看 Shopify Analytics
   - 检查 Google Analytics
   - 监控错误日志

3. **优化转化**
   - A/B 测试文案
   - 优化邮箱弹窗
   - 调整限量倒计时

4. **收集反馈**
   - 监控用户行为
   - 收集客户反馈
   - 持续改进

---

## 快速命令参考

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产版本

# 检查
npm run typecheck        # 类型检查
npm run lint             # 代码检查

# 部署
bash deploy.sh           # macOS/Linux 部署脚本
deploy.bat               # Windows 部署脚本

# Shopify CLI
shopify auth login       # 登录 Shopify
shopify hydrogen link    # 链接项目
shopify hydrogen deploy  # 部署到预发布
shopify hydrogen promote # 提升到生产
shopify hydrogen versions # 查看版本
shopify hydrogen rollback # 回滚版本
```

---

## 祝部署顺利！🚀

现在就运行部署脚本开始吧！

```bash
# macOS / Linux
bash deploy.sh

# Windows
deploy.bat
```

有问题？查看 `MANUAL_DEPLOYMENT_GUIDE.md` 获取详细帮助。
