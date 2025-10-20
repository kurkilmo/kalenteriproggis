export const organizations = [
  { id: 1, 
    name: "Google", 
    info: "Teknologiayritys.", 
    eventIds: [1, 3, 5, 14] 
  },
  { id: 2, 
    name: "NASA", 
    info: "Avaruustutkimus.", 
    eventIds: [4, 7, 13, 19] 
  },
  { id: 3, 
    name: "UNICEF", 
    info: "YK:n lastenrahasto.", 
    eventIds: [2, 6, 10, 18] 
  },
  { id: 4, 
    name: "Amazon", 
    info: "Verkkokauppa ja pilvipalvelut.", 
    eventIds: [3, 7, 9, 12] 
  },
  { id: 5, 
    name: "Red Cross", 
    info: "Humanitaarinen järjestö.", 
    eventIds: [2, 6, 10] 
  },
  { id: 6, 
    name: "Microsoft", 
    info: "Ohjelmisto- ja pilvipalvelut.", 
    eventIds: [1, 11, 14] 
  },
  { id: 7, 
    name: "Apple", 
    info: "Kulutuselektroniikka.", 
    eventIds: [1, 15, 20] 
  },
  { id: 8, 
    name: "Tesla", 
    info: "Sähköautot ja uusiutuva energia.", 
    eventIds: [8, 19, 20] 
  },  
  { id: 9, 
    name: "WHO", 
    info: "Maailman terveysjärjestö.", 
    eventIds: [10, 18] 
  },
  { id: 10, 
    name: "SpaceX", 
    info: "Avaruusteknologiaa ja satelliitteja.", 
    eventIds: [4, 7, 13] 
  },
];

export function getOrganizations() {
  return organizations;
}

export function getOrganizationById(id: string) {
  return organizations.find((o) => o.id === id);
}
