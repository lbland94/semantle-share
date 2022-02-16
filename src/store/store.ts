import { createStore } from 'vuex';
import { semantle } from '@/store/modules/semantle/semantle';
import { RootState, StoreType } from './store.interfaces';

export const RootStoreState: () => RootState = () => ({});

export const RootStoreMutations = {};

export const RootStoreActions = {};

export const RootStoreGetters = {};

export const store = createStore({
  state: RootStoreState,
  mutations: RootStoreMutations,
  actions: RootStoreActions,
  modules: {
    semantle,
  },
}) as StoreType;

export function useStore() {
  return store as StoreType;
}
