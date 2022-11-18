import {inject} from '@loopback/core';
import {arg, GraphQLBindings, mutation, resolver, ResolverData} from '@loopback/graphql';
import {UserController} from '../controllers';
import {AuthenticatedUser, BusinessInput, UserInput} from '../schema';

@resolver()
export class UserResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.UserController')
    private userController: UserController
  ) { }

  @mutation(returns => AuthenticatedUser)
  async businessSignup(
    @arg("token",) token: string,
    @arg("userDetails", type => UserInput) userDetails: UserInput,
    @arg("businessDetails", type => BusinessInput) businessDetails: BusinessInput,
  ): Promise<AuthenticatedUser> {
    return this.userController.businessSignup(
      this.resolverData.context,
      token,
      userDetails,
      businessDetails,
    );
  }

}
