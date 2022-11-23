export const standardServices = [
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 2,
            name: 'Ladies haircut',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Children haircut',
            price: 15.00,
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 2,
            name: 'Hair Dyeing',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Hair highlight',
            price: 15.00,
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 2,
            name: 'Quick blue weave',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Frontal installation',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 4,
            name: 'Closure installation',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 5,
            name: 'Wig making',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 6,
            name: 'Natural hair',
            price: 15.00,
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 2,
            name: 'Classic braids',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Knotless braids',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 4,
            name: 'Micro braids',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 5,
            name: 'Crochet braids',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 6,
            name: 'Cornrows',
            price: 15.00,
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 2,
            name: 'Loc retwist',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Starter locs',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 4,
            name: 'Faux locs',
            price: 15.00,
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 21,
            name: 'Human hair wigs',
            price: 15.00,
            isCustomize: false
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
            price: 15.00,
            isCustomize: false
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
            isCustomize: false,
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
            isCustomize: false,
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
            isCustomize: false,
          },
          {
            id: 4,
            name: 'Waxing',
            isCustomize: false,
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
            isCustomize: false,
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
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 2,
            name: 'Facial piercing',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Genital piercing',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 4,
            name: 'Lip piercing',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 5,
            name: 'Nipple piercing',
            price: 15.00,
            isCustomize: false,
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
            price: 15.00,
            isCustomize: false
          },
          {
            id: 2,
            name: 'Neo-traditional tattoo style',
            price: 15.00,
            isCustomize: false
          },
          {
            id: 3,
            name: 'Fine line tattoo style',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 4,
            name: 'Realism tattoo style',
            price: 15.00,
            isCustomize: false,
          },
          {
            id: 5,
            name: 'Geometric tattoo style',
            price: 15.00,
            isCustomize: false,
          },
        ]
      },
    ]
  },
]
