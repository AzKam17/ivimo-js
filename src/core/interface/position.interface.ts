import { t } from "elysia";

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

export const GeometrySchema = t.Object({
  type: t.Union([
    t.Literal('Point'),
    t.Literal('MultiPoint'),
    t.Literal('LineString'),
    t.Literal('MultiLineString'),
    t.Literal('Polygon'),
    t.Literal('MultiPolygon'),
    t.Literal('GeometryCollection'),
    t.Literal('Feature'),
    t.Literal('FeatureCollection'),
    t.Literal('GeometryObject'),
    t.Literal('GeometryObject[]'),
  ]),
  coordinates: t.Array(t.Number())
});