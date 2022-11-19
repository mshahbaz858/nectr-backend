// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {CatagoryRepository, ServiceRepository, SubCatagoryRepository, SubServiceRepository} from '../repositories';
import {ServiceList, ServiceListInput} from '../schema';

// import {inject} from '@loopback/core';


export class CatagoryController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;
  constructor(

    @repository(CatagoryRepository)
    private catagoryRepo: CatagoryRepository,


    @repository(SubCatagoryRepository)
    private subCatagoryRepo: SubCatagoryRepository,

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
      // console.log("catagoryList [0] ===>>>>>", catagoryList[0].subCatagories);
      // console.log("---------------------------------------------------------------------------");
      // console.log("catagoryList [1] ====>>>>>", catagoryList[1].subCatagories[1].services);
      await transaction.commit()
      return catagoryList
    } catch (error: any) {
      await transaction.rollback()
      this.logger.error("CREATESERVICE error", error)
      throw error
    }

  }

  async getStandardServices(context: any): Promise<ServiceList[]> {
    return [
      {
        id: 1,
        name: 'Barbershop',
        subCatagories: [
          {
            id: 1,
            name: "Haircut",
            services: [
              {
                id: 1,
                name: 'Mens haircut',
                price: 15.00
              },
              {
                id: 2,
                name: 'Ladies haircut',
                price: 15.00
              },
              {
                id: 3,
                name: 'Children haircut',
                price: 15.00,
              }
            ]
          },
          {
            id: 2,
            name: "HairColoring",
            services: [
              {
                id: 1,
                name: 'Hair Bleaching',
                price: 15.00
              },
              {
                id: 2,
                name: 'Hair Dyeing',
                price: 15.00
              },
              {
                id: 3,
                name: 'Hair highlight',
                price: 15.00,
              }
            ]
          },
        ]
      },
      {
        id: 2,
        name: 'Hair Salon',
        subCatagories: [
          {
            id: 1,
            name: "Weave Installation",
            services: [
              {
                id: 1,
                name: 'Sew-In',
                price: 15.00
              },
              {
                id: 2,
                name: 'Quick blue weave',
                price: 15.00
              },
              {
                id: 3,
                name: 'Frontal installation',
                price: 15.00,
              },
              {
                id: 4,
                name: 'Closure installation',
                price: 15.00,
              },
              {
                id: 5,
                name: 'Wig making',
                price: 15.00,
              },
              {
                id: 6,
                name: 'Natural hair',
                price: 15.00,
              },
            ]
          },
          {
            id: 2,
            name: "Braids",
            services: [
              {
                id: 1,
                name: 'Box braids',
                price: 15.00
              },
              {
                id: 2,
                name: 'Classic braids',
                price: 15.00
              },
              {
                id: 3,
                name: 'Knotless braids',
                price: 15.00,
              },
              {
                id: 4,
                name: 'Micro braids',
                price: 15.00,
              },
              {
                id: 5,
                name: 'Crochet braids',
                price: 15.00,
              },
              {
                id: 6,
                name: 'Cornrows',
                price: 15.00,
              },
            ]
          },
          {
            id: 3,
            name: "Locs",
            services: [
              {
                id: 1,
                name: 'Interlocking',
                price: 15.00
              },
              {
                id: 2,
                name: 'Loc retwist',
                price: 15.00
              },
              {
                id: 3,
                name: 'Starter locs',
                price: 15.00,
              },
              {
                id: 4,
                name: 'Faux locs',
                price: 15.00,
              },
            ]
          },
          {
            id: 4,
            name: "Wig making",
            services: [
              {
                id: 1,
                name: 'Braid wigs',
                price: 15.00
              },
              {
                id: 21,
                name: 'Human hair wigs',
                price: 15.00
              },
            ]
          },
          {
            id: 5,
            name: "Natural hair",
            services: [
              {
                id: 1,
                name: 'Natural hair grooming',
                price: 15.00
              },
            ]
          },
        ]
      },
      {
        id: 3,
        name: 'Spa',
        subCatagories: [
          {
            id: 1,
            name: "Self-Care",
            services: [
              {
                id: 1,
                name: 'Nails',
                subServices: [
                  {
                    id: 1,
                    name: 'Acrylic',
                    price: 15.00,
                  },
                  {
                    id: 2,
                    name: 'Stick on',
                    price: 15.00,
                  }
                ]
              },
              {
                id: 2,
                name: 'Eyebrows / Lashes',
                subServices: [
                  {
                    id: 1,
                    name: 'Micro blading',
                    price: 15.00,
                  },
                  {
                    id: 2,
                    name: 'Brow tweezing',
                    price: 15.00,
                  },
                  {
                    id: 3,
                    name: 'Brow waxing',
                    price: 15.00,
                  },
                  {
                    id: 4,
                    name: 'Brow threading',
                    price: 15.00,
                  }
                ]
              },
              {
                id: 3,
                name: 'Facials',
                price: 15.00,
              },
              {
                id: 4,
                name: 'Waxing',
                subServices: [
                  {
                    id: 1,
                    name: 'Brazilian wax',
                    price: 15.00,
                  },
                  {
                    id: 2,
                    name: 'Total body wax',
                    price: 15.00,
                  },
                ]
              },
              {
                id: 5,
                name: 'Massage',
                subServices: [
                  {
                    id: 1,
                    name: 'Deep tissue',
                    price: 15.00,
                  },
                  {
                    id: 2,
                    name: 'Swedish',
                    price: 15.00,
                  },
                  {
                    id: 3,
                    name: 'Hot stone',
                    price: 15.00,
                  },
                  {
                    id: 4,
                    name: 'Aromatherapy',
                    price: 15.00,
                  },
                ]
              },
              {
                id: 6,
                name: 'Body work',
                subServices: [
                  {
                    id: 1,
                    name: 'Body steaming',
                    price: 15.00,
                  },
                  {
                    id: 2,
                    name: 'Body scrub',
                    price: 15.00,
                  },
                  {
                    id: 3,
                    name: 'Body polishing',
                    price: 15.00,
                  },
                  {
                    id: 4,
                    name: 'Hammam bath',
                    price: 15.00,
                  },
                ]
              },
            ]
          },
        ]
      },
      {
        id: 4,
        name: 'Piercing & Tattoos',
        subCatagories: [
          {
            id: 1,
            name: "Piercing",
            services: [
              {
                id: 1,
                name: 'Ear piercing',
                price: 15.00
              },
              {
                id: 2,
                name: 'Facial piercing',
                price: 15.00
              },
              {
                id: 3,
                name: 'Genital piercing',
                price: 15.00,
              },
              {
                id: 4,
                name: 'Lip piercing',
                price: 15.00,
              },
              {
                id: 5,
                name: 'Nipple piercing',
                price: 15.00,
              },
            ]
          },
          {
            id: 2,
            name: "Tattoos",
            services: [
              {
                id: 1,
                name: 'Traditional tattoo style',
                price: 15.00
              },
              {
                id: 2,
                name: 'Neo-traditional tattoo style',
                price: 15.00
              },
              {
                id: 3,
                name: 'Fine line tattoo style',
                price: 15.00,
              },
              {
                id: 4,
                name: 'Realism tattoo style',
                price: 15.00,
              },
              {
                id: 5,
                name: 'Geometric tattoo style',
                price: 15.00,
              },
            ]
          },
        ]
      },
    ]

  }
}