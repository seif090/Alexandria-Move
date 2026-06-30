import { useEffect } from 'react'
import { Linking } from 'react-native'

type DeepLinkHandler = (params: Record<string, string>) => void

export function useDeepLinking(handler: DeepLinkHandler) {
  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return
      const parsed = parseDeepLink(url)
      if (parsed) handler(parsed)
    }

    Linking.getInitialURL().then(handleUrl)

    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url)
    })

    return () => subscription.remove()
  }, [handler])
}

function parseDeepLink(url: string): Record<string, string> | null {
  const params: Record<string, string> = {}

  if (url.includes('invitation/')) {
    const token = url.split('invitation/')[1]?.split('?')[0]
    if (token) params.invitationToken = token
    return params
  }

  if (url.includes('community/')) {
    const id = url.split('community/')[1]?.split('?')[0]
    if (id) params.communityId = id
    return params
  }

  if (url.includes('booking/')) {
    const id = url.split('booking/')[1]?.split('?')[0]
    if (id) params.bookingId = id
    return params
  }

  return Object.keys(params).length > 0 ? params : null
}

export const deepLinkSchemes = {
  passenger: 'alexandria-passenger://',
  driver: 'alexandria-driver://',
}
