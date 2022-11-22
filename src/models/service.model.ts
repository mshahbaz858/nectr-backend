import {Entity, hasMany, model, property, referencesMany} from '@loopback/repository';
import {SubService} from './sub-service.model';

@model({settings: {strict: true}})
export class Service extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'number',
  })
  subCatagoryId?: number;

  @hasMany(() => SubService)
  subServices: SubService[];

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  isCustomize: boolean;

  @referencesMany(() => Service)
  serviceIds: number[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Service>) {
    super(data);
  }
}

export interface ServiceRelations {
  // describe navigational properties here
}

export type ServiceWithRelations = Service & ServiceRelations;
