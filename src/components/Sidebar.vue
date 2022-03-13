<template>
  <div class="sidebar-section">
    <div v-if="gameStarted" class="sidebar__chat">
      <div
        v-if="isDrawOffered" 
        class="chat__draw-offer"
      >
        <h3>Opponent has offered a draw. Accept?</h3>
        <button @click="$emit('draw')">Yes</button>
        <button @click="isDrawOffered=false">No</button>
      </div>
      <div v-if="savedChat?.length" class="chat__messages">
        <div 
          v-for="message in savedChat.map(el => el = { content: el.content, username: el.username, time: convertTime(el.time) })"
          :key="message.time"
          class="chat__message"
        >
        <p>{{message.time}} 
          <router-link :to="`/profile/${message.username}`">{{message.username}}</router-link>: {{message.content}}
        </p>
        </div>
      </div>      
      <div class="chat__buttons">
        <button
          :disabled="!joinedChat"
          class="btn"
          @click="$emit('offerDraw'); didSendDrawOffer=true"
        >Offer draw</button>
        <button
          :disabled="!joinedChat"
          class="btn"
          @click="$emit('surrender')"
        >Surrender</button>
      </div>
      <div class="chat__input-area">
        <input 
          :disabled="!joinedChat"
          v-model="content"
          class="input-area__input" 
          type="text"
          @keydown.enter="sendMessage"
        >
        <button 
          :disabled="!joinedChat"
          @click="sendMessage"
          class="input-area__send btn"
        >Send</button>
      </div>
    </div>
    <Play 
      v-if="!gameStarted"
      @showSearch="(payload) => $emit('showSearch', payload)" 
    ></Play>
  </div>
</template>

<script lang="ts">
import SocketioService from '@/services/socketio.service';
import { computed, ComputedRef, onMounted, Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Play from '@/components/Play.vue';
import { Store } from 'vuex';
import { Socket } from 'socket.io-client';

export default {
  props: {
    gameStarted: {
      required: true,
      type: Boolean
    },
    savedChat: {
      required: false,
      type: Array
    },
    joinedChat: {
      required: true,
      type: Boolean
    }
  },
  setup(props: any): Record<string, unknown> {
    const socket: Socket = SocketioService.getSocket();
    const store: Store<any> = useStore();

    let content: Ref<string> = ref('');

    let isDrawOffered: Ref<boolean> = ref(false);

    let gameId: ComputedRef<string> = computed(() => store.getters.activeGame?._id);
    let user: ComputedRef<Record<string, any>> = computed(() => store.getters.user);

    let didSendDrawOffer: Ref<boolean> = ref(false);

    socket.on('sendMessage', (payload: { username: string, content: string, time: string }) => {
      store.commit('addToChat', {
        username: payload.username,
        content: payload.content,
        time: payload.time
      });
    });

    watch(() => props.savedChat?.length, () => {
      setTimeout(scrollToBottom, 0);
    });

    onMounted(() => {
      setTimeout(scrollToBottom, 0);
    })

    socket.on('offerDraw', () => {
      if (!didSendDrawOffer.value) {
        isDrawOffered.value = true;
        setTimeout(scrollToBottom, 0);
      }
      else {
        didSendDrawOffer.value = false;
      }
    });

    const sendMessage = () => {
      if (content.value.trim() === '')
        return;

      SocketioService.sendMessage(gameId.value, user.value.username, content.value);
      content.value = '';
    }

    const convertTime = (dateString: string) => {
      let hours: string = new Date(dateString).getHours().toString();
      if (parseInt(hours) < 10) hours = '0' + hours;
      let minutes: string = new Date(dateString).getMinutes().toString();
      if (parseInt(minutes) < 10) minutes = '0' + minutes;

      return `${hours}:${minutes}`;
    }

    const scrollToBottom = () => {
      let chatElement = document.querySelector('.chat__messages');
      if (chatElement) {
        chatElement.scrollTo(0, chatElement.scrollHeight);
      }
    }

    return {
      gameId,
      user,
      content,
      sendMessage,
      convertTime,
      isDrawOffered,
      didSendDrawOffer
    }
  },
  components: {
    Play
  }
}
</script>

<style>

</style>