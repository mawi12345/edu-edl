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
    name: 'Mittelschule Erzherzog Johann Schladming mit Ski-MS',
    city: 'Schladming',
    logo: 'schools/msejschladming.png',
  },
  {
    name: 'Mittelschule 1 Schladming',
    city: 'Schladming',
  },
];
