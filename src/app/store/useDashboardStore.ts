import { create } from "zustand";

type DashboardState = {
  activeCompanyId: string | null;
  range: number;
  setCompany: (id: string) => void;
  setRange: (r: number) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  activeCompanyId: "c1",
  range: 3,
  setCompany: (id) => set({ activeCompanyId: id }),
  setRange: (r) => set({ range: r }),
}));
