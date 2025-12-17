// deno_server.ts
// 假设原项目的 app 实例在 src/app.js 或类似位置导出
// 如果原项目没有导出 app，你需要修改 src/index.js 将 `const app = new Hono()` 这一行改为 `export const app = ...`

import { app } from "./src/index.js"; // 根据实际路径修改

// Deno Deploy 的原生服务入口
Deno.serve(app.fetch);
