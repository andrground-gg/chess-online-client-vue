<template>
  <div class="base">
    <div class="base-layout">
      <Navbar
        @showModalLogIn="showModal(); isModalLogIn = true;"
        @showModalSignUp="showModal(); isModalLogIn = false;"
        @focusLogIn="homeToRegister = false; focusOnInput()"
        @focusSignUp="homeToRegister = true; focusOnInput()"
        :isSearchVisible="isSearchVisible"
        :searchMode="searchMode"
        :searchTimeMode="searchTimeMode"
        @cancelSearch="cancelSearch"
      ></Navbar>
      <router-view 
        @showSearch="showSearch"
        :homeToRegister="homeToRegister"
        @switchToRegister="homeToRegister = !homeToRegister"
      ></router-view>
    </div>

    <ModalAuth 
      v-if="$route.path !== '/'"
      v-show="isModalVisible"
      :isLogin="isModalLogIn"
      @closeModal="closeModal"
    ></ModalAuth>
  </div>
</template>

<script lang="ts">
import SocketioService from '@/services/socketio.service';
import { onBeforeUnmount, Ref, ref } from 'vue';
import { Store, useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { server } from '@/helper';
import Navbar from '@/components/Navbar.vue';
import ModalAuth from '@/components/ModalAuth.vue';
import { Socket } from 'socket.io-client';

export default {
  setup(): Record<string, unknown> {
    SocketioService.setupSocketConnection();
    const socket: Socket = SocketioService.getSocket();
    const router = useRouter();

    const store: Store<any> = useStore();

    let isModalVisible: Ref<boolean> = ref(false);
    let isSearchVisible: Ref<boolean> = ref(false);
    let isModalLogIn: Ref<boolean> = ref(false);
    let homeToRegister: Ref<boolean> = ref(true);
    let searchMode: Ref<string> = ref('');
    let searchTimeMode: Ref<string> = ref('');

    socket.on('startGame', (gameId: string) => {
      isSearchVisible.value = false;
      router.push(`/play/${gameId}`);
      store.dispatch('getActiveGame', gameId);
    });
  
    socket.on('endGame', (payload: { white: { score: number, newElo: number }, black: { score: number, newElo: number } }) => {  
      if (router.currentRoute.value.path.split('/')[1] === 'play')
        return;

      store.commit('unsetActiveGame');
      socket.off('sendMessage');
      socket.off('offerDraw');
    });

    fetch(`${server.baseURL}/protected`, {
      method: 'GET', 
      headers: {
        'Access-Control-Allow-Credentials': true
      } as any,
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => store.dispatch('getUser', data.passport.user))

    const showModal = (): void => {
      isModalVisible.value = true;
    }

    const focusOnInput = (): void => {
      setTimeout(() => {
        document.querySelector('input')!.focus();
      }, 0);
    }

    const closeModal = (): void => {
      isModalVisible.value = false;
    }

    const showSearch = (payload: { mode: string, timeMode: string}): void => {
      isSearchVisible.value = true;
      searchMode.value = payload.mode;
      searchTimeMode.value = payload.timeMode;
    }

    const cancelSearch = (): void => {
      isSearchVisible.value = false;
      SocketioService.cancelSearch(searchMode.value, searchTimeMode.value, store.getters.user.username);
    }

    onBeforeUnmount(SocketioService.disconnect);
  
    return {
      isModalVisible,
      isSearchVisible,
      isModalLogIn,
      homeToRegister,
      showModal,
      focusOnInput,
      closeModal,
      showSearch,
      searchMode,
      searchTimeMode,
      cancelSearch
    }
  },
  components: {
    Navbar,
    ModalAuth
  }
}
</script>


<style>

</style>
