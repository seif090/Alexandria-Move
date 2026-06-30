declare module '@maplibre/maplibre-react-native' {
  import React from 'react'
  import { ViewProps, StyleProp, ViewStyle } from 'react-native'

  export interface MapViewProps extends ViewProps {
    styleURL?: string
    style?: StyleProp<ViewStyle>
    onPress?: (e: any) => void
    attributionEnabled?: boolean
    logoEnabled?: boolean
    compassEnabled?: boolean
    compassFadeWhenNorth?: boolean
    surfaceView?: boolean
  }

  export class MapView extends React.Component<MapViewProps> {}

  export interface CameraProps {
    ref?: React.Ref<Camera>
    defaultSettings?: {
      centerCoordinate?: [number, number]
      zoomLevel?: number
      pitch?: number
      heading?: number
    }
    centerCoordinate?: [number, number]
    zoomLevel?: number
    minZoomLevel?: number
    maxZoomLevel?: number
    animationDuration?: number
    animationMode?: 'flyTo' | 'easeTo' | 'moveTo'
    followUserLocation?: boolean
    followZoomLevel?: number
    followUserMode?: 'normal' | 'compass' | 'course'
    pitch?: number
    heading?: number
  }

  export class Camera extends React.Component<CameraProps> {}

  export interface UserLocationProps {
    visible?: boolean
    renderMode?: 'normal' | 'native'
    showsUserHeadingIndicator?: boolean
  }

  export class UserLocation extends React.Component<UserLocationProps> {}

  export interface PointAnnotationProps {
    id: string
    coordinate: [number, number]
    anchor?: { x: number; y: number }
    children?: React.ReactNode
  }

  export class PointAnnotation extends React.Component<PointAnnotationProps> {}

  export interface ShapeSourceProps {
    id: string
    shape: any
    children?: React.ReactNode
    cluster?: boolean
    clusterRadius?: number
    clusterMaxZoom?: number
  }

  export class ShapeSource extends React.Component<ShapeSourceProps> {}

  export interface LineLayerProps {
    id: string
    style?: {
      lineCap?: 'butt' | 'round' | 'square'
      lineColor?: string
      lineDashPattern?: number[]
      lineJoin?: 'bevel' | 'round' | 'miter'
      lineOpacity?: number
      lineWidth?: number
      lineOffset?: number
      lineBlur?: number
    }
    aboveLayerID?: string
    belowLayerID?: string
    layerIndex?: number
  }

  export class LineLayer extends React.Component<LineLayerProps> {}

  export interface CircleLayerProps {
    id: string
    style?: {
      circleRadius?: number
      circleColor?: string
      circleOpacity?: number
      circleStrokeWidth?: number
      circleStrokeColor?: string
      circleBlur?: number
    }
    aboveLayerID?: string
    belowLayerID?: string
    layerIndex?: number
  }

  export class CircleLayer extends React.Component<CircleLayerProps> {}

  export interface SymbolLayerProps {
    id: string
    style?: {
      iconImage?: string
      iconSize?: number
      iconColor?: string
      iconOpacity?: number
      iconRotate?: number
      textField?: string
      textSize?: number
      textColor?: string
      textOffset?: [number, number]
      iconAllowOverlap?: boolean
      textAllowOverlap?: boolean
    }
    aboveLayerID?: string
    belowLayerID?: string
    layerIndex?: number
  }

  export class SymbolLayer extends React.Component<SymbolLayerProps> {}

  export interface ImagesProps {
    images: { [key: string]: any }
  }

  export class Images extends React.Component<ImagesProps> {}
}
