import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {ServiceOffering, ServiceOfferingRelations, Service, Business} from '../models';
import {ServiceRepository} from './service.repository';
import {BusinessRepository} from './business.repository';

export class ServiceOfferingRepository extends DefaultCrudRepository<
  ServiceOffering,
  typeof ServiceOffering.prototype.id,
  ServiceOfferingRelations
> {

  public readonly service: BelongsToAccessor<Service, typeof ServiceOffering.prototype.id>;

  public readonly business: BelongsToAccessor<Business, typeof ServiceOffering.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>, @repository.getter('BusinessRepository') protected businessRepositoryGetter: Getter<BusinessRepository>,
  ) {
    super(ServiceOffering, dataSource);
    this.business = this.createBelongsToAccessorFor('business', businessRepositoryGetter,);
    this.registerInclusionResolver('business', this.business.inclusionResolver);
    this.service = this.createBelongsToAccessorFor('service', serviceRepositoryGetter,);
    this.registerInclusionResolver('service', this.service.inclusionResolver);
  }
}
