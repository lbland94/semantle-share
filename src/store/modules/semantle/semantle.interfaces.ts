import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import {
  SemantleStoreActions,
  SemantleStoreGetters,
  SemantleStoreMutations,
} from './semantle';

export interface SemantleState {
  lines: Array<{ score: number; guess: string; number: number; logScore: number }>;
}

type SemantleNamespace<N extends string> = `semantle/${N}`;

export type SemantleStoreModuleType<S = SemantleState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch' | 'state'
> & {
  commit<
    K extends keyof typeof SemantleStoreMutations,
    P extends Parameters<typeof SemantleStoreMutations[K]>[1]
  >(
    key: SemantleNamespace<K>,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof SemantleStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof SemantleStoreGetters as SemantleNamespace<K>]: ReturnType<
      typeof SemantleStoreGetters[K]
    >;
  };
} & {
  dispatch<K extends keyof typeof SemantleStoreActions>(
    key: SemantleNamespace<K>,
    payload?: Parameters<typeof SemantleStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof SemantleStoreActions[K]>;
} & {
  state: {
    semantle: {
      [K in keyof SemantleState]: SemantleState[K];
    };
  };
};
