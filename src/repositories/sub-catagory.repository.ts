import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {SubCatagory, SubCatagoryRelations, Service} from '../models';
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
