import dotenv from 'dotenv'

dotenv.config()

const toBoolean = value => {
  if (value === undefined) return false
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
}

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const getEnv = (key) => {
  if (typeof Deno !== 'undefined') {
    return Deno.env.get(key)
  }
  if (typeof process !== 'undefined') {
    return process.env[key]
  }
  return undefined
}

export default {
  http: {
    prefix: getEnv('HTTP_PREFIX') || '',
    port: toNumber(getEnv('HTTP_PORT'), 80)
  },
  https: {
    enabled: toBoolean(getEnv('HTTPS_ENABLED')),
    port: toNumber(getEnv('HTTPS_PORT'), 443),
    keyPath: getEnv('SSL_KEY_PATH') || '',
    certPath: getEnv('SSL_CERT_PATH') || ''
  },
  meting: {
    url: getEnv('METING_URL') || '',
    token: getEnv('METING_TOKEN') || 'token',
    cookie: {
      allowHosts: getEnv('METING_COOKIE_ALLOW_HOSTS')
        ? (getEnv('METING_COOKIE_ALLOW_HOSTS')).split(',').map(h => h.trim().toLowerCase())
        : []
    }
  }
}
