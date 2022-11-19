import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {BusinessSubCatagory, BusinessSubCatagoryRelations} from '../models';

export class BusinessSubCatagoryRepository extends DefaultCrudRepository<
  BusinessSubCatagory,
  typeof BusinessSubCatagory.prototype.id,
  BusinessSubCatagoryRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(BusinessSubCatagory, dataSource);
  }
}
