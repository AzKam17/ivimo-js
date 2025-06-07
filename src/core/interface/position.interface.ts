
export interface IPosition {
  latitude: number;
  longitude: number;
}

export interface IGeometry {
  type:
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeometryCollection'
    | 'Feature'
    | 'FeatureCollection'
    | 'GeometryObject'
    | 'GeometryObject[]';
  coordinates: number[];
}
