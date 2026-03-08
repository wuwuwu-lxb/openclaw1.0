# 🚀 本地测试指南（新手版）

> 适用系统：**Windows 10/11**  
> 读完大约 10 分钟，全程跟着做就能跑起来 🌸

---

## 📋 目录

1. [第一步：安装 Node.js](#第一步安装-nodejs)
2. [第二步：获取项目代码](#第二步获取项目代码)
3. [第三步：安装项目依赖](#第三步安装项目依赖)
4. [第四步：启动 OpenClaw 网关](#第四步启动-openclaw-网关)
5. [第五步：启动桌面宠物](#第五步启动桌面宠物)
6. [调试技巧](#调试技巧)
7. [常见报错和解决方法](#常见报错和解决方法)

---

## 第一步：安装 Node.js

Node.js 是运行这个项目必须的环境，**一定要先装它**。

### 怎么装

1. 打开浏览器，访问 👉 https://nodejs.org/zh-cn/
2. 点击左边那个大绿按钮「**LTS（长期支持版）**」下载
3. 下载完后双击安装包，一路点「下一步」就行（保持默认选项）
4. 安装过程中有一个页面写「Add to PATH」，**确保它是勾选的**

### 验证安装成功

安装完后，打开**命令提示符**（按 `Win + R`，输入 `cmd`，回车）：

```
node --version
npm --version
```

如果看到类似这样的输出，说明装好了：

```
v20.11.0
10.2.3
```

> 版本号不一样没关系，有数字就行

---

## 第二步：获取项目代码

### 如果你还没有代码

1. 安装 Git：https://git-scm.com/download/win （一路下一步）
2. 打开命令提示符，找一个你想存代码的文件夹，比如桌面：

```cmd
cd %USERPROFILE%\Desktop
git clone https://github.com/wuwuwu-lxb/openclaw1.0.git
```

### 如果已经有代码了

确认你的代码是最新的：

```cmd
cd 你的项目路径\openclaw1.0
git pull
```

---

## 第三步：安装项目依赖

**在命令提示符里**，进入 `desktop-pet` 文件夹并安装依赖：

```cmd
cd %USERPROFILE%\Desktop\openclaw1.0\desktop-pet
npm install
```

这一步会下载很多文件（几百 MB），**需要等几分钟**，看到光标停下来就完成了。

> 如果网络慢，可以换成淘宝镜像：
> ```
> npm install --registry=https://registry.npmmirror.com
> ```

---

## 第四步：启动 OpenClaw 网关

桌面宠物要连接到 OpenClaw 才能聊天。OpenClaw 跑在你的阿里云服务器上，端口是 `18789`。

**你有两种方式让本地的桌面宠物连上它：**

---

### 方式 A：SSH 端口转发（推荐）

这个命令的意思是：把服务器上的 18789 端口「搬」到你本地电脑的 18789 端口。

打开一个新的命令提示符窗口，输入（把 `YOUR_SERVER_IP` 改成你服务器的公网 IP）：

```cmd
ssh -L 18789:127.0.0.1:18789 root@YOUR_SERVER_IP -N
```

- 输入密码后**不要关闭这个窗口**，保持它在后台运行
- 出现「Are you sure...」的提示时输入 `yes` 回车

> **验证是否成功：** 打开浏览器访问 `http://127.0.0.1:18789/`，如果不是"无法访问"就说明通了

---

### 方式 B：直接连服务器（改代码）

如果 SSH 转发太麻烦，可以临时把代码里的地址改成服务器公网 IP。

打开 `desktop-pet/src/main.js`，找到第 6 行，把：

```js
const API_URL = 'http://127.0.0.1:18789/v1/chat/completions';
```

改成（把 `YOUR_SERVER_IP` 替换成你的服务器公网 IP）：

```js
const API_URL = 'http://YOUR_SERVER_IP:18789/v1/chat/completions';
```

> ⚠️ 注意：服务器的 18789 端口必须在云服务商的安全组/防火墙里放开。测试完记得改回来。

---

### 确认 OpenClaw 已运行

SSH 登录到你的服务器，确认 OpenClaw 网关在跑：

```bash
# 检查端口是否在监听
ss -tlnp | grep 18789
# 或者
curl -s http://127.0.0.1:18789/
```

如果没有输出，需要先启动 OpenClaw：

```bash
openclaw gateway
```

---

## 第五步：启动桌面宠物

回到 `desktop-pet` 目录，有两种启动方式：

### 正式模式（干净的窗口）

```cmd
npm start
```

### 开发模式（带调试工具，推荐测试时用）

```cmd
npm run dev
```

启动后会弹出：
- 一个透明聊天窗口（就是桌面宠物本体）
- 一个独立的 DevTools 窗口（开发模式才有，用来看报错）

---

## 调试技巧

### 看报错信息

用 `npm run dev` 启动，会自动打开 **DevTools**：
- **Console（控制台）** 标签：看 JS 报错、加载日志
- **Network（网络）** 标签：看 API 请求有没有发出去，返回什么

### 手动打开 DevTools

如果用 `npm start` 启动后需要调试，请改用 `npm run dev` 启动，它会自动打开独立的 DevTools 窗口。

或者，在 main.js 里把这行改成始终打开：

```js
// 把这行
if (process.argv.includes('--dev-tools')) {
// 改成（直接打开，不判断参数）
if (true) {
```

改完后 `npm start` 也会打开 DevTools，测试完记得改回去。

### 看终端日志

启动后命令提示符里会打印日志：

```
✅ 桌面宠物已启动
📡 API 地址：http://127.0.0.1:18789/v1/chat/completions
```

---

## 常见报错和解决方法

### ❌ `npm: command not found`

Node.js 没装好，重新安装并确保「Add to PATH」是勾选的。

### ❌ `Cannot find module 'electron'`

依赖没装，运行：

```cmd
npm install
```

### ❌ 状态栏显示「OpenClaw 未就绪」

1. 检查服务器上 OpenClaw 是否在运行
2. 检查 SSH 转发那个窗口有没有关掉
3. 检查端口号：`http://127.0.0.1:18789/` 能不能访问

### ❌ 窗口弹出来但是全黑 / 闪退

打开 DevTools 看 Console 里有没有报错。常见原因：
- 缺少 Live2D 模型文件（`assets/live2d/` 目录是否完整）
- CDN 资源加载失败（PixiJS / Live2D 需要联网）

### ❌ Live2D 模型不显示

1. 检查 `assets/live2d/shizuku.model3.json` 文件是否存在
2. 打开 DevTools → Console，看有没有 `❌ 模型加载失败` 的报错
3. 检查网络：PixiJS 和 Live2D Cubism Core 从 CDN 加载，需要能访问 `cdn.jsdelivr.net`

### ❌ `EACCES` / `EPERM` 权限错误（Windows）

以管理员身份运行命令提示符：  
开始菜单 → 搜索 `cmd` → 右键 → **以管理员身份运行**

---

## 🎯 快速验证清单

跑起来后，逐项打勾：

- [ ] 桌面宠物窗口出现（透明背景，右上角有最小化/关闭按钮）
- [ ] 状态栏显示「● 已连接 OpenClaw」（绿色）
- [ ] Live2D 模型（shizuku）显示出来
- [ ] 输入框输入文字并发送，能收到 AI 回复
- [ ] 点击模型会有动作响应

如果以上全部通过，说明本地测试成功了 🌸

---

*如果遇到没提到的问题，把报错截图发给小唔，一起排查。*
