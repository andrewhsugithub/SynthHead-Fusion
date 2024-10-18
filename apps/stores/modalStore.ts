import { create } from "zustand";

type States = {
  activeModal: ModalType | null;
};
type Actions = {
  updateActiveModal: (modalType: ModalType | null) => void;
};

export enum ModalType {
  USER,
  AVATAR,
}

const initialStates: States = {
  activeModal: null,
};
export const useModalStore = create<States & Actions>((set, get) => ({
  ...initialStates,

  updateActiveModal: (modalType) => {
    set(() => ({ activeModal: modalType }));
  },
}));
