// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BusinessRepository, UserRepository} from '../repositories';
import {AuthenticatedUser, BusinessInput, User, UserInput, VERIFICATION_STATUS} from '../schema';
import {HasherService, JwtService, MyUserService} from '../services';

// import {inject} from '@loopback/core';


export class UserController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @repository(BusinessRepository)
    private businessRepo: BusinessRepository,

    @service(JwtService)
    private jwtService: JwtService,

    @service(MyUserService)
    private userService: MyUserService,

    @service(HasherService)
    private hasherService: HasherService,
  ) { }

  async businessSignup(context: any, token: string, userDetails: UserInput, businessDetails: BusinessInput): Promise<AuthenticatedUser> {
    const transaction = await this.userRepo.dataSource.beginTransaction(IsolationLevel.READ_COMMITTED);
    const {firstName, password, lastName} = userDetails;
    try {
      const verification: {
        code: string;
        status: string;
        email: string;
      } = await this.jwtService.verifyUserVerificationToken(token);
      if (verification.status !== VERIFICATION_STATUS.VERIFIED) throw new HttpErrors.Forbidden("User not verified, please verfiy your email");

      // check if already user exist
      const existingUser = await this.userRepo.findOne({where: {email: verification.email.toLowerCase()}});
      if (existingUser) throw new HttpErrors.Conflict("User Already Exist");

      let newUser = await this.createUser(
        verification.email,
        password,
        firstName,
        lastName,
        {transaction}
      )
      console.log("newUser --->>>>", newUser);
      console.log("newUser-id --->>>>", newUser.id);

      let newBusinessEntry = await this.businessRepo.create({...businessDetails, userId: newUser.id},
        {transaction}
      )
      console.log("newBusinessEntry --->>>>", newBusinessEntry);

      const _user: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }

      const securityProfile = this.userService.convertToUserProfile(newUser);
      console.log("securityProfile", securityProfile);
      const profileToken = await this.jwtService.generateToken(securityProfile);
      console.log("profileToken", profileToken);

      await transaction.commit();
      return {
        user: _user,
        business: newBusinessEntry,
        token: profileToken,
      }
    } catch (error) {
      await transaction.rollback();
      this.logger.error("RegisterUserError", error);
      throw error;
    }

  }


  // MODAL HELPER FUNCTION
  async createUser(email: string, password: string, firstName: string, lastName: string, options: {}): Promise<User> {
    const hashedPassword = await this.hasherService.hashPassword(password);
    return this.userRepo.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName
    },
      options
    );
  }
}
