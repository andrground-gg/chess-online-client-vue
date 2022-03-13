import getters from './getters';
import actions from './actions';
import mutations from './mutations';

export default {
    namespaced: false,
    state() {
      return {
        user: {},
        activeGame: {}
      }
    },
    getters,
    actions,
    mutations
};