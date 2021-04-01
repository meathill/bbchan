import { createStore } from 'vuex';

export const SET_CURRENT_USER = 'setCurrentUser';
const state = {
  currentUser: null,
};
const mutations = {
  [SET_CURRENT_USER](state, user) {
    state.currentUser = {
      ...user.toJSON(),
      model: user,
    };
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
