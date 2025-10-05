"use client";
import { useMemo } from "react";
import { useDashboardStore } from "@/app/store/useDashboardStore";
import { fetchCompanies } from "@/app/lib/api";
import { useEffect, useState } from "react";
import type { Company } from "@/app/lib/types";
import {
  aggregateByCompany,
  aggregateEmissionsAcrossCompanies,
  calcTax,
  filterCompaniesByCountry,
  runningTotal,
  sliceByRange,
} from "@/app/lib/utils";
import TrendChart from "@/app/components/TrendChart";
import CompanyComparison from "@/app/components/CompanyComparison";
import TaxCard from "@/app/components/TaxCard";
import RangeSelector from "@/app/components/RangeSelector";
import FilterBar from "@/app/components/FilterBar";

export default function DashboardPage() {
  const { activeCountry, activeCompanyId, range } = useDashboardStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCompanies().then((cs) => {
      if (!mounted) return;
      setCompanies(cs);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filteredCompanies = useMemo(
    () => filterCompaniesByCountry(companies, activeCountry),
    [companies, activeCountry]
  );

  // 트렌드용 시계열: 회사=all이면 나라 내 전체 합산, 아니면 단일 회사
  const trendSeries = useMemo(() => {
    if (activeCompanyId === "all") {
      return aggregateEmissionsAcrossCompanies(filteredCompanies);
    }
    const sel = filteredCompanies.find(c => c.id === activeCompanyId);
    return sel ? sel.emissions : [];
  }, [filteredCompanies, activeCompanyId]);

  // 누적/범위
  const sliced = sliceByRange(trendSeries, range);
  const cumul = runningTotal(sliced.map(e => e.emissions));
  const chartData = sliced.map((e, i) => ({
    yearMonth: e.yearMonth,
    emissions: e.emissions,
    cumulative: cumul[i],
  }));
  const totalInRange = cumul[cumul.length - 1] ?? 0;

  // 회사 비교 막대 데이터(현재 나라 범위 내)
  const compareRows = useMemo(
    () => aggregateByCompany(filteredCompanies, range),
    [filteredCompanies, range]
  );

  // 헤더 타이틀
  const titleText = useMemo(() => {
    if (activeCompanyId !== "all") {
      const found = companies.find(c => c.id === activeCompanyId);
      return found ? `${found.name}` : "Company";
    }
    return activeCountry === "all" ? "All Companies (Global)" : `All Companies in ${activeCountry}`;
  }, [activeCompanyId, activeCountry, companies]);

  if (loading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 상단 바: 타이틀 + Range + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{titleText}</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <RangeSelector />
          <FilterBar companies={companies} />
        </div>
      </div>

      {/* 1열→2열 전환 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendChart data={chartData} />
        <div className="flex flex-col gap-6">
          <TaxCard totalTons={totalInRange} />
          <CompanyComparison data={compareRows.map(r => ({ name: r.name, total: r.total }))} />
        </div>
      </div>
    </div>
  );
}
