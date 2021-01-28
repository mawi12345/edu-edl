export interface School {
  id: string;
  name: string;
  city?: string;
  logo?: string;
}

export const schools: School[] = [
  {
    id: 'nms',
    name: 'Neuen Mittelschule',
  },
  {
    id: 'vs',
    name: 'Volksschule',
  },
  {
    id: 'poly',
    name: 'Polytechnischen Schule',
  },
  {
    id: 'beruf',
    name: 'Berufsschule',
  },
  {
    id: 'msejschladming',
    name: 'Mittelschule Erzherzog Johann Schladming mit Ski-MS',
    city: 'Schladming',
    logo: 'schools/msejschladming.png',
  },
  {
    id: 'ms1schladming',
    name: 'Mittelschule 1 Schladming',
    city: 'Schladming',
    logo: 'schools/ms1schladming.png',
  },
  {
    id: 'polyschladming',
    name: 'Polytechnischen Schule',
    city: 'Schladming',
    logo: 'schools/ms1schladming.png',
  },
];
