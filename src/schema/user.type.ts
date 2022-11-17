import {field, objectType} from '@loopback/graphql';

@objectType({description: 'GeoCoordinate object'})
export class GeoCoordinate {
  @field()
  lat: number;

  @field()
  lng: number;
}
