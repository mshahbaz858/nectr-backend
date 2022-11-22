import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Service, SubCatagory, SubCatagoryRelations} from '../models';
import {ServiceRepository} from './service.repository';

export class SubCatagoryRepository extends DefaultCrudRepository<
  SubCatagory,
  typeof SubCatagory.prototype.id,
  SubCatagoryRelations
> {

  public readonly services: HasManyRepositoryFactory<Service, typeof SubCatagory.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>,
  ) {
    super(SubCatagory, dataSource);
    this.services = this.createHasManyRepositoryFactoryFor('services', serviceRepositoryGetter,);
    this.registerInclusionResolver('services', this.services.inclusionResolver);
  }
}
