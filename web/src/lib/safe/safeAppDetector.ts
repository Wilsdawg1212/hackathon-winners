import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'

export interface SafeAppInfo {
  safeAddress: string
  chainId: number
  owners: string[]
  threshold: number
  isReadOnly: boolean
}

export class SafeAppDetector {
  private sdk?: SafeAppsSDK
  private provider?: SafeAppProvider
  private isInitialized = false

  async initialize(): Promise<boolean> {
    try {
      // Check if we're running in a Safe App environment
      if (typeof window === 'undefined' || !window.parent) {
        return false
      }

      // Initialize Safe Apps SDK
      this.sdk = new SafeAppsSDK({
        allowedDomains: [window.location.hostname],
        debug: process.env.NODE_ENV === 'development',
      })

      // Try to get Safe info
      const safeInfo = await this.sdk.safe.getInfo()
      
      if (!safeInfo.safeAddress || !safeInfo.chainId) {
        return false
      }

      // Create Safe App Provider
      this.provider = new SafeAppProvider(safeInfo, this.sdk)
      this.isInitialized = true

      return true
    } catch (error) {
      console.log('Safe App not detected:', error)
      return false
    }
  }

  async getSafeInfo(): Promise<SafeAppInfo | null> {
    if (!this.isInitialized || !this.sdk) {
      return null
    }

    try {
      const safeInfo = await this.sdk.safe.getInfo()
      return {
        safeAddress: safeInfo.safeAddress,
        chainId: Number(safeInfo.chainId),
        owners: safeInfo.owners,
        threshold: safeInfo.threshold,
        isReadOnly: safeInfo.isReadOnly,
      }
    } catch (error) {
      console.error('Failed to get Safe info:', error)
      return null
    }
  }

  getProvider(): SafeAppProvider | undefined {
    return this.provider
  }

  getSDK(): SafeAppsSDK | undefined {
    return this.sdk
  }

  isConnected(): boolean {
    return this.isInitialized && !!this.provider
  }
}

// Global instance
let safeAppDetector: SafeAppDetector | null = null

export function getSafeAppDetector(): SafeAppDetector {
  if (!safeAppDetector) {
    safeAppDetector = new SafeAppDetector()
  }
  return safeAppDetector
}
