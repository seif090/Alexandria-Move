import React, { useRef, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MapView, Camera, UserLocation, PointAnnotation, ShapeSource, LineLayer, CircleLayer } from '@maplibre/maplibre-react-native'
import { colors } from '../../theme'
import { MAP_STYLE_URL, DEFAULT_REGION, toGeoJsonPoint, toGeoJsonLineString } from '../../services/MapService'

interface DriverMapViewProps {
  region?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }
  pickupLocation?: { latitude: number; longitude: number } | null
  dropoffLocation?: { latitude: number; longitude: number } | null
  stops?: Array<{ latitude: number; longitude: number; label: string }>
  routeCoordinates?: Array<{ latitude: number; longitude: number }>
  showsUserLocation?: boolean
  onMapPress?: (e: any) => void
  style?: any
}

export default function DriverMapView({
  region,
  pickupLocation,
  dropoffLocation,
  stops,
  routeCoordinates,
  showsUserLocation = true,
  onMapPress,
  style,
}: DriverMapViewProps) {
  const cameraRef = useRef<Camera>(null)

  const defaultRegion = region || DEFAULT_REGION
  const centerCoord: [number, number] = [defaultRegion.longitude, defaultRegion.latitude]

  const pickupGeoJson = useMemo(() => {
    if (!pickupLocation) return null
    return toGeoJsonPoint(pickupLocation.latitude, pickupLocation.longitude)
  }, [pickupLocation?.latitude, pickupLocation?.longitude])

  const dropoffGeoJson = useMemo(() => {
    if (!dropoffLocation) return null
    return toGeoJsonPoint(dropoffLocation.latitude, dropoffLocation.longitude)
  }, [dropoffLocation?.latitude, dropoffLocation?.longitude])

  const routeGeoJson = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) return null
    return toGeoJsonLineString(routeCoordinates)
  }, [routeCoordinates])

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        styleURL={MAP_STYLE_URL}
        onPress={onMapPress}
        attributionEnabled={true}
        logoEnabled={false}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: centerCoord,
            zoomLevel: defaultRegion.latitudeDelta < 0.02 ? 15 : 13,
          }}
        />

        {showsUserLocation && <UserLocation renderMode="native" visible={true} />}

        {routeGeoJson && (
          <ShapeSource id="route-source" shape={routeGeoJson}>
            <LineLayer
              id="route-line"
              style={{
                lineColor: colors.primary[500],
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
                lineOpacity: 0.9,
              }}
            />
          </ShapeSource>
        )}

        {pickupGeoJson && (
          <PointAnnotation
            id="pickup-annotation"
            coordinate={[pickupLocation!.longitude, pickupLocation!.latitude]}
          >
            <View style={styles.pickupMarker}>
              <View style={styles.pickupInner} />
            </View>
          </PointAnnotation>
        )}

        {dropoffGeoJson && (
          <PointAnnotation
            id="dropoff-annotation"
            coordinate={[dropoffLocation!.longitude, dropoffLocation!.latitude]}
          >
            <View style={styles.dropoffMarker}>
              <View style={styles.dropoffInner} />
            </View>
          </PointAnnotation>
        )}

        {stops?.map((stop, index) => (
          <PointAnnotation
            key={`stop-${index}`}
            id={`stop-${index}`}
            coordinate={[stop.longitude, stop.latitude]}
          >
            <View style={styles.stopMarker}>
              <Text style={styles.stopMarkerText}>{index + 1}</Text>
            </View>
          </PointAnnotation>
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  pickupMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  pickupInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  dropoffMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  dropoffInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  stopMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.tertiary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  stopMarkerText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
})
