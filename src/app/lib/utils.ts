import type { Company, GhgEmission } from "./types";

export const monthSort = (arr: string[]) =>
  arr.sort((a, b) => new Date(a + "-01").getTime() - new Date(b + "-01").getTime());

// 끝에서 N개월 슬라이스
export const sliceByRange = <T>(data: T[], months: number) => data.slice(-months);

// 누적 합
export const runningTotal = (nums: number[]) =>
  nums.map((_, i) => nums.slice(0, i + 1).reduce((s, x) => s + x, 0));

// 탄소세($10/t)
export const calcTax = (total: number) => total * 10;

// 고유 국가 코드 목록
export function getCountries(companies: Company[]): string[] {
  return Array.from(new Set(companies.map(c => c.country))).sort();
}

// 나라별 회사 필터
export function filterCompaniesByCountry(companies: Company[], country: "all" | string): Company[] {
  if (country === "all") return companies;
  return companies.filter(c => c.country === country);
}

// 회사 범위 총합
export function sumRange(emissions: GhgEmission[], months: number) {
  const sliced = sliceByRange(emissions, months);
  return sliced.reduce((s, e) => s + e.emissions, 0);
}

// 여러 회사를 월별로 합산한 시계열 생성
export function aggregateEmissionsAcrossCompanies(companies: Company[]): GhgEmission[] {
  //모든 month 키 수집
  const months = monthSort(
    Array.from(new Set(companies.flatMap(c => c.emissions.map(e => e.yearMonth))))
  );
  //각 month에 대해 합계
  return months.map(m => ({
    yearMonth: m,
    emissions: companies.reduce((sum, c) => {
      const rec = c.emissions.find(e => e.yearMonth === m);
      return sum + (rec?.emissions ?? 0);
    }, 0),
  }));
}

// 회사별 범위 합계(막대 차트용)
export function aggregateByCompany(companies: Company[], months: number) {
  return companies.map(c => ({
    id: c.id,
    name: c.name,
    total: sumRange(c.emissions, months),
  }));
}
