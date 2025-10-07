const fs = require('fs')
const path = require('path')

const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://*",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const profilesPath = path.join(__dirname, 'config', 'build-profiles.json')
const profiles = fs.existsSync(profilesPath)
  ? JSON.parse(fs.readFileSync(profilesPath, 'utf-8'))
  : { default: { disable: [] } }

const profileName =
  process.env.NEXT_BUILD_PROFILE || process.env.NEXT_PUBLIC_BUILD_PROFILE || 'default'
const selectedProfile = profiles[profileName] || profiles.default || { disable: [] }
const disabledModules = Array.isArray(selectedProfile.disable) ? selectedProfile.disable : []

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_PROFILE: profileName,
    NEXT_PUBLIC_DISABLED_MODULES: disabledModules.join(','),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
      preventFullImport: true,
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      preventFullImport: true,
    },
  },
  webpack: (config) => {
    if (!config.resolve.alias) {
      config.resolve.alias = {}
    }

    // Support project-level alias used throughout the codebase
    config.resolve.alias['@'] = path.join(__dirname)

    if (disabledModules.length) {
      disabledModules.forEach((moduleId) => {
        config.resolve.alias[`@modules/${moduleId}`] = path.join(
          __dirname,
          'lib',
          'module-registry',
          'stubs',
          'disabled-module.ts'
        )
      })
    }

    return config
  },
}

module.exports = nextConfig
