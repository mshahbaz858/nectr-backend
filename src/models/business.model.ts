import {belongsTo, Entity, model, property} from '@loopback/repository';
import {GeoCoordinate} from '../schema';
import {User} from './user.model';

@model({settings: {strict: true}})
export class Business extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    defaultFn: 'uuid'
  })
  id: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isBusinessLocation: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isClientLocation: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isMenService: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isWomenService: boolean;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'geopoint',
  })
  location?: GeoCoordinate;

  @property({
    type: 'string',
    required: true,
  })
  schedule: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  images: string[];

  @belongsTo(() => User)
  userId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Business>) {
    super(data);
  }
}

export interface BusinessRelations {
  // describe navigational properties here
}

export type BusinessWithRelations = Business & BusinessRelations;
