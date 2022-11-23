import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Business} from './business.model';
import {Service} from './service.model';

@model({settings: {strict: true}})
export class ServiceOffering extends Entity {
  // Define well-known properties here
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

  @belongsTo(() => Service)
  serviceId: number;

  @belongsTo(() => Business)
  businessId: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ServiceOffering>) {
    super(data);
  }
}

export interface ServiceOfferingRelations {
  // describe navigational properties here
}

export type ServiceOfferingWithRelations = ServiceOffering & ServiceOfferingRelations;
