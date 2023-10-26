import {InjectionKey} from 'vue'
import {createStore, Store, useStore as baseUseStore} from 'vuex'

export interface IState {
    isLoggedIn: boolean,
    userId: number,
}

export const key: InjectionKey<Store<IState>> = Symbol() as InjectionKey<Store<IState>>;

export const store = createStore<IState>({
    state: {
        isLoggedIn: false,
        userId: 0,
    },
    mutations: {
        login(state, userId: number) {
            state.isLoggedIn = true;
            state.userId = userId;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.userId = 0;
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        userId: state => state.userId,
    }
})

// define your own `useStore` composition function
export function useStore() {
    return baseUseStore(key)
}