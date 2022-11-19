import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class BusinessCatagory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  _businessId?: string;

  @property({
    type: 'number',
  })
  _catagoryId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BusinessCatagory>) {
    super(data);
  }
}

export interface BusinessCatagoryRelations {
  // describe navigational properties here
}

export type BusinessCatagoryWithRelations = BusinessCatagory & BusinessCatagoryRelations;
