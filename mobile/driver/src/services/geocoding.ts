import api from './api'

export interface GeocodingResult {
  latitude: number
  longitude: number
  displayName: string
  street: string
  city: string
  area: string
  country: string
  type: string
}

export async function searchPlaces(query: string, limit = 5): Promise<GeocodingResult[]> {
  try {
    const res = await api.get('/location/geocode/search', { params: { q: query, limit } })
    return res.data.data || []
  } catch {
    return fallbackSearchPlaces(query, limit)
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null> {
  try {
    const res = await api.get('/location/geocode/reverse', { params: { lat: latitude, lng: longitude } })
    return res.data.data || null
  } catch {
    return fallbackReverseGeocode(latitude, longitude)
  }
}

async function fallbackSearchPlaces(query: string, limit: number): Promise<GeocodingResult[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${limit}`
    const res = await fetch(url, { headers: { 'User-Agent': 'AlexandriaMobility/1.0' } })
    const data = await res.json()
    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      displayName: item.display_name || '',
      street: item.address?.road || item.address?.pedestrian || '',
      city: item.address?.city || item.address?.town || item.address?.village || '',
      area: item.address?.suburb || item.address?.district || '',
      country: item.address?.country || '',
      type: item.type || 'unknown',
    }))
  } catch { return [] }
}

async function fallbackReverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'AlexandriaMobility/1.0' } })
    const data = await res.json()
    if (!data.lat) return null
    return {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      displayName: data.display_name || '',
      street: data.address?.road || data.address?.pedestrian || '',
      city: data.address?.city || data.address?.town || data.address?.village || '',
      area: data.address?.suburb || data.address?.district || '',
      country: data.address?.country || '',
      type: data.type || 'unknown',
    }
  } catch { return null }
}
