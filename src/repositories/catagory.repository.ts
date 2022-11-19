import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Catagory, CatagoryRelations, SubCatagory} from '../models';
import {BusinessRepository} from './business.repository';
import {SubCatagoryRepository} from './sub-catagory.repository';

export class CatagoryRepository extends DefaultCrudRepository<
  Catagory,
  typeof Catagory.prototype.id,
  CatagoryRelations
> {

  public readonly subCatagories: HasManyRepositoryFactory<SubCatagory, typeof Catagory.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('SubCatagoryRepository') protected subCatagoryRepositoryGetter: Getter<SubCatagoryRepository>, @repository.getter('BusinessRepository') protected businessRepositoryGetter: Getter<BusinessRepository>,
  ) {
    super(Catagory, dataSource);
    this.subCatagories = this.createHasManyRepositoryFactoryFor('subCatagories', subCatagoryRepositoryGetter,);
    this.registerInclusionResolver('subCatagories', this.subCatagories.inclusionResolver);
  }
}
