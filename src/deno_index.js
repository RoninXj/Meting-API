// 手动修复 Deno Buffer 兼容性问题
import { Buffer } from 'node:buffer'

// HACK: 强制让 Buffer 实例在 Deno 中被识别为 Uint8Array 的子类
// 这是解决 Deno node:crypto 模块报错 "expected typed ArrayBufferView" 的关键
const originalBufferFrom = Buffer.from
Buffer.from = function (...args) {
  const buf = originalBufferFrom.apply(this, args)
  Object.setPrototypeOf(buf, Uint8Array.prototype)
  return buf
}
globalThis.Buffer = Buffer

import { Hono } from 'hono'
import { cors } from 'hono/cors'
// 移除 Node 专用适配器
// import { serve } from '@hono/node-server'
// import { createServer } from 'node:https'
// import { readFileSync } from 'node:fs'

import { requestLogger, logger } from './middleware/logger.js'
import errors from './middleware/errors.js'
import apiService from './service/api.js'
import demoService from './service/demo.js'
import config from './config.js'

const app = new Hono()
  .use(requestLogger)
  .use(cors())
  .use(errors)

app.get(`${config.http.prefix}/api`, apiService)
app.get(`${config.http.prefix}/demo`, demoService)

// 获取端口配置
const port = Number(config.http.port) || 8000

logger.info({ port }, 'Deno HTTP server started')

// --- 修改点：使用 Deno 原生服务 ---

// 方式 1: 适配 Deno Deploy 或 "deno serve" 命令 (推荐)
export default {
  port: port,
  fetch: app.fetch
}

// 方式 2: 适配 "deno run" 直接运行 (向下兼容)
if (import.meta.main) {
  Deno.serve({ port }, app.fetch)
}
