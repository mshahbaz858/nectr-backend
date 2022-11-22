import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class BusinessService extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  businessId?: string;

  @property({
    type: 'number',
  })
  serviceId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BusinessService>) {
    super(data);
  }
}

export interface BusinessServiceRelations {
  // describe navigational properties here
}

export type BusinessServiceWithRelations = BusinessService & BusinessServiceRelations;
