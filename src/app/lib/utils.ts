export const monthSort = (arr: string[]) =>
  arr.sort((a, b) => new Date(a + "-01").getTime() - new Date(b + "-01").getTime());

export const sliceByRange = (data: any[], months: number) =>
  data.slice(-months);

export const runningTotal = (arr: number[]) =>
  arr.map((_, i) => arr.slice(0, i + 1).reduce((s, x) => s + x, 0));

export const calcTax = (total: number) => total * 10;

export type GhgEmission = { yearMonth: string; emissions: number };

export type CompanyLite = { id: string; name: string; emissions: GhgEmission[] };

export function sumRange(emissions: GhgEmission[], months: number) {
  const sliced = emissions.slice(-months);
  return sliced.reduce((s, e) => s + e.emissions, 0);
}

export function aggregateByCompany(companies: CompanyLite[], months: number) {
  return companies.map(c => ({
    id: c.id,
    name: c.name,
    total: sumRange(c.emissions, months),
  }));
}
