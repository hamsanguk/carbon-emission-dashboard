export const monthSort = (arr: string[]) =>
  arr.sort((a, b) => new Date(a + "-01").getTime() - new Date(b + "-01").getTime());

export const sliceByRange = (data: any[], months: number) =>
  data.slice(-months);

export const runningTotal = (arr: number[]) =>
  arr.map((_, i) => arr.slice(0, i + 1).reduce((s, x) => s + x, 0));

export const calcTax = (total: number) => total * 10;
