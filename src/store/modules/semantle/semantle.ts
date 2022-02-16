import { RootState } from '@/store/store.interfaces';
import { Module } from 'vuex';
import { SemantleState } from './semantle.interfaces';

export const SemantleStoreState: () => SemantleState = () => ({
  semantles: [],
});

export const SemantleStoreMutations = {};

export const SemantleStoreActions = {};

export const SemantleStoreGetters = {};

export const semantle: Module<SemantleState, RootState> = {
  namespaced: true,
  state: SemantleStoreState,
  mutations: SemantleStoreMutations,
  actions: SemantleStoreActions,
  getters: SemantleStoreGetters,
};
