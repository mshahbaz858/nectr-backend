import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Business, BusinessCatagory, BusinessRelations, BusinessService, BusinessSubCatagory, Catagory, Service, SubCatagory, User} from '../models';
import {BusinessCatagoryRepository} from './business-catagory.repository';
import {BusinessServiceRepository} from './business-service.repository';
import {BusinessSubCatagoryRepository} from './business-sub-catagory.repository';
import {CatagoryRepository} from './catagory.repository';
import {ServiceRepository} from './service.repository';
import {SubCatagoryRepository} from './sub-catagory.repository';
import {UserRepository} from './user.repository';

export class BusinessRepository extends DefaultCrudRepository<
  Business,
  typeof Business.prototype.id,
  BusinessRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Business.prototype.id>;

  public readonly catagories: HasManyThroughRepositoryFactory<Catagory, typeof Catagory.prototype.id,
    BusinessCatagory,
    typeof Business.prototype.id
  >;

  public readonly subCatagories: HasManyThroughRepositoryFactory<SubCatagory, typeof SubCatagory.prototype.id,
    BusinessSubCatagory,
    typeof Business.prototype.id
  >;

  public readonly services: HasManyThroughRepositoryFactory<Service, typeof Service.prototype.id,
    BusinessService,
    typeof Business.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>, @repository.getter('CatagoryRepository') protected catagoryRepositoryGetter: Getter<CatagoryRepository>, @repository.getter('BusinessCatagoryRepository') protected businessCatagoryRepositoryGetter: Getter<BusinessCatagoryRepository>, @repository.getter('BusinessSubCatagoryRepository') protected businessSubCatagoryRepositoryGetter: Getter<BusinessSubCatagoryRepository>, @repository.getter('SubCatagoryRepository') protected subCatagoryRepositoryGetter: Getter<SubCatagoryRepository>, @repository.getter('BusinessServiceRepository') protected businessServiceRepositoryGetter: Getter<BusinessServiceRepository>,
  ) {
    super(Business, dataSource);
    this.services = this.createHasManyThroughRepositoryFactoryFor('services', serviceRepositoryGetter, businessServiceRepositoryGetter,);
    this.registerInclusionResolver('services', this.services.inclusionResolver);
    this.subCatagories = this.createHasManyThroughRepositoryFactoryFor('subCatagories', subCatagoryRepositoryGetter, businessSubCatagoryRepositoryGetter,);
    this.registerInclusionResolver('subCatagories', this.subCatagories.inclusionResolver);
    this.catagories = this.createHasManyThroughRepositoryFactoryFor('catagories', catagoryRepositoryGetter, businessCatagoryRepositoryGetter,);
    this.registerInclusionResolver('catagories', this.catagories.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
