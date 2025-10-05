import { create } from "zustand";

type DashboardState = {
  activeCountry: "all" | string;      // "all", "US", "DE", "KO", "JP" 
  activeCompanyId: "all" | string;    // "all" 또는 회사 id
  range: number;                      // 3|6|9|12
  setCountry: (c: "all" | string) => void;
  setCompany: (id: "all" | string) => void;
  setRange: (r: number) => void;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  activeCountry: "all",
  activeCompanyId: "all",
  range: 3,
  setCountry: (c) => {
    const { activeCompanyId } = get();
    // 나라 변경 시, 기존 회사가 그 나라에 없을 수 있으므로 기본적으로 회사=all로 리셋
    set({ activeCountry: c, activeCompanyId: "all" });
  },
  setCompany: (id) => set({ activeCompanyId: id }),
  setRange: (r) => set({ range: r }),
}));
