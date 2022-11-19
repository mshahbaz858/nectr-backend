import {inject} from '@loopback/core';
import {arg, GraphQLBindings, mutation, resolver, ResolverData} from '@loopback/graphql';
import {UserController} from '../controllers';
import {AuthenticatedUser, BusinessInput, Success, User, UserInput} from '../schema';

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

  @mutation(returns => User)
  async consumerSignup(
    @arg("token") token: string,
    @arg("userDetails", type => UserInput) userDetails: UserInput
  ): Promise<User> {
    return this.userController.consumerSignup(
      this.resolverData.context,
      token,
      userDetails
    )
  }

  @mutation(returns => Success)
  async resetPassword(
    @arg("token") token: string,
    @arg("newPassword") newPassword: string,
  ): Promise<Success> {
    return this.userController.resetPassword(
      this.resolverData.context,
      token,
      newPassword
    );
  }

}
