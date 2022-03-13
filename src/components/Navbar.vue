<template>
  <nav class="base-navbar">
    <router-link to="/">Home</router-link>
    <router-link v-if="authenticated" :to="`/profile/${$store.getters.user.username}`">Profile</router-link>
    <router-link :to=playLink>Play</router-link>
    <router-link to="/leaderboard">Leaderboard</router-link>
    <div class="navbar__auth-buttons">
      <button 
        class="btn"
        v-if="!authenticated"
        @click="$route.path !== '/' ? $emit('showModalSignUp') : $emit('focusSignUp')"
      >Sign up</button>
      <button 
        class="btn"
        v-if="!authenticated"
        @click="$route.path !== '/' ? $emit('showModalLogIn') : $emit('focusLogIn')"
      >Log in</button>
    </div>
    <div 
      v-if="isSearchVisible && authenticated"
      class="search"
    >
      <p>Searching...</p>
      <p>{{searchMode.charAt(0).toUpperCase() + searchMode.slice(1)}}</p>
      <p>{{searchTimeMode}}</p>
      <img class="search__gif" src="@/assets/img/load.gif">
      <button
        @click="$emit('cancelSearch')"
      >Cancel</button>
    </div>
    <router-link 
      v-if="authenticated"
      @click="logOut" 
      to="/logout"
      class="navbar__logout"
    >Log out</router-link>
  </nav>
</template>

<script lang="ts">
import { computed, ComputedRef, watch } from 'vue';
import { server } from "@/helper";
import { Store, useStore } from 'vuex';

export default {
  props: {
    isSearchVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    searchMode: {
      type: String,
      required: false,
      validator: function(val: string): boolean {
        return ['','bullet', 'blitz', 'rapid'].includes(val);
      }
    },
    searchTimeMode: {
      type: String,
      required: false
    }
  },
  setup(): Record<string, unknown> {
    const store: Store<any> = useStore();

    let authenticated: ComputedRef<boolean> = computed(() => store.getters.user?._id != null);

    watch(() => authenticated.value, () => {
      if (authenticated.value) {
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
          if (activeGame)
            store.dispatch('getActiveGame', activeGame._id);
        });
      }
    });

    let playLink: ComputedRef<string> = computed(() => {
      let link = '/play';
      if (store.getters.activeGame?._id)
        link += '/' + store.getters.activeGame._id;

      return link;
    });

    const logOut = (): void => {
      fetch(`${server.baseURL}/logout`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => res.json())
      .then(() => store.commit('unsetData'));
    }

    return {
      logOut,
      authenticated,
      playLink
    }
  }
}
</script>

<style>

</style>