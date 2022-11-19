import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Business, BusinessRelations, Catagory, User} from '../models';
import {BusinessCatagoryRepository} from './business-catagory.repository';
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

  public readonly catagories: HasManyRepositoryFactory<Catagory, typeof Business.prototype.id>;


  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>, @repository.getter('CatagoryRepository') protected catagoryRepositoryGetter: Getter<CatagoryRepository>, @repository.getter('BusinessCatagoryRepository') protected businessCatagoryRepositoryGetter: Getter<BusinessCatagoryRepository>, @repository.getter('BusinessSubCatagoryRepository') protected businessSubCatagoryRepositoryGetter: Getter<BusinessSubCatagoryRepository>, @repository.getter('SubCatagoryRepository') protected subCatagoryRepositoryGetter: Getter<SubCatagoryRepository>,
  ) {
    super(Business, dataSource);
    this.catagories = this.createHasManyRepositoryFactoryFor('catagories', catagoryRepositoryGetter,);
    this.registerInclusionResolver('catagories', this.catagories.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
