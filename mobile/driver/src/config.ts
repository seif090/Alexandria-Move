const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'

export const config = {
  apiUrl: API_URL,
  apiBaseUrl: `${API_URL}/api`,
  signalrUrl: `${API_URL}/hubs`,
  mapStyleUrl: process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty',
  osrmBaseUrl: process.env.EXPO_PUBLIC_OSRM_URL || 'https://router.project-osrm.org',
  nominatimBaseUrl: process.env.EXPO_PUBLIC_NOMINATIM_URL || 'https://nominatim.openstreetmap.org',
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
}
