// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BusinessCatagoryRepository, BusinessRepository, CatagoryRepository, ServiceRepository, SubCatagoryRepository, SubServiceRepository, UserRepository} from '../repositories';
import {AuthenticatedUser, BusinessInput, Success, User, UserInput, VERIFICATION_STATUS} from '../schema';
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

    @repository(CatagoryRepository)
    private catagoryRepo: CatagoryRepository,

    @repository(BusinessCatagoryRepository)
    private businessCatagoryRepo: BusinessCatagoryRepository,

    @repository(SubCatagoryRepository)
    private subCatagoryRepo: SubCatagoryRepository,

    @repository(ServiceRepository)
    private serviceRepo: ServiceRepository,

    @repository(SubServiceRepository)
    private subServiceRepo: SubServiceRepository,

    @service(JwtService)
    private jwtService: JwtService,

    @service(MyUserService)
    private userService: MyUserService,

    @service(HasherService)
    private hasherService: HasherService,
  ) { }

  async businessSignup(context: any, token: string, userDetails: UserInput, _businessDetails: BusinessInput): Promise<AuthenticatedUser> {
    const {services, ...businessDetails} = _businessDetails
    const {firstName, password, lastName} = userDetails;

    const transaction = await this.userRepo.dataSource.beginTransaction(IsolationLevel.READ_COMMITTED);
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

      let newBusiness = await this.businessRepo.create({...businessDetails, userId: newUser.id},
        {transaction}
      )
      console.log("newBusinessEntry --->>>>", newBusiness);

      // const catagoryList = await this.createService(services, newBusiness.id, {transaction})
      // console.log("catagoryList", catagoryList);

      const _user: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }

      const securityProfile = this.userService.convertToUserProfile(newUser);
      const profileToken = await this.jwtService.generateToken(securityProfile);

      await transaction.commit();
      return {
        user: _user,
        business: newBusiness,
        token: profileToken,
      }
    } catch (error) {
      await transaction.rollback();
      this.logger.error("RegisterUserError", error);
      throw error;
    }

  }

  async resetPassword(context: any, token: string, newPassword: string): Promise<Success> {
    const transaction = await this.userRepo.dataSource.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      const verification: {
        code: string;
        status: string;
        email: string;
      } = await this.jwtService.verifyUserVerificationToken(token);
      if (verification.status !== VERIFICATION_STATUS.VERIFIED) throw new HttpErrors.Forbidden("Email not verified, please verfiy your email");
      const user = await this.userRepo.findOne({where: {email: {eq: verification.email}}});
      if (!user) throw new HttpErrors.Forbidden("Email not found.");
      const pwdHash = await this.hasherService.hashPassword(newPassword);
      await this.userRepo.updateById(user?.id, {password: pwdHash}, {transaction});
      await transaction.commit();
      return {success: true};
    } catch (error) {
      transaction.rollback();
      this.logger.error("ResetPasswordError", error);
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


  // async createService(services: ServiceListInput[], businessId: any, options: {}) {
  //   return new Promise(async (resolve, reject) => {
  //     // const newPoint = await this.pointRepo.create({serviceId: service.id}, {transaction});
  //     try {
  //       let catagoryList: any[] = [];
  //       for (let j = 0; j < services.length; j++) {
  //         const catagory = services[j];
  //         const newCatagory = await this.catagoryRepo.create({name: catagory.name}, options);
  //         // const newBusinessCatagory = await this.businessCatagoryRepo.create({businessId: businessId, catagoryId: newCatagory.id}, options);

  //         let subCatagoryList: any[] = []
  //         for (let k = 0; k < catagory.subCatagories.length; k++) {
  //           const subCatagory = services[j].subCatagories[k];
  //           const newSubCatagory = await this.subCatagoryRepo.create({name: subCatagory.name, catagoryId: newCatagory.id}, options);
  //           // store services
  //           let serviceList: any[] = []
  //           for (let l = 0; l < subCatagory.services.length; l++) {
  //             const service = services[j].subCatagories[k].services[l];
  //             if (service.subServices && service.subServices.length > 0) {
  //               const newService = await this.serviceRepo.create({name: service.name, subCatagoryId: newSubCatagory.id}, options)
  //               // store subServices
  //               let subServiceList: any[] = []
  //               for (let m = 0; m < service.subServices.length; m++) {
  //                 const subService = services[j].subCatagories[k].services[l].subServices?.[m];
  //                 if (subService) {
  //                   const newSubService = await this.subServiceRepo.create({price: subService.price, name: subService.name, serviceId: newService.id}, options)
  //                   subServiceList.push([...subServiceList, newSubService])
  //                 }
  //               }
  //               serviceList.push([...serviceList, {...newService, subServices: subServiceList}])
  //             }
  //             else {
  //               const newService = await this.serviceRepo.create({name: service.name, price: service.price, subCatagoryId: newSubCatagory.id}, options)
  //               serviceList.push([...serviceList, newService])
  //             }
  //           }
  //           subCatagoryList.push([...subCatagoryList, {...newSubCatagory, services: serviceList}])
  //         }
  //         catagoryList.push([...catagoryList, {...newCatagory, subCatagories: subCatagoryList}])
  //       }
  //       resolve(catagoryList)
  //     } catch (error: any) {
  //       reject(`A error in adding catagories ${error}`)
  //     }

  //   });
  // }
}
