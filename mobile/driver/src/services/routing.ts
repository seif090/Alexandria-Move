import api from './api'

export interface RouteResult {
  coordinates: Array<{ latitude: number; longitude: number }>
  distanceKm: number
  durationMinutes: number
  geometry: string
}

export async function getRoute(
  originLat: number, originLng: number,
  destLat: number, destLng: number
): Promise<RouteResult | null> {
  try {
    const res = await api.get('/location/route', {
      params: { originLat, originLng, destLat, destLng },
    })
    return res.data.data || null
  } catch {
    return fallbackGetRoute(originLat, originLng, destLat, destLng)
  }
}

export async function getDistanceDuration(
  originLat: number, originLng: number,
  destLat: number, destLng: number
): Promise<{ distanceKm: number; durationMinutes: number }> {
  try {
    const res = await api.get('/location/distance', {
      params: { originLat, originLng, destLat, destLng },
    })
    return res.data.data || { distanceKm: 0, durationMinutes: 0 }
  } catch {
    return fallbackGetDistanceDuration(originLat, originLng, destLat, destLng)
  }
}

async function fallbackGetRoute(
  originLat: number, originLng: number,
  destLat: number, destLng: number
): Promise<RouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=false`
    const res = await fetch(url)
    const data = await res.json()
    if (data.code !== 'Ok') return null
    const route = data.routes[0]
    const coords = route.geometry.coordinates.map((c: number[]) => ({
      latitude: c[1],
      longitude: c[0],
    }))
    return {
      coordinates: coords,
      distanceKm: Math.round(route.distance / 1000 * 100) / 100,
      durationMinutes: Math.round(route.duration / 60 * 100) / 100,
      geometry: JSON.stringify(route.geometry),
    }
  } catch { return null }
}

async function fallbackGetDistanceDuration(
  originLat: number, originLng: number,
  destLat: number, destLng: number
): Promise<{ distanceKm: number; durationMinutes: number }> {
  const dist = haversine(originLat, originLng, destLat, destLng)
  return {
    distanceKm: Math.round(dist * 100) / 100,
    durationMinutes: Math.round(dist / 40 * 60 * 100) / 100,
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
