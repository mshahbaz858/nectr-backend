import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Business, BusinessRelations, Catagory, User, BusinessCatagory, SubCatagory, BusinessSubCatagory, Service, BusinessService} from '../models';
import {BusinessCatagoryRepository} from './business-catagory.repository';
import {BusinessSubCatagoryRepository} from './business-sub-catagory.repository';
import {CatagoryRepository} from './catagory.repository';
import {ServiceRepository} from './service.repository';
import {SubCatagoryRepository} from './sub-catagory.repository';
import {UserRepository} from './user.repository';
import {BusinessServiceRepository} from './business-service.repository';

export class BusinessRepository extends DefaultCrudRepository<
  Business,
  typeof Business.prototype.id,
  BusinessRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Business.prototype.id>;

  public readonly catagories: HasManyRepositoryFactory<Catagory, typeof Business.prototype.id>;

  public readonly _catagories: HasManyThroughRepositoryFactory<Catagory, typeof Catagory.prototype.id,
          BusinessCatagory,
          typeof Business.prototype.id
        >;

  public readonly _subCatagories: HasManyThroughRepositoryFactory<SubCatagory, typeof SubCatagory.prototype.id,
          BusinessSubCatagory,
          typeof Business.prototype.id
        >;

  public readonly _service: HasManyThroughRepositoryFactory<Service, typeof Service.prototype.id,
          BusinessService,
          typeof Business.prototype.id
        >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>, @repository.getter('CatagoryRepository') protected catagoryRepositoryGetter: Getter<CatagoryRepository>, @repository.getter('BusinessCatagoryRepository') protected businessCatagoryRepositoryGetter: Getter<BusinessCatagoryRepository>, @repository.getter('BusinessSubCatagoryRepository') protected businessSubCatagoryRepositoryGetter: Getter<BusinessSubCatagoryRepository>, @repository.getter('SubCatagoryRepository') protected subCatagoryRepositoryGetter: Getter<SubCatagoryRepository>, @repository.getter('BusinessServiceRepository') protected businessServiceRepositoryGetter: Getter<BusinessServiceRepository>,
  ) {
    super(Business, dataSource);
    this._service = this.createHasManyThroughRepositoryFactoryFor('_service', serviceRepositoryGetter, businessServiceRepositoryGetter,);
    this.registerInclusionResolver('_service', this._service.inclusionResolver);
    this._subCatagories = this.createHasManyThroughRepositoryFactoryFor('_subCatagories', subCatagoryRepositoryGetter, businessSubCatagoryRepositoryGetter,);
    this.registerInclusionResolver('_subCatagories', this._subCatagories.inclusionResolver);
    this._catagories = this.createHasManyThroughRepositoryFactoryFor('_catagories', catagoryRepositoryGetter, businessCatagoryRepositoryGetter,);
    this.registerInclusionResolver('_catagories', this._catagories.inclusionResolver);
    this.catagories = this.createHasManyRepositoryFactoryFor('catagories', catagoryRepositoryGetter,);
    this.registerInclusionResolver('catagories', this.catagories.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
