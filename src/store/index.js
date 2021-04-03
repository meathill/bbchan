import { createStore } from 'vuex';

export const SET_CURRENT_USER = 'setCurrentUser';
export const SET_ACCESS_FROM = 'setAccessFrom';
const state = {
  currentUser: null,
  accessFrom: null,
};
const mutations = {
  [SET_CURRENT_USER](state, user) {
    state.currentUser = {
      ...user.toJSON(),
      model: user,
    };
  },
  [SET_ACCESS_FROM](state, from) {
    state.accessFrom = from;
  },
};
const actions = {

};

const store = createStore({
  state,
  mutations,
  actions,
});

export default store;
