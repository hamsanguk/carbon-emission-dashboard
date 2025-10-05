'use client';
import { useDashboardStore } from "./store/useDashboardStore";
import { companies } from "./lib/mockData";
import { monthSort, sliceByRange, runningTotal, calcTax, aggregateByCompany } from "./lib/utils";
import RangeSelector from "./components/RangeSelector";
import TrendChart from "./components/TrendChart";
import TaxCard from "./components/TaxCard";
import CompanyComparison from "./components/CompanyComparison";

export default function DashboardPage() {
  const { activeCompanyId, range } = useDashboardStore();
  const company = companies.find(c => c.id === activeCompanyId)!;

  // 기존 트렌드 데이터 준비(누적 마지막값 = 범위 총합)
  const sliced = company.emissions.slice(-range);
  const cumul = runningTotal(sliced.map(e => e.emissions));
  const totalInRange = cumul[cumul.length - 1] ?? 0;

  // 비교 바 차트용 데이터
  const compareRows = aggregateByCompany(companies, range);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <RangeSelector />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendChart data={sliced.map((e, i) => ({ yearMonth: e.yearMonth, emissions: e.emissions, cumulative: cumul[i] }))} />
        <div className="flex flex-col gap-6">
          <TaxCard totalTons={totalInRange} />
          <CompanyComparison data={compareRows.map(r => ({ name: r.name, total: r.total }))} />
        </div>
      </div>
    </div>
  );
}
