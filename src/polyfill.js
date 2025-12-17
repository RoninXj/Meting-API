
// polyfill.js
// 必须在任何其他模块之前加载，以修补 node:crypto 行为

import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

const originalCreateCipheriv = crypto.createCipheriv;
const originalCreateDecipheriv = crypto.createDecipheriv;

// 强制转换为 Uint8Array
function ensureBuffer(input) {
    if (input === null || input === undefined) return input;

    // 如果是字符串，转换为 Buffer (UTF-8)
    if (typeof input === 'string') {
        return Buffer.from(input);
    }

    // 如果已经是 Uint8Array 或 Buffer，尝试重新封装以确保它通过 Deno 检查
    // 使用 Buffer.from(input) 通常是最安全的，因为它处理多种输入类型
    try {
        return Buffer.from(input);
    } catch (e) {
        return input;
    }
}

// 拦截 createCipheriv
crypto.createCipheriv = function (algorithm, key, iv, options) {
    // 打印调试信息，方便看部署日志 (如果还需要调试)
    // console.log(`[Polyfill] createCipheriv algo=${algorithm} keyType=${typeof key} ivType=${typeof iv}`);

    try {
        key = ensureBuffer(key);
        iv = ensureBuffer(iv);

        // 特殊处理：对于 ecb 模式，如果 iv 是空的 Uint8Array(0)，Deno 可能会报错？
        // Node 文档说 ECB 模式 IV 被忽略，但这里最好确保它是符合要求的 Buffer
        if ((!iv || iv.length === 0) && algorithm.toLowerCase().includes('ecb')) {
            iv = Buffer.alloc(0);
        }
    } catch (e) {
        console.warn('[Polyfill] conversion failed', e);
    }
    return originalCreateCipheriv.call(this, algorithm, key, iv, options);
};

// 拦截 createDecipheriv
crypto.createDecipheriv = function (algorithm, key, iv, options) {
    try {
        key = ensureBuffer(key);
        iv = ensureBuffer(iv);
    } catch (e) {
        console.warn('[Polyfill] conversion failed', e);
    }
    return originalCreateDecipheriv.call(this, algorithm, key, iv, options);
};

// 必须确保全局 Buffer 存在，因为很多库依赖它
if (!globalThis.Buffer) {
    globalThis.Buffer = Buffer;
}
if (!globalThis.process) {
    globalThis.process = { env: {}, version: 'v16.0.0' };
}

console.log('[Polyfill] Loaded: crypto & Buffer patched for Deno.');
