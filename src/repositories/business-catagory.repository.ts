import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {BusinessCatagory, BusinessCatagoryRelations} from '../models';

export class BusinessCatagoryRepository extends DefaultCrudRepository<
  BusinessCatagory,
  typeof BusinessCatagory.prototype.id,
  BusinessCatagoryRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(BusinessCatagory, dataSource);
  }
}
