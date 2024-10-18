import { create } from "zustand";

type States = {
  isCollapsed: boolean;
};

type Actions = {
  toggleCollapse: () => void;
};

const initialState: States = {
  isCollapsed: false,
};

const useSidebarStore = create<States & Actions>((set, get) => ({
  ...initialState,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));

export default useSidebarStore;
