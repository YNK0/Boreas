/**
 * Server-only PostHog configuration
 * This file should only be imported on the server side
 */

import { POSTHOG_CONFIG } from './posthog-config'

export const getServerPostHog = async () => {
  // Only import on server side
  if (typeof window !== 'undefined') {
    throw new Error('getServerPostHog should only be called on the server side')
  }

  const { PostHog } = await import('posthog-node')

  if (!POSTHOG_CONFIG.serverKey) {
    throw new Error('PostHog server key not configured')
  }

  return new PostHog(
    POSTHOG_CONFIG.serverKey,
    {
      host: POSTHOG_CONFIG.apiHost,
    }
  )
}