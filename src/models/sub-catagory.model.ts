import {Entity, hasMany, model, property} from '@loopback/repository';
import {Service} from './service.model';

@model({settings: {strict: true}})
export class SubCatagory extends Entity {
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
    type: 'number',
  })
  catagoryId?: number;

  @hasMany(() => Service)
  services: Service[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SubCatagory>) {
    super(data);
  }
}

export interface SubCatagoryRelations {
  // describe navigational properties here
}

export type SubCatagoryWithRelations = SubCatagory & SubCatagoryRelations;
