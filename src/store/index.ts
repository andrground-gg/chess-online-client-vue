import { createStore } from "vuex";
import userModule from '@/store/modules/user/index';

export default createStore({
  modules: {
    userModule
  }
});