# desktop-pet/lib — 第三方库文件目录

此目录存放 Live2D 渲染所需的第三方 JavaScript 库。

## 文件列表

| 文件 | 来源 | 说明 |
|------|------|------|
| `pixi.min.js` | [cdn.jsdelivr.net](https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js) | PixiJS v6.5.10 浏览器构建 |
| `live2dcubismcore.min.js` | [cubism.live2d.com](https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js) | Live2D Cubism Core SDK |
| `pixi-live2d-display.min.js` | npm (已包含) | pixi-live2d-display v0.4.0 |

## 自动获取

运行 npm install 后会自动执行 `scripts/download-libs.sh` 下载所需文件。

也可以手动执行：

```bash
sh scripts/download-libs.sh
```

## 手动下载 pixi.js

```bash
curl -L "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js" -o lib/pixi.min.js
# 或
wget "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js" -O lib/pixi.min.js
```

## 手动下载 live2dcubismcore.min.js

`live2dcubismcore.min.js` 是 Live2D Inc. 的官方 SDK，受版权保护，**不随本项目分发**。

请阅读许可证后自行下载：
- 许可证：https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html
- 下载地址：https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js

```bash
curl -L "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" -o lib/live2dcubismcore.min.js
```

## 为什么需要本地化？

CDN（`cdn.jsdelivr.net`、`cubism.live2d.com`）在国内网络环境下访问不稳定，
将依赖本地化可以避免因网络问题导致 Live2D 模型无法渲染。
