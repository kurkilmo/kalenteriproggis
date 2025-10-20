export const groups = [
  { id: 1, 
    name: "Koodarit", 
    public: true, 
    eventIds: [1, 3, 9, 11] 
  },
  { id: 2, 
    name: "Avaruuskerho", 
    public: false, 
    eventIds: [4, 7, 13] 
  },
  { id: 3, 
    name: "Hyväntekijät", 
    public: true, 
    eventIds: [2, 6, 10, 18] 
  },
  { id: 4, 
    name: "Startup Club", 
    public: true, 
    eventIds: [3, 15, 20] 
  },
  { id: 5, 
    name: "Green Innovators", 
    public: true, 
    eventIds: [2, 8, 17] 
  },
  { id: 6, 
    name: "Future Mobility Team", 
    public: true, 
    eventIds: [19, 20] 
  },
];

export function getGroups() {
  return groups;
}

export function getGroupById(id: number) {
  return groups.find((g) => g.id === id);
}
