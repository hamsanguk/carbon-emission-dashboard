'use client';
import { useDashboardStore } from "./store/useDashboardStore";
import { companies } from "./lib/mockData";
import { monthSort, sliceByRange, runningTotal, calcTax } from "./lib/utils";
import RangeSelector from "./components/RangeSelector";
import TrendChart from "./components/TrendChart";

export default function DashboardPage() {
  const { activeCompanyId, range } = useDashboardStore();
  const company = companies.find((c) => c.id === activeCompanyId)!;
  const sorted = monthSort(company.emissions.map((e) => e.yearMonth));
  const sliced = sliceByRange(company.emissions, range);
  const cumulative = runningTotal(sliced.map((e) => e.emissions));

  const chartData = sliced.map((e, i) => ({
    yearMonth: e.yearMonth,
    emissions: e.emissions,
    cumulative: cumulative[i],
  }));

  const totalTax = calcTax(cumulative[cumulative.length - 1]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{company.name}</h1>
      <RangeSelector />
      <TrendChart data={chartData} />
      <div className="bg-white rounded-2xl shadow p-4 mt-4 text-center">
        <p className="text-lg font-semibold">expected fee (range)</p>
        <p className="text-2xl font-bold text-accent">${totalTax.toFixed(0)}</p>
      </div>
    </div>
  );
}
