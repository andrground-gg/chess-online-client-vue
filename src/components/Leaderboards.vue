<template>
  <div class="leaderboards">
    <h1 class="header">Leaderboards</h1>
    <div class="leaderboards__tables">
      <div class="tables__table">
        <p class="table__mode-name">Bullet</p>
        <Leaderboard 
          :detailed="detailed" 
          :playersAmount="playersAmount"
          :mode="'bullet'"
        ></Leaderboard>
        <router-link class="table__see-all" v-if="detailed" to="/leaderboard/bullet/1">See All</router-link>
      </div>
      <div class="tables__table">
        <p class="table__mode-name">Blitz</p>
        <Leaderboard 
          :detailed="detailed" 
          :playersAmount="playersAmount"
          :mode="'blitz'"
        ></Leaderboard>
        <router-link class="table__see-all" v-if="detailed" to="/leaderboard/blitz/1">See All</router-link>
      </div>
      <div class="tables__table">
        <p class="table__mode-name">Rapid</p>
        <Leaderboard 
          :detailed="detailed" 
          :playersAmount="playersAmount"
          :mode="'rapid'"
        ></Leaderboard>
        <router-link class="table__see-all" v-if="detailed" to="/leaderboard/rapid/1">See All</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Leaderboard from '@/components/Leaderboard.vue';

export default {
  props: {
    detailed: {
      type: Boolean,
      required: true,
    },
    playersAmount: {
      type: Number,
      required: true,
      default: 5
    }
  },
  components: {
    Leaderboard
  }
}
</script>

<style>

</style>