import webpush from 'web-push'

export interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

export type PushSubscriptionJSON = {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

/**
 * Returns false when the subscription is gone (410/404) so the caller can delete it.
 * VAPID details are initialized lazily so the module can be imported during build
 * without requiring the env vars to be present at that point.
 */
export async function sendPush(
  subscription: PushSubscriptionJSON,
  payload: PushPayload
): Promise<boolean> {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  try {
    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      JSON.stringify(payload)
    )
    return true
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      return false
    }
    console.error('Push send error:', err?.message)
    return true
  }
}
