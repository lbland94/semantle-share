import { RootState } from '@/store/store.interfaces';
import { Module } from 'vuex';
import { SemantleState } from './semantle.interfaces';

export const SemantleStoreState: () => SemantleState = () => ({
  lines: [],
});

export const SemantleStoreMutations = {
  setLines(state: SemantleState, payload: SemantleState['lines']) {
    state.lines = payload;
  },
};

export const SemantleStoreActions = {};

export const SemantleStoreGetters = {};

export const semantle: Module<SemantleState, RootState> = {
  namespaced: true,
  state: SemantleStoreState,
  mutations: SemantleStoreMutations,
  actions: SemantleStoreActions,
  getters: SemantleStoreGetters,
};
