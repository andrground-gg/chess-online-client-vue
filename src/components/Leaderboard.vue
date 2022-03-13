<template>
  <div class="leaderboard">
    <div v-if="!isLoading" class="table__players">
      <div v-if="detailed" class="players__headers">
        <p class="headers__rank">Rank</p>
        <p class="headers__name">Player</p>
        <p class="headers__rating">Rating</p>
        <p class="headers__games">Games</p>
        <p class="headers__won">Won</p>
        <p class="headers__lost">Lost</p>
        <p class="headers__draw">Draw</p>
      </div>
      <router-link 
        v-for="(player, index) in players"
        :key="player._id"
        :to="`/profile/${player.username}`"
        class="players__player">
        <div :class="['player__place', 
          index + 1 + (playersAmount * (page - 1)) === 1 ? 'player__place--first' : 
          index + 1 + (playersAmount * (page - 1)) === 2 ? 'player__place--second' : 
          index + 1 + (playersAmount * (page - 1)) === 3 ? 'player__place--third' : ''
        ]">{{index + 1 + (playersAmount * (page - 1))}}</div>
        <div class="player__name">{{player.username}}</div>  
        <div class="player__elo">{{player.stats[mode].elo}}</div>  
        <div v-if="detailed" class="player__total-games">{{player.stats[mode].totalGames}}</div>  
        <div v-if="detailed" class="player__stats">
          <span class="stats__won">{{(Math.round(player.stats[mode].won / player.stats[mode].totalGames * 1000) / 10).toFixed(1)}}%</span>
          <span class="stats__lost">{{(Math.round(player.stats[mode].lost / player.stats[mode].totalGames * 1000) / 10).toFixed(1)}}%</span>
          <span class="stats__draw">{{(Math.round(player.stats[mode].draw / player.stats[mode].totalGames * 1000) / 10).toFixed(1)}}%</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, Ref } from 'vue';
import { server } from '@/helper';

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
    },
    mode: {
      type: String,
      required: true,
      validator: function(val: string): boolean {
        return ['bullet', 'blitz', 'rapid'].includes(val);
      }
    },
    page: {
      type: [String, Number],
      required: false,
      default: 1
    }
  },
  setup(props: any, { emit }: any): Record<string, unknown> {
    let isLoading: Ref<boolean> = ref(true);

    let players: Ref<Record<string, unknown>[]> = ref([]);

    const fetchLeaders = (): void => {
      emit('loading');
      isLoading.value = true;
      fetch(`${server.baseURL}/users`)
      .then(res => res.json())
      .then(data => {
        let sorted: Record<string, unknown>[] = [];
        isLoading.value = false;
        if (props.mode === 'bullet') {
          sorted = data.sort((a: { stats: { bullet: { elo: number; }; }; }, b: { stats: { bullet: { elo: number; }; }; }) => b.stats.bullet.elo - a.stats.bullet.elo);
          emit('changeTotalPagesVal', Math.ceil(sorted.length / props.playersAmount));
        }
        else if (props.mode === 'blitz') {
          sorted = data.sort((a: { stats: { blitz: { elo: number; }; }; }, b: { stats: { blitz: { elo: number; }; }; }) => b.stats.blitz.elo - a.stats.blitz.elo);
          emit('changeTotalPagesVal', Math.ceil(sorted.length / props.playersAmount));
        }
        else if (props.mode === 'rapid') {
          sorted = data.sort((a: { stats: { rapid: { elo: number; }; }; }, b: { stats: { rapid: { elo: number; }; }; }) => b.stats.rapid.elo - a.stats.rapid.elo);
          emit('changeTotalPagesVal', Math.ceil(sorted.length / props.playersAmount));
        }
        players.value = sorted.filter((_: any, idx: number) => idx > (props.page - 1) * props.playersAmount && idx <= props.page * props.playersAmount);
      });
    }
    onMounted(fetchLeaders);
    watch(() => [props.mode, props.page], fetchLeaders);

    return {
      players,
      isLoading,
      fetchLeaders
    }
  }
}
</script>

<style>

</style>