<template>
  <div class="stats__mode">
    <h2 class="mode__name header">{{mode === 'bullet' ? 'Bullet' : (mode === 'blitz' ? 'Blitz' : 'Rapid')}}</h2>
    <div class="mode__general">
      <div class="general__elo">
        <h3 class="elo__value">{{mode === 'bullet' ? stats.bullet.elo : (mode === 'blitz' ? stats.blitz.elo : stats.rapid.elo)}}</h3>
        <p>Rating</p>
      </div>
      <div class="general__total-games">
        <h3 class="total-games__value">{{mode === 'bullet' ? stats.bullet.totalGames : (mode === 'blitz' ? stats.blitz.totalGames : stats.rapid.totalGames)}}</h3>
        <p>Total games</p>
      </div>
    </div>
    <div class="mode__game-bar" v-if="(mode === 'bullet' && info.bullet.totalGames !== 0) || (mode === 'blitz' && info.blitz.totalGames !== 0) || (mode === 'rapid' && info.rapid.totalGames !== 0)">
      <div class="game-bar__header game-bar--top">
        <span class="game-bar__section game-bar--green" :style="{ 'flex-basis': wonPercentToUse + '%' }">{{wonPercentToUse}}%</span>
        <span class="game-bar__section game-bar--grey" :style="{ 'flex-basis': drawPercentToUse + '%' }">{{drawPercentToUse}}%</span>
        <span class="game-bar__section game-bar--red" :style="{ 'flex-basis': lostPercentToUse + '%' }">{{lostPercentToUse}}%</span>
      </div>
      <div class="game-bar__bar" v-if="(mode === 'bullet' && info.bullet.totalGames !== 0) || (mode === 'blitz' && info.blitz.totalGames !== 0) || (mode === 'rapid' && info.rapid.totalGames !== 0)">
        <span class="game-bar__section game-bar--green" :style="{ 'flex-grow': wonPercentToUse }"></span>
        <span class="game-bar__section game-bar--grey" :style="{ 'flex-grow': drawPercentToUse }"></span>
        <span class="game-bar__section game-bar--red" :style="{ 'flex-grow': lostPercentToUse }"></span>
      </div>
      <div class="game-bar__header game-bar--bottom">
        <span class="game-bar__section game-bar--green" :style="{ 'flex-basis': wonPercentToUse + '%' }">{{mode === 'bullet' ? stats.bullet.won : (mode === 'blitz' ? stats.blitz.won : stats.rapid.won)}} Won</span>
        <span class="game-bar__section game-bar--grey" :style="{ 'flex-basis': drawPercentToUse + '%' }">{{mode === 'bullet' ? stats.bullet.draw : (mode === 'blitz' ? stats.blitz.draw : stats.rapid.draw)}} Drawn</span>
        <span class="game-bar__section game-bar--red" :style="{ 'flex-basis': lostPercentToUse + '%' }">{{mode === 'bullet' ? stats.bullet.lost : (mode === 'blitz' ? stats.blitz.lost : stats.rapid.lost)}} Lost</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, reactive, Ref } from 'vue';

export default {
  props: {
    mode: {
      type: String,
      required: true,
      validator: function(val: string): boolean {
        return ['bullet', 'blitz', 'rapid'].includes(val);
      }
    },
    stats: {
      type: Object,
      required: true
    }
  },
  setup(props: any): Record<string, unknown> {
    const info: { 
      bullet: { won: number, lost: number, totalGames: number }, 
      blitz: { won: number, lost: number, totalGames: number }, 
      rapid: { won: number, lost: number, totalGames: number } 
    } = reactive(props.stats);

    const wonBulletPercent: ComputedRef<number> = computed(() => Math.round(info.bullet.won / info.bullet.totalGames * 100));
    const lostBulletPercent: ComputedRef<number> = computed(() => Math.round(info.bullet.lost / info.bullet.totalGames * 100));
    const drawBulletPercent: ComputedRef<number> = computed(() => Math.round(100 - wonBulletPercent.value - lostBulletPercent.value));
    const wonBlitzPercent: ComputedRef<number> = computed(() => Math.round(info.blitz.won / info.blitz.totalGames * 100));
    const lostBlitzPercent: ComputedRef<number> = computed(() => Math.round(info.blitz.lost / info.blitz.totalGames * 100));
    const drawBlitzPercent: ComputedRef<number> = computed(() => Math.round(100 - wonBlitzPercent.value - lostBlitzPercent.value));
    const wonRapidPercent: ComputedRef<number> = computed(() => Math.round(info.rapid.won / info.rapid.totalGames * 100));
    const lostRapidPercent: ComputedRef<number> = computed(() => Math.round(info.rapid.lost / info.rapid.totalGames * 100));
    const drawRapidPercent: ComputedRef<number> = computed(() => Math.round(100 - wonRapidPercent.value - lostRapidPercent.value));

    const wonPercentToUse: ComputedRef<number> = computed(() => props.mode === 'bullet' ? wonBulletPercent.value : (props.mode === 'blitz' ? wonBlitzPercent.value : wonRapidPercent.value));
    const drawPercentToUse: ComputedRef<number> = computed(() => props.mode === 'bullet' ? drawBulletPercent.value : (props.mode === 'blitz' ? drawBlitzPercent.value : drawRapidPercent.value));
    const lostPercentToUse: ComputedRef<number> = computed(() => props.mode === 'bullet' ? lostBulletPercent.value : (props.mode === 'blitz' ? lostBlitzPercent.value : lostRapidPercent.value));
    return {
      info,
      wonPercentToUse,
      drawPercentToUse,
      lostPercentToUse
    }
  }
}
</script>

<style>

</style>