
// polyfill.js
// 必须在任何其他模块之前加载，以修补 node:crypto 行为

import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

const originalCreateCipheriv = crypto.createCipheriv;
const originalCreateDecipheriv = crypto.createDecipheriv;

// 辅助函数：尝试将任意输入转换为 Uint8Array
function toUint8Array(input) {
    if (input instanceof Uint8Array) return input;
    if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (Array.isArray(input)) return new Uint8Array(input);
    // 处理 Buffer polyfill 对象（即便 instanceof 检查失败）
    if (input && typeof input === 'object' && (input.type === 'Buffer' || input._isBuffer) && input.data) {
        return new Uint8Array(input.data);
    }
    // 字符串处理通常不由这里负责，因为 crypto 需要 buffer
    return input;
}

// 拦截 createCipheriv
crypto.createCipheriv = function (algorithm, key, iv, options) {
    // 确保 key 和 iv 是真正的 TypedArray
    // 注意：Deno 的 node:crypto 实现非常严格
    try {
        key = toUint8Array(key);
        iv = toUint8Array(iv);
    } catch (e) {
        console.warn('Polyfill conversion failed', e);
    }
    return originalCreateCipheriv.call(this, algorithm, key, iv, options);
};

// 拦截 createDecipheriv (以防万一)
crypto.createDecipheriv = function (algorithm, key, iv, options) {
    try {
        key = toUint8Array(key);
        iv = toUint8Array(iv);
    } catch (e) {
        console.warn('Polyfill conversion failed', e);
    }
    return originalCreateDecipheriv.call(this, algorithm, key, iv, options);
};

// 确保全局 Buffer 也是可用的，尽管前面的方案已经尝试过
if (!globalThis.Buffer) {
    globalThis.Buffer = Buffer;
}

console.log('Using crypto polyfill for Deno compatibility.');
