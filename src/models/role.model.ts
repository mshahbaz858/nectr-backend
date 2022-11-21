import {Entity, model, property} from '@loopback/repository';
import {USER_ROLE} from '../schema';

@model({settings: {strict: true}})
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    jsonSchema: {
      enum: Object.values(USER_ROLE)
    }
  })
  id: USER_ROLE;
  @property({
    type: 'string',
    required: true,
  })
  name: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
