<template>
  <div class="base-flex">
    <div class="grid__item">
      <BoardSection
        :gameStarted="!!id"
        :gameData="gameData"
        :joinedChat="joinedChat"
        @setMoves="(movesAmount) => moves = movesAmount"
        @endGame="(whiteScore, blackScore) => endGame(whiteScore = whiteScore, blackScore = blackScore)"
      ></BoardSection>
    </div>
    <Sidebar 
      :gameStarted="!!id"
      :joinedChat="joinedChat"
      :savedChat="gameData?.chat"
      @showSearch="(payload) => $emit('showSearch', payload)"
      @surrender="() => user.username === gameData.black.username ? endGame(whiteScore = 1, blackScore = 0) : endGame(whiteScore = 0, blakcScore = 1)"
      @draw="endGame(1, 1)"
      @offerDraw="offerDraw"
    ></Sidebar>
    <ModalEndgame
      :gameData="gameData"
      :resultData="resultData"
      v-if="isModalVisible"
      @closeModal="closeModalAndRedirect"
    ></ModalEndgame>
  </div>
</template>

<script lang="ts">
import SocketioService from '@/services/socketio.service';
import { server } from '@/helper';
import { Router, useRouter } from 'vue-router';
import { Store, useStore } from 'vuex';
import { computed, ComputedRef, onUnmounted, reactive, Ref, ref, watch } from 'vue';
import BoardSection from "@/components/BoardSection.vue";
import Sidebar from "@/components/Sidebar.vue";
import ModalEndgame from "@/components/ModalEndgame.vue";
import { Socket } from 'socket.io-client';

export default {
  props: {
    id: {
      required: false,
      type: String
    }
  },
  setup(props: any): Record<string, unknown> {
    const socket: Socket = SocketioService.getSocket();

    const router: Router = useRouter();
    const store: Store<any> = useStore();

    let moves: Ref<number> = ref(0);
    let joinedChat: Ref<boolean> = ref(false);

    let isModalVisible: Ref<boolean> = ref(false);
    let resultData: { white: { score: number|null, newElo: number|null }, black: { score: number|null, newElo: number|null } } = reactive({
      white: {
        score: null,
        newElo: null
      },
      black: {
        score: null,
        newElo: null
      }
    });
    let gameData: ComputedRef<Record<string, any>> = computed(() => store.getters.activeGame);
    let user: ComputedRef<Record<string, any>> = computed(() => store.getters.user);

    socket.on('endGame', (payload: { white: { score: number, newElo: number }, black: { score: number, newElo: number } }) => {  
      socket.off('sendMessage');
      socket.off('offerDraw');

      resultData.white.score = payload.white.score;
      resultData.black.score = payload.black.score;
      resultData.white.newElo = payload.white.newElo;
      resultData.black.newElo = payload.black.newElo;

      isModalVisible.value = true;
    });
  

    const checkForGame = () => {
      if (props.id) {
        fetch(`${server.baseURL}/games/${props.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 500) {
            router.replace('/play');
          }
          else {
            setTimeout(() => {
              if (!user.value?._id || data.isFinished || (data.black.username !== user.value.username && data.white.username !== user.value.username)) {
                router.replace('/play');
              }
              else {
                SocketioService.joinChat(gameData.value._id);
                joinedChat.value = true;
              }
            }, 500);
          }
        })
        .catch(() => router.replace('/play'));
      }
    }
    
    watch(() => props.id, () => {
      checkForGame();
    });
    checkForGame();

    onUnmounted(() => {
      socket.off('sendMessage');
      socket.off('offerDraw');

      //SocketioService.leaveChat(gameData.value._id);
      joinedChat.value = false;
    })
    
    watch(() => user.value, () => {
      if(user.value?._id) {
        fetch(`${server.baseURL}/games?username=${store.getters.user.username}`, {
          method: 'GET', 
          headers: {
            'Access-Control-Allow-Credentials': true
          } as any,
          credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
          let activeGame = data.filter((game: { isFinished: boolean }) => game.isFinished === false)[0];
          if (activeGame) {
            router.replace('/play/' + activeGame._id);
            SocketioService.joinChat(gameData.value._id);
            joinedChat.value = true;
          }
        });
      }
    });

    const offerDraw = () => {
      SocketioService.offerDraw(gameData.value._id);
    }

    const endGame = (whiteScore: number, blackScore: number) => {  
      SocketioService.endGame(gameData.value._id, gameData.value.mode, { username: gameData.value.white.username, score: whiteScore, oldElo: gameData.value.white.eloAtTheTime }, { username: gameData.value.black.username, score: blackScore, oldElo: gameData.value.black.eloAtTheTime }, moves.value);
    }

    const closeModalAndRedirect = () => {
      isModalVisible.value = true;
      router.push('/')
      .then(() => {
        store.commit('unsetActiveGame');
      });
    }

    return {
      gameData,
      isModalVisible,
      offerDraw,
      user,
      resultData,
      joinedChat,
      closeModalAndRedirect,
      endGame,
      moves
    }
  },
  components: {
    BoardSection,
    Sidebar,
    ModalEndgame
  }
}
</script>

<style>

</style>