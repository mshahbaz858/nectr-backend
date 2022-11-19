import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {BusinessService, BusinessServiceRelations} from '../models';

export class BusinessServiceRepository extends DefaultCrudRepository<
  BusinessService,
  typeof BusinessService.prototype.id,
  BusinessServiceRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(BusinessService, dataSource);
  }
}
