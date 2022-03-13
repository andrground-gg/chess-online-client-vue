<template>
  <div class="base-grid">
    <div class="grid__item">
      <Play @showSearch="(payload) => $emit('showSearch', payload)"></Play>
    </div>
    <div class="grid__item">
      <SignUp 
        v-if="!authenticated && homeToRegister" 
        :switchOption="true"
        @switch="$emit('switchToRegister')"
      ></SignUp>
      <LogIn
        v-else-if="!authenticated && !homeToRegister"
        :switchOption="true"
        @switch="$emit('switchToRegister')"
      ></LogIn>
      <div v-else class="profile-briefly">
        <div class="profile-briefly__general">
          <router-link :to="`/profile/${info.username}`">
            <h1 class="general__username">{{info.username.length > 10 ? info.username.splice(0, 10) + '..' : info.username}}</h1>
          </router-link>
          <h2 class="general__date">{{(new Date(info.registrationDate)).toDateString().slice(4)}}</h2>
        </div>
        <div class="profile-briefly__stats">
          <div class="stats__headers">
            <p class="headers__name">Mode</p>
            <p class="headers__rating">Rating</p>
            <p class="headers__games">Games</p>
          </div>
          <div class="stats__numbers">
            <div class="numbers__mode">
              <h3 class="mode__name">Bullet</h3>
              <p class="mode__rating">{{info.stats.bullet.elo}}</p>
              <p class="mode__total-games">{{info.stats.bullet.totalGames}}</p>
            </div>
            <div class="numbers__mode">
              <h3 class="mode__name">Blitz</h3>
              <p class="mode__rating">{{info.stats.blitz.elo}}</p>
              <p class="mode__total-games">{{info.stats.blitz.totalGames}}</p>
            </div>
            <div class="numbers__mode">
              <h3 class="mode__name">Rapid</h3>
              <p class="mode__rating">{{info.stats.rapid.elo}}</p>
              <p class="mode__total-games">{{info.stats.rapid.totalGames}}</p>
            </div>
          </div>
        </div>
      </div>  
    </div>
    <div class="grid__item">
      <Leaderboards :detailed="false" :playersAmount="5"></Leaderboards>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef } from 'vue';
import { Store, useStore } from 'vuex';
import SignUp from "@/components/SignUp.vue";
import LogIn from "@/components/LogIn.vue";
import Play from "@/components/Play.vue";
import Leaderboards from "@/components/Leaderboards.vue";

export default {
  props: {
    homeToRegister: {
      type: Boolean,
      required: true
    }
  },
  setup(props: any): Record<string, unknown> {
    const store: Store<any> = useStore();

    let authenticated: ComputedRef<boolean> = computed(() => store.getters.user?._id != null);

    const info: ComputedRef<Record<string, unknown>> = computed(() => store.getters.user);
    return {
      info,
      authenticated
    }
  },
  components: {
    SignUp,
    LogIn,
    Play,
    Leaderboards,
  }
}
</script>
