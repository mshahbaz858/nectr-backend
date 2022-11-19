import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class BusinessSubCatagory extends Entity {
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
  subCatagoryId?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BusinessSubCatagory>) {
    super(data);
  }
}

export interface BusinessSubCatagoryRelations {
  // describe navigational properties here
}

export type BusinessSubCatagoryWithRelations = BusinessSubCatagory & BusinessSubCatagoryRelations;
