// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CatagoryRepository, RoleRepository, ServiceRepository, SubCatagoryRepository, SubServiceRepository} from '../repositories';
import {ServiceList, ServiceListInput, Services, ServicesInput, Success, USER_ROLE} from '../schema';
import {standardServices} from '../services/contants';

// import {inject} from '@loopback/core';


export class CatagoryController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;
  constructor(

    @repository(CatagoryRepository)
    private catagoryRepo: CatagoryRepository,


    @repository(SubCatagoryRepository)
    private subCatagoryRepo: SubCatagoryRepository,

    @repository(RoleRepository)
    private roleReposit: RoleRepository,

    @repository(ServiceRepository)
    private serviceRepo: ServiceRepository,

    @repository(SubServiceRepository)
    private subServiceRepo: SubServiceRepository,

  ) { }

  async createServices(context: any, services: ServiceListInput[]) {
    const transaction = await this.serviceRepo.dataSource.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      let catagoryList: any[] = [];
      for (let j = 0; j < services.length; j++) {
        const catagory = services[j];
        const newCatagory = await this.catagoryRepo.create({name: catagory.name}, {transaction});
        // const newBusinessCatagory = await this.businessCatagoryRepo.create({businessId: businessId, catagoryId: newCatagory.id}, , {transaction});

        let subCatagoryList: any[] = []
        for (let k = 0; k < catagory.subCatagories.length; k++) {
          const subCatagory = services[j].subCatagories[k];
          const newSubCatagory = await this.subCatagoryRepo.create({name: subCatagory.name, catagoryId: newCatagory.id}, {transaction});
          // store services
          let serviceList: any[] = []
          for (let l = 0; l < subCatagory.services.length; l++) {
            const service = services[j].subCatagories[k].services[l];
            if (service.subServices && service.subServices.length > 0) {
              const newService = await this.serviceRepo.create({name: service.name, subCatagoryId: newSubCatagory.id}, {transaction})
              // store subServices
              let subServiceList: any[] = []
              for (let m = 0; m < service.subServices.length; m++) {
                const subService = services[j].subCatagories[k].services[l].subServices?.[m];
                if (subService) {
                  const newSubService = await this.subServiceRepo.create({price: subService.price, name: subService.name, serviceId: newService.id}, {transaction})
                  subServiceList.push({id: newSubService.id, name: newSubService.name})
                }
              }
              serviceList.push({id: newService.id, name: newService.name, subServices: subServiceList})
            }
            else {
              const newService = await this.serviceRepo.create({name: service.name, price: service.price, subCatagoryId: newSubCatagory.id}, {transaction})
              serviceList.push({id: newService.id, name: newService.name, price: newService.price})
            }
          }
          subCatagoryList.push({id: newSubCatagory.id, name: newSubCatagory.name, services: serviceList})
        }
        catagoryList.push({id: newCatagory.id, name: newCatagory.name, subCatagories: subCatagoryList})
      }
      await transaction.commit()
      return catagoryList
    } catch (error: any) {
      await transaction.rollback()
      this.logger.error("CREATESERVICE error", error)
      throw error
    }

  }

  async getStandardServices(context: any): Promise<ServiceList[]> {
    let data = await this.catagoryRepo.find({
      include: [
        {
          relation: 'subCatagories',
          scope: {
            include: [
              {
                relation: 'services',
                scope: {
                  include: ['subServices']
                }
              }
            ],
          },
        },
      ],
    })
    console.log("------>>>>", data);
    return data
    // return [
    //   {
    //     id: 1,
    //     name: 'Barbershop',
    //     subCatagories: [
    //       {
    //         id: 1,
    //         name: "Haircut",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Mens haircut',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 2,
    //             name: 'Ladies haircut',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Children haircut',
    //             price: 15.00,
    //             isCustomize: false,
    //           }
    //         ]
    //       },
    //       {
    //         id: 2,
    //         name: "HairColoring",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Hair Bleaching',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 2,
    //             name: 'Hair Dyeing',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Hair highlight',
    //             price: 15.00,
    //             isCustomize: false,
    //           }
    //         ]
    //       },
    //     ]
    //   },
    //   {
    //     id: 2,
    //     name: 'Hair Salon',
    //     subCatagories: [
    //       {
    //         id: 1,
    //         name: "Weave Installation",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Sew-In',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 2,
    //             name: 'Quick blue weave',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Frontal installation',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 4,
    //             name: 'Closure installation',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 5,
    //             name: 'Wig making',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 6,
    //             name: 'Natural hair',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //         ]
    //       },
    //       {
    //         id: 2,
    //         name: "Braids",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Box braids',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 2,
    //             name: 'Classic braids',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Knotless braids',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 4,
    //             name: 'Micro braids',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 5,
    //             name: 'Crochet braids',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 6,
    //             name: 'Cornrows',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //         ]
    //       },
    //       {
    //         id: 3,
    //         name: "Locs",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Interlocking',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 2,
    //             name: 'Loc retwist',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Starter locs',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 4,
    //             name: 'Faux locs',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //         ]
    //       },
    //       {
    //         id: 4,
    //         name: "Wig making",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Braid wigs',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 21,
    //             name: 'Human hair wigs',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //         ]
    //       },
    //       {
    //         id: 5,
    //         name: "Natural hair",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Natural hair grooming',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //         ]
    //       },
    //     ]
    //   },
    //   {
    //     id: 3,
    //     name: 'Spa',
    //     subCatagories: [
    //       {
    //         id: 1,
    //         name: "Self-Care",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Nails',
    //             isCustomize: false,
    //             subServices: [
    //               {
    //                 id: 1,
    //                 name: 'Acrylic',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 2,
    //                 name: 'Stick on',
    //                 price: 15.00,
    //               }
    //             ]
    //           },
    //           {
    //             id: 2,
    //             name: 'Eyebrows / Lashes',
    //             isCustomize: false,
    //             subServices: [
    //               {
    //                 id: 1,
    //                 name: 'Micro blading',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 2,
    //                 name: 'Brow tweezing',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 3,
    //                 name: 'Brow waxing',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 4,
    //                 name: 'Brow threading',
    //                 price: 15.00,
    //               }
    //             ]
    //           },
    //           {
    //             id: 3,
    //             name: 'Facials',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 4,
    //             name: 'Waxing',
    //             isCustomize: false,
    //             subServices: [
    //               {
    //                 id: 1,
    //                 name: 'Brazilian wax',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 2,
    //                 name: 'Total body wax',
    //                 price: 15.00,
    //               },
    //             ]
    //           },
    //           {
    //             id: 5,
    //             name: 'Massage',
    //             isCustomize: false,
    //             subServices: [
    //               {
    //                 id: 1,
    //                 name: 'Deep tissue',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 2,
    //                 name: 'Swedish',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 3,
    //                 name: 'Hot stone',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 4,
    //                 name: 'Aromatherapy',
    //                 price: 15.00,
    //               },
    //             ]
    //           },
    //           {
    //             id: 6,
    //             name: 'Body work',
    //             isCustomize: false,
    //             subServices: [
    //               {
    //                 id: 1,
    //                 name: 'Body steaming',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 2,
    //                 name: 'Body scrub',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 3,
    //                 name: 'Body polishing',
    //                 price: 15.00,
    //               },
    //               {
    //                 id: 4,
    //                 name: 'Hammam bath',
    //                 price: 15.00,
    //               },
    //             ]
    //           },
    //         ]
    //       },
    //     ]
    //   },
    //   {
    //     id: 4,
    //     name: 'Piercing & Tattoos',
    //     subCatagories: [
    //       {
    //         id: 1,
    //         name: "Piercing",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Ear piercing',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 2,
    //             name: 'Facial piercing',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Genital piercing',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 4,
    //             name: 'Lip piercing',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 5,
    //             name: 'Nipple piercing',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //         ]
    //       },
    //       {
    //         id: 2,
    //         name: "Tattoos",
    //         services: [
    //           {
    //             id: 1,
    //             name: 'Traditional tattoo style',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 2,
    //             name: 'Neo-traditional tattoo style',
    //             price: 15.00,
    //             isCustomize: false
    //           },
    //           {
    //             id: 3,
    //             name: 'Fine line tattoo style',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 4,
    //             name: 'Realism tattoo style',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //           {
    //             id: 5,
    //             name: 'Geometric tattoo style',
    //             price: 15.00,
    //             isCustomize: false,
    //           },
    //         ]
    //       },
    //     ]
    //   },
    // ]
  }

  async initializeApp(context: any): Promise<Success> {
    const transaction = await this.serviceRepo.dataSource.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      const services = standardServices
      let adminRoles = [{
        id: USER_ROLE.ADMIN,
        name: `${USER_ROLE.ADMIN}`
      },
      {
        id: USER_ROLE.BUSINESS,
        name: `${USER_ROLE.BUSINESS}`
      },
      {
        id: USER_ROLE.CONSUMER,
        name: `${USER_ROLE.CONSUMER}`
      },
      ]
      for (let j = 0; j < services.length; j++) {
        const catagory = services[j];
        const newCatagory = await this.catagoryRepo.create({name: catagory.name}, {transaction});
        let subCatagoryList: any[] = []
        for (let k = 0; k < catagory.subCatagories.length; k++) {
          const subCatagory = services[j].subCatagories[k];
          const newSubCatagory = await this.subCatagoryRepo.create({name: subCatagory.name, catagoryId: newCatagory.id}, {transaction});
          // store services
          let serviceList: any[] = []
          for (let l = 0; l < subCatagory.services.length; l++) {
            const service = services[j].subCatagories[k].services[l];
            if (service.subServices && service.subServices.length > 0) {
              const newService = await this.serviceRepo.create({name: service.name, subCatagoryId: newSubCatagory.id}, {transaction})
              // store subServices
              let subServiceList: any[] = []
              for (let m = 0; m < service.subServices.length; m++) {
                const subService = services[j].subCatagories[k].services[l].subServices?.[m];
                if (subService) {
                  const newSubService = await this.subServiceRepo.create({price: subService.price, name: subService.name, serviceId: newService.id}, {transaction})
                }
              }
            }
            else {
              if (service.price) {
                const newService = await this.serviceRepo.create({name: service.name, price: service.price, subCatagoryId: newSubCatagory.id}, {transaction})
              }
            }
          }
        }
      }
      await this.roleReposit.createAll(adminRoles, {transaction})
      await transaction.commit()
      return {success: true}
    } catch (error) {
      await transaction.rollback()
      this.logger.error("INITIALIZE_APP_ERROR", error)
      throw error
    }
  }

  async addServiceCatagory(context: any, service: ServicesInput, subCatagoryId: number): Promise<Services> {
    try {
      const newService = await this.serviceRepo.create({name: service.name, price: service.price, isCustomize: true, subCatagoryId: subCatagoryId});
      if (!newService.id) throw new HttpErrors.Forbidden("Something went wrong, NewService not created.");
      return {
        id: newService.id,
        name: newService.name,
        price: newService.price,
        subCatagoryId: newService.subCatagoryId,
        isCustomize: newService.isCustomize,
        serviceIds: newService.serviceIds
      }
    } catch (error) {
      this.logger.error("AddServiceCatagory", error);
      throw error
    }

  }

  async removeServiceCatagory(context: any, serviceId: number): Promise<Success> {
    try {
      const service = await this.serviceRepo.findById(serviceId);
      if (service.isCustomize) {
        await this.serviceRepo.deleteById(serviceId);
      }
      else {
        throw new HttpErrors.BadRequest("You cannot delete standard services")
      }
      return {success: true}
    } catch (error) {
      this.logger.error("RemoveServiceCatagory", error);
      throw error
    }

  }
}
