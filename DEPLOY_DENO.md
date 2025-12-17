# 部署到 Deno Deploy

本指南将指导你如何将本项目部署到 [Deno Deploy](https://dash.deno.com/)。

## 准备工作

1. 确保你拥有一个 GitHub 账号。
2. 确保本项目已经上传到你的 GitHub 仓库中。

## 部署步骤

1. **登录 Deno Deploy**
   打开 [https://dash.deno.com/](https://dash.deno.com/) 并使用 GitHub 账号登录。

2. **创建新项目**
   - 点击 **"New Project"** 按钮。
   - 在 **"Deploy from GitHub"** 区域，选择你的 GitHub 账号。
   - 搜索并选择本项目所在的仓库 (`Meting-API-master` 或你重命名的名称)。

3. **配置部署选项**
   - **Branch**: 选择 `master` 或 `main` 分支。
   - **Entrypoint File** (入口文件): 选择 `src/deno_index.js`。
     - 注意：不要选择 `src/index.js`，那是给 Node.js 用的。
   - 点击 **"Deploy Project"** 按钮。

4. **这是什么？**
   部署大概需要几秒钟。完成后，你将获得一个类似 `https://your-project-name.deno.dev` 的访问地址。

## 环境变量配置 (可选)

如果你需要配置自定义参数（如端口或其他 API 服务的配置），可以在项目设置中添加环境变量。

1. 进入项目详情页，点击 **"Settings"** -> **"Environment Variables"**。
2. 添加以下变量（根据需要）：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `METING_URL` | API 服务的公网 URL (用于返回 url/pic 等字段) | (自动推导或空) |
| `METING_TOKEN` | 保护 API 的 Token | `token` |
| `METING_COOKIE_NETEASE` | 网易云音乐 Cookie | (无) |
| `METING_COOKIE_TENCENT` | QQ 音乐 Cookie | (无) |

## 测试服务

部署成功后，访问 `https://你的项目域名.deno.dev/demo` 可以看到演示页面。
访问 `https://你的项目域名.deno.dev/api?server=netease&type=search&id=海阔天空` 测试 API。
