export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

export const DEFAULT_REGION = {
  latitude: 31.2001,
  longitude: 29.9187,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export function toMapLibreCoord(lat: number, lng: number): [number, number] {
  return [lng, lat]
}

export function fromMapLibreCoord(coord: [number, number]): { latitude: number; longitude: number } {
  return { latitude: coord[1], longitude: coord[0] }
}

export function toGeoJsonPoint(lat: number, lng: number) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Point' as const,
      coordinates: [lng, lat],
    },
  }
}

export function toGeoJsonLineString(coords: Array<{ latitude: number; longitude: number }>) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: coords.map(c => [c.longitude, c.latitude]),
    },
  }
}

export function getZoomLevelForDistance(distanceKm: number): number {
  if (distanceKm <= 1) return 16
  if (distanceKm <= 3) return 14
  if (distanceKm <= 10) return 12
  if (distanceKm <= 50) return 10
  return 8
}

export function calculateRegionToFit(coordinates: Array<{ latitude: number; longitude: number }>) {
  if (coordinates.length === 0) return DEFAULT_REGION
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
  for (const c of coordinates) {
    if (c.latitude < minLat) minLat = c.latitude
    if (c.latitude > maxLat) maxLat = c.latitude
    if (c.longitude < minLng) minLng = c.longitude
    if (c.longitude > maxLng) maxLng = c.longitude
  }
  const latDelta = (maxLat - minLat) * 1.5
  const lngDelta = (maxLng - minLng) * 1.5
  return {
    latitude: (maxLat + minLat) / 2,
    longitude: (maxLng + minLng) / 2,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  }
}
