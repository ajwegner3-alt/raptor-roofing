// src/content/service-areas.ts

export interface ServiceArea {
  name: string;
  slug: string;
  county: string;
  zipCodes: string[];
  lat?: number;
  lng?: number;
  isPrimary: boolean; // true = featured in footer/homepage
}

export const serviceAreas: ServiceArea[] = [
  {
    name: "Omaha",
    slug: "omaha",
    county: "Douglas",
    zipCodes: [
      "68101", "68102", "68103", "68104", "68105", "68106", "68107",
      "68108", "68110", "68111", "68112", "68114", "68116", "68117",
      "68118", "68122", "68124", "68127", "68130", "68131", "68132",
      "68133", "68134", "68135", "68137", "68138", "68142", "68144",
      "68147", "68152", "68154", "68157", "68164",
    ],
    lat: 41.2565,
    lng: -95.9345,
    isPrimary: true,
  },
  {
    name: "Bellevue",
    slug: "bellevue",
    county: "Sarpy",
    zipCodes: ["68005", "68123"],
    lat: 41.1500,
    lng: -95.9145,
    isPrimary: true,
  },
  {
    name: "Papillion",
    slug: "papillion",
    county: "Sarpy",
    zipCodes: ["68046", "68133"],
    lat: 41.1548,
    lng: -96.0425,
    isPrimary: true,
  },
  {
    name: "La Vista",
    slug: "la-vista",
    county: "Sarpy",
    zipCodes: ["68128"],
    lat: 41.1833,
    lng: -96.0306,
    isPrimary: true,
  },
  {
    name: "Elkhorn",
    slug: "elkhorn",
    county: "Douglas",
    zipCodes: ["68022"],
    lat: 41.2847,
    lng: -96.2353,
    isPrimary: true,
  },
  {
    name: "Millard",
    slug: "millard",
    county: "Douglas",
    zipCodes: ["68137", "68144"],
    lat: 41.2167,
    lng: -96.1167,
    isPrimary: false,
  },
  {
    name: "Gretna",
    slug: "gretna",
    county: "Sarpy",
    zipCodes: ["68028"],
    lat: 41.1417,
    lng: -96.2369,
    isPrimary: false,
  },
  {
    name: "Ralston",
    slug: "ralston",
    county: "Douglas",
    zipCodes: ["68127"],
    lat: 41.2014,
    lng: -96.0342,
    isPrimary: false,
  },
];

export function getPrimaryServiceAreas(): ServiceArea[] {
  return serviceAreas.filter((a) => a.isPrimary);
}

export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.slug === slug);
}
