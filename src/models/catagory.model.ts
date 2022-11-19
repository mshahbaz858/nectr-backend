import {Entity, hasMany, model, property} from '@loopback/repository';
import {SubCatagory} from './sub-catagory.model';

@model({settings: {strict: true}})
export class Catagory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  businessId?: string;

  @hasMany(() => SubCatagory)
  subCatagories: SubCatagory[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Catagory>) {
    super(data);
  }
}

export interface CatagoryRelations {
  // describe navigational properties here
}

export type CatagoryWithRelations = Catagory & CatagoryRelations;
