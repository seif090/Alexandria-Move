import React, { useRef, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { MapView, Camera, UserLocation, PointAnnotation, ShapeSource, LineLayer, CircleLayer } from '@maplibre/maplibre-react-native'
import { colors } from '../../theme'
import { MAP_STYLE_URL, DEFAULT_REGION, toGeoJsonPoint, toGeoJsonLineString } from '../../services/MapService'

interface PassengerMapViewProps {
  region?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }
  driverLocation?: { latitude: number; longitude: number; heading: number } | null
  pickupLocation?: { latitude: number; longitude: number } | null
  dropoffLocation?: { latitude: number; longitude: number } | null
  routeCoordinates?: Array<{ latitude: number; longitude: number }>
  showsUserLocation?: boolean
  onMapPress?: (e: any) => void
  style?: any
}

export default function PassengerMapView({
  region,
  driverLocation,
  pickupLocation,
  dropoffLocation,
  routeCoordinates,
  showsUserLocation = true,
  onMapPress,
  style,
}: PassengerMapViewProps) {
  const cameraRef = useRef<Camera>(null)

  const defaultRegion = region || DEFAULT_REGION
  const centerCoord: [number, number] = [defaultRegion.longitude, defaultRegion.latitude]

  const driverGeoJson = useMemo(() => {
    if (!driverLocation) return null
    return toGeoJsonPoint(driverLocation.latitude, driverLocation.longitude)
  }, [driverLocation?.latitude, driverLocation?.longitude])

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
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
                lineOpacity: 0.9,
              }}
            />
          </ShapeSource>
        )}

        {driverGeoJson && (
          <ShapeSource id="driver-source" shape={driverGeoJson}>
            <CircleLayer
              id="driver-outer"
              style={{
                circleRadius: 14,
                circleColor: colors.tertiary[500],
                circleOpacity: 0.85,
                circleStrokeWidth: 3,
                circleStrokeColor: colors.white,
              }}
            />
            <CircleLayer
              id="driver-inner"
              style={{
                circleRadius: 6,
                circleColor: colors.white,
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
})
