import type { Company, Post } from "./types";

export const seedCompanies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", emissions: 120 },
      { yearMonth: "2024-02", emissions: 110 },
      { yearMonth: "2024-03", emissions: 95  },
      { yearMonth: "2024-04", emissions: 100 },
      { yearMonth: "2024-05", emissions: 105 },
      { yearMonth: "2024-06", emissions: 98  },
      { yearMonth: "2024-07", emissions: 102 },
    ],
  },
  {
    id: "c2",
    name: "Bcme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", emissions: 120 },
      { yearMonth: "2024-02", emissions: 110 },
      { yearMonth: "2024-03", emissions: 40  },
      { yearMonth: "2024-04", emissions: 100 },
      { yearMonth: "2024-05", emissions: 50 },
      { yearMonth: "2024-06", emissions: 98  },
      { yearMonth: "2024-07", emissions: 102 },
    ],
  },
  {
    id: "c3",
    name: "Globex",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", emissions: 80  },
      { yearMonth: "2024-02", emissions: 105 },
      { yearMonth: "2024-03", emissions: 120 },
      { yearMonth: "2024-04", emissions: 130 },
      { yearMonth: "2024-05", emissions: 125 },
      { yearMonth: "2024-06", emissions: 110 },
      { yearMonth: "2024-07", emissions: 118 },
    ],
  },
  {
    id: "c4",
    name: "Doosan",
    country: "KO",
    emissions: [
      { yearMonth: "2024-01", emissions: 20 },
      { yearMonth: "2024-02", emissions: 30 },
      { yearMonth: "2024-03", emissions: 95  },
      { yearMonth: "2024-04", emissions: 70 },
      { yearMonth: "2024-05", emissions: 105 },
      { yearMonth: "2024-06", emissions: 55  },
      { yearMonth: "2024-07", emissions: 87 },
    ],
  },
];

export const seedPosts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report",
    resourceUid: "c1",
    dateTime: "2024-02",
    content: "Quarterly CO2 update",
    reaction: "none",
  },
];
