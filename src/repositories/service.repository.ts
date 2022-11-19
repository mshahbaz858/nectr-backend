import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Service, ServiceRelations, SubService} from '../models';
import {SubServiceRepository} from './sub-service.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
> {

  public readonly subServices: HasManyRepositoryFactory<SubService, typeof Service.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SubServiceRepository') protected subServiceRepositoryGetter: Getter<SubServiceRepository>,
  ) {
    super(Service, dataSource);
    this.subServices = this.createHasManyRepositoryFactoryFor('subServices', subServiceRepositoryGetter,);
    this.registerInclusionResolver('subServices', this.subServices.inclusionResolver);
  }
}
