// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BusinessCatagoryRepository, BusinessRepository, BusinessSubCatagoryRepository, CatagoryRepository, ServiceOfferingRepository, ServiceRepository, SubCatagoryRepository, SubServiceRepository, UserRepository} from '../repositories';
import {AuthenticatedUser, BusinessCatagory, BusinessInput, BusinessSubCatagory, ServiceOfferingInput, Success, User, UserInput, USER_ROLE, VERIFICATION_STATUS} from '../schema';
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

    @repository(BusinessSubCatagoryRepository)
    private businessSubCatagoryRepo: BusinessSubCatagoryRepository,

    @repository(SubCatagoryRepository)
    private subCatagoryRepo: SubCatagoryRepository,

    @repository(ServiceRepository)
    private serviceRepo: ServiceRepository,

    @repository(ServiceOfferingRepository)
    private serviceOfferingRepo: ServiceOfferingRepository,


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
        USER_ROLE.BUSINESS,
        {transaction}
      )

      let newBusiness = await this.businessRepo.create({...businessDetails, userId: newUser.id},
        {transaction}
      )

      // const catagoryList = await this.createService(services, newBusiness.id, {transaction})
      // console.log("catagoryList", catagoryList);
      const businessId = newBusiness.id;
      let servicesList: ServiceOfferingInput[] = [];
      let businessCatagory: BusinessCatagory[] = [];
      let businessSubCatagory: BusinessSubCatagory[] = [];

      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        businessCatagory.push({businessId: businessId, catagoryId: service.catagoryId})
        if (service.price) {
          servicesList.push({name: service.name, price: service.price, isCustomize: true, businessId: businessId, serviceId: service.serviceId})
        }
        businessSubCatagory.push({businessId: businessId, subCatagoryId: service.subCatagoryId})
      }

      // for (let j = 0; j < services.length; j++) {
      //   const catagory = services[j];
      //   // const newCatagory = await this.catagoryRepo.create({name: catagory.name}, {transaction});
      //   // const newBusinessCatagory = await this.businessCatagoryRepo.create({businessId: businessId, catagoryId: newCatagory.id}, , {transaction});
      //   businessCatagory.push({businessId: businessId, catagoryId: catagory.id})

      //   let subCatagoryList: any[] = []
      //   for (let k = 0; k < catagory.subCatagories.length; k++) {
      //     const subCatagory = services[j].subCatagories[k];
      //     businessSubCatagory.push({businessId: businessId, subCatagoryId: subCatagory.id})
      //     // const newSubCatagory = await this.subCatagoryRepo.create({name: subCatagory.name, catagoryId: newCatagory.id}, {transaction});
      //     // store services
      //     let serviceList: any[] = []
      //     for (let l = 0; l < subCatagory.services.length; l++) {
      //       const service = services[j].subCatagories[k].services[l];
      //       // Pending (about how to deal with sub services)
      //       if (service.subServices && service.subServices.length > 0) {
      //         // const newService = await this.serviceRepo.create({name: service.name, subCatagoryId: newSubCatagory.id}, {transaction})
      //         // store subServices
      //         let subServiceList: any[] = []
      //         for (let m = 0; m < service.subServices.length; m++) {
      //           const subService = services[j].subCatagories[k].services[l].subServices?.[m];
      //           if (subService) {
      //             // const newSubService = await this.subServiceRepo.create({price: subService.price, name: subService.name, serviceId: newService.id}, {transaction})
      //             // subServiceList.push({id: newSubService.id, name: newSubService.name})
      //           }
      //         }
      //         // serviceList.push({id: newService.id, name: newService.name, subServices: subServiceList})
      //       }
      //       else {
      //         if (service.price) {
      //           servicesList.push({name: service.name, price: service.price, isCustomize: true, businessId: businessId, serviceId: service.id})
      //           // const newService = await this.serviceRepo.create({name: service.name, price: service.price, subCatagoryId: newSubCatagory.id}, {transaction})
      //           // serviceList.push({id: newService.id, name: newService.name, price: newService.price})
      //         }
      //       }
      //     }
      //     // subCatagoryList.push({id: newSubCatagory.id, name: newSubCatagory.name, services: serviceList})
      //   }
      //   // catagoryList.push({id: newCatagory.id, name: newCatagory.name, subCatagories: subCatagoryList})
      // }

      const serviceOffering = await this.serviceOfferingRepo.createAll(servicesList, {transaction});
      console.log("serviceOffering------>>>>", serviceOffering);
      const businessCatagories = await this.businessCatagoryRepo.createAll(businessCatagory, {transaction});
      console.log("businessCatagories------>>>>", businessCatagories);
      const businessSubCatagories = await this.businessSubCatagoryRepo.createAll(businessSubCatagory, {transaction});
      console.log("businessSubCatagories------>>>>", businessSubCatagories);


      const _user: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        roleId: newUser.roleId
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

  async consumerSignup(context: any, token: string, userDetails: UserInput): Promise<User> {
    try {
      const {code, status, email} = await this.jwtService.verifyUserVerificationToken(token)
      if (status !== VERIFICATION_STATUS.VERIFIED) throw new HttpErrors.Forbidden("Email not verified, please verfiy your email");
      // check if already user exist
      const existingUser = await this.userRepo.findOne({where: {email: email.toLowerCase()}});
      if (existingUser) throw new HttpErrors.Conflict("User Already Exist");

      const {firstName, lastName, password} = userDetails
      let newUser = await this.createUser(
        email,
        password,
        firstName,
        lastName,
        USER_ROLE.CONSUMER
      )
      const _user: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        roleId: newUser.roleId,
      }
      console.log("newUser --->>>>", newUser);
      return _user;
    } catch (error) {
      this.logger.error("ConsumerSignupError", error)
      throw error
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
      const user = await this.userRepo.findOne({where: {email: {eq: verification.email.toLowerCase()}}});
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
  async createUser(email: string, password: string, firstName: string, lastName: string, roleId: USER_ROLE, options?: {}): Promise<User> {
    const hashedPassword = await this.hasherService.hashPassword(password);
    return this.userRepo.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      roleId: roleId
    },
      options
    );
  }

  // async createService(services: BusinesServicesInput[], businessId: any, options: {}) {
  //   return new Promise(async (resolve, reject) => {
  //     // const newPoint = await this.pointRepo.create({serviceId: service.id}, {transaction});
  //     try {

  //       return catagoryList
  //     } catch (error: any) {
  //       this.logger.error("CREATESERVICE error", error)
  //       throw error
  //     }

  //   });
  // }
}
