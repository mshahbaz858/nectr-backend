import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {SubService, SubServiceRelations} from '../models';

export class SubServiceRepository extends DefaultCrudRepository<
  SubService,
  typeof SubService.prototype.id,
  SubServiceRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(SubService, dataSource);
  }
}
