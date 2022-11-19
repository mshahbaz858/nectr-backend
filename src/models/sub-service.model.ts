import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class SubService extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'number',
  })
  price: number;

  @property({
    type: 'number',
  })
  serviceId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SubService>) {
    super(data);
  }
}

export interface SubServiceRelations {
  // describe navigational properties here
}

export type SubServiceWithRelations = SubService & SubServiceRelations;
