export interface School {
  name: string;
  city?: string;
  logo?: string;
}

export const schools: School[] = [
  {
    name: 'Neuen Mittelschule',
  },
  {
    name: 'Volksschule',
  },
  {
    name: 'Polytechnischen Schule',
  },
  {
    name: 'Berufsschule',
  },
  {
    name: 'Neuen Mittelschule Erzherzog Johann Schladming mit Ski-NMS',
    city: 'Schladming',
    logo: 'schools/nmsejschladming.png',
  },
];
