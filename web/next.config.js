/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@safe-global/safe-core-sdk', '@safe-global/protocol-kit'],
  output: 'standalone',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig
