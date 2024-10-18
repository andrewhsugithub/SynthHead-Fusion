import { create } from "zustand";

type States = {
  chatId: string; // chatId===avatarId
  hasCreatedTarget: boolean;
};

type Actions = {
  onCreateTarget: () => void;
};

const initialState: States = {
  chatId: "",
  hasCreatedTarget: false,
};

const useChatStore = create<States & Actions>((set, get) => ({
  ...initialState,
  onCreateTarget: () => set((state) => ({ hasCreatedTarget: true })),
}));

export default useChatStore;
