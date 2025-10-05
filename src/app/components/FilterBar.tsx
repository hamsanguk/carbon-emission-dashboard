"use client";
import { useMemo } from "react";
import { useDashboardStore } from "@/app/store/useDashboardStore";
import type { Company } from "@/app/lib/types";
import { getCountries, filterCompaniesByCountry } from "@/app/lib/utils";

type Props = { companies: Company[] };

export default function FilterBar({ companies }: Props) {
  const { activeCountry, activeCompanyId, setCountry, setCompany } = useDashboardStore();

  const countryOptions = useMemo(() => ["all", ...getCountries(companies)], [companies]);
  const companyOptions = useMemo(() => {
    const list = filterCompaniesByCountry(companies, activeCountry);
    return ["all", ...list.map(c => c.id)];
  }, [companies, activeCountry]);

  const companyIdToName = useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach(c => map.set(c.id, c.name));
    return map;
  }, [companies]);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Country */}
      <label className="text-sm font-medium">Country</label>
      <select
        className="border rounded px-3 py-1 bg-white"
        value={activeCountry}
        onChange={(e) => setCountry(e.target.value as any)}
      >
        {countryOptions.map(code => (
          <option key={code} value={code}>
            {code === "all" ? "All Countries" : code}
          </option>
        ))}
      </select>

      {/* Company */}
      <label className="text-sm font-medium">Company</label>
      <select
        className="border rounded px-3 py-1 bg-white"
        value={activeCompanyId}
        onChange={(e) => setCompany(e.target.value as any)}
      >
        {companyOptions.map(id => (
          <option key={id} value={id}>
            {id === "all" ? "All Companies" : companyIdToName.get(id) ?? id}
          </option>
        ))}
      </select>
    </div>
  );
}
