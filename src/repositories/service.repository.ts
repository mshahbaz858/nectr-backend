import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, ReferencesManyAccessor, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Service, ServiceRelations, SubService} from '../models';
import {SubServiceRepository} from './sub-service.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
> {

  public readonly subServices: HasManyRepositoryFactory<SubService, typeof Service.prototype.id>;

  public readonly services: ReferencesManyAccessor<Service, typeof Service.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SubServiceRepository') protected subServiceRepositoryGetter: Getter<SubServiceRepository>, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>,
  ) {
    super(Service, dataSource);
    this.services = this.createReferencesManyAccessorFor('services', serviceRepositoryGetter,);
    this.registerInclusionResolver('services', this.services.inclusionResolver);
    this.subServices = this.createHasManyRepositoryFactoryFor('subServices', subServiceRepositoryGetter,);
    this.registerInclusionResolver('subServices', this.subServices.inclusionResolver);
  }
}
