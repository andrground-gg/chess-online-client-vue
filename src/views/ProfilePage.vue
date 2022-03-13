<template>
  <div class="base-container">
    <div class="grid__item">
      <div class="profile-layout">
        <div v-if="!isLoading" class="info">
          <h1>{{user.username}}</h1>
          <h3>{{new Date(user.registrationDate).toDateString().slice(4)}}</h3>
        </div>
        <div class="tabs">
          <button :class="['btn', showStats ? 'btn--chosen' : '']" @click="showStats = true">Stats</button>
          <button :class="['btn', !showStats ? 'btn--chosen' : '']" @click="showStats = false">Games</button>
        </div>

        <div v-if="!isLoading" v-show="showStats" id="stats" class="tab__content tab__content--active">
          <ModeStats 
            :mode="'bullet'"
            :stats="user.stats"
          ></ModeStats>
          <ModeStats 
            :mode="'blitz'"
            :stats="user.stats"
          ></ModeStats>
          <ModeStats 
            :mode="'rapid'"
            :stats="user.stats"
          ></ModeStats>
        </div>

        <div v-if="!isLoading && games.length !== 0" v-show="!showStats" id="games" class="tab__content">
          <div class="games__headers">
            <p class="headers__players">Players</p>
            <p class="headers__score">Score</p>
            <p class="headers__mode">Mode</p>
            <p class="headers__moves">Moves</p>
            <p class="headers__date">Date</p>
          </div>
          <div 
            v-for="game in games"
            :key="game.id"
            class="games__game"
          >
            <div class="game__players">
              <router-link :to="`/profile/${game.white.username}`" @click="showStats = true">{{game.white.username}}({{game.white.eloAtTheTime}})</router-link>
              <router-link :to="`/profile/${game.black.username}`" @click="showStats = true">{{game.black.username}}({{game.black.eloAtTheTime}})</router-link>
            </div>
            <div class="game__score">
              <p v-if="game.isFinished" :class="game.white.score === 1 && game.black.score === 1 ? '' : game.white.score === 1 ? 'score--green' : 'score--red'">{{game.white.score}}</p>
              <p v-if="game.isFinished" :class="game.white.score === 1 && game.black.score === 1 ? '' : game.white.score === 1 ? 'score--red' : 'score--green'">{{game.black.score}}</p>
              <p v-if="!game.isFinished" class="game__live">LIVE</p>
            </div>
            <div class="game__mode">
              <p>{{game.mode.charAt(0).toUpperCase() + game.mode.slice(1)}}</p>
            </div>
            <div class="game__moves">
              <p v-if="game.isFinished">{{game.moves}}</p>
              <p v-if="!game.isFinished" class="game__live">LIVE</p>
            </div>
            <div class="game__date">
              <p>{{new Date(game.date).toDateString().slice(4)}}</p>
            </div>
          </div>
        </div>
        <div v-else-if="games.length === 0" v-show="!showStats">
          <p>No games have been played yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Store, useStore } from 'vuex';
import { Router, useRouter } from 'vue-router';
import { ref, Ref, watch } from 'vue';
import ModeStats from '@/components/ModeStats.vue';
import { server } from '@/helper';

export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props: any): Record<string, unknown> {
    const store: Store<any> = useStore();
    const router: Router = useRouter();
    
    let showStats: Ref<boolean> = ref(true);
    let isLoading: Ref<boolean> = ref(true);
    let user: Ref<Record<string, unknown>> = ref({});
    let games: Ref<Record<string, unknown>[]> = ref([]);

    const initializeUser = (): void => {
      if (store.getters.user?.username === props.username) {
        user.value = store.getters.user;
        isLoading.value = false;
      }
      else {
        fetch(`${server.baseURL}/users/${props.username}`)
        .then(res => res.json())
        .then(data => {
          user.value = data;
          isLoading.value = false;
        })
        .catch(() => router.replace('/'));
      }

      fetch(`${server.baseURL}/games?username=${props.username}`)
        .then(res => res.json())
        .then(data => {
          games.value = data.sort((a: { date: Date; }, b: { date: Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
          isLoading.value = false;
      });
    }
    initializeUser();
    watch(() => props.username, initializeUser);

    return {
      showStats,
      user,
      games,
      initializeUser,
      isLoading
    }
  },
  components: {
    ModeStats
  }
}
</script>

<style>

</style>