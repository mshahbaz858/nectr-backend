import {belongsTo, Entity, model, property} from '@loopback/repository';
import {GeoCoordinate} from '../schema';
import {User} from './user.model';

@model({settings: {strict: true}})
export class Business extends Entity {
  @property({
    type: 'string',
    id: true,
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
    required: true,
  })
  location: GeoCoordinate;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      type: 'object',
      patternProperties: {
        "MONDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        },
        "TUESDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        },
        "WEDNESDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        },
        "THURSDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        },
        "FRIDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        },
        "SATURDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        },
        "SUNDAY": {
          type: 'object',
          patternProperties: {
            "startTime": {
              type: 'number',
            },
            "endTime": {
              type: 'number',
            },
          }
        }
      },
      required: []
    }
  })
  schedule: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  images?: string[];

  @belongsTo(() => User)
  userId: string;
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
