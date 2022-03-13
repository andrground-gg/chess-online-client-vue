<template>
  <div class="play">
    <h1 class="header">Play</h1>
    <div class="play__time-modes">
      <div class="time-modes__mode">
        <p class="mode__name">Bullet</p>
        <div class="mode__options">
          <button 
          @click="selectedTime = (selectedTime === '1' ? '' : '1'); selectedMode = 'bullet'"
          :class="['btn', selectedTime === '1' ? 'btn--chosen' : '']"
          >1</button>
          <button 
          @click="selectedTime = (selectedTime === '1|1' ? '' : '1|1'); selectedMode = 'bullet'"
          :class="['btn', selectedTime === '1|1' ? 'btn--chosen' : '']"
          >1|1</button>
          <button 
          @click="selectedTime = (selectedTime === '2|1' ? '' : '2|1'); selectedMode = 'bullet'"
          :class="['btn', selectedTime === '2|1' ? 'btn--chosen' : '']"
          >2|1</button>
        </div>
      </div>
      <div class="time-modes__mode">
        <p class="mode__name">Blitz</p>
        <div class="mode__options">
          <button 
            @click="selectedTime = (selectedTime === '3' ? '' : '3'); selectedMode = 'blitz'"
            :class="['btn', selectedTime === '3' ? 'btn--chosen' : '']"
          >3</button>
          <button 
            @click="selectedTime = (selectedTime === '3|2' ? '' : '3|2'); selectedMode = 'blitz'"
            :class="['btn', selectedTime === '3|2' ? 'btn--chosen' : '']"
          >3|2</button>
          <button 
            @click="selectedTime = (selectedTime === '5' ? '' : '5'); selectedMode = 'blitz'"
            :class="['btn', selectedTime === '5' ? 'btn--chosen' : '']"
          >5</button>
        </div>
      </div>
      <div class="time-modes__mode">
        <p class="mode__name">Rapid</p>
        <div class="mode__options">
          <button 
            @click="selectedTime = (selectedTime === '10' ? '' : '10'); selectedMode = 'rapid'"
            :class="['btn', selectedTime === '10' ? 'btn--chosen' : '']"
          >10</button>
          <button 
            @click="selectedTime = (selectedTime === '15|10' ? '' : '15|10'); selectedMode = 'rapid'"
            :class="['btn', selectedTime === '15|10' ? 'btn--chosen' : '']"
          >15|10</button>
          <button 
            @click="selectedTime = (selectedTime === '30' ? '' : '30'); selectedMode = 'rapid'"
            :class="['btn', selectedTime === '30' ? 'btn--chosen' : '']"
          >30</button>
        </div>
      </div>
    </div>
    <button 
      @click="startSearch"
      :disabled="selectedTime === '' || !authenticated || hasActiveGame"
      class="play__play-btn btn btn--full"
    >Play</button>
  </div>
</template>

<script lang="ts">
import SocketioService from '@/services/socketio.service';
import { Store, useStore } from 'vuex';
import { computed, ComputedRef, Ref, ref } from 'vue';

export default {
  setup(_: any, { emit } : any): Record<string, unknown> {
    const store: Store<any> = useStore();
    let selectedTime: Ref<string> = ref('');
    let selectedMode: Ref<string> = ref('');

    let authenticated: ComputedRef<boolean> = computed(() => store.getters.user?._id != null);
    let hasActiveGame: ComputedRef<boolean> = computed(() => store.getters.activeGame?._id != null);
    let user = computed(() => store.getters.user);

    const startSearch = (): void => {
      if (!authenticated.value || hasActiveGame.value)
        return;

      SocketioService.startSearch(selectedMode.value, selectedTime.value, user.value.username, user.value.stats[selectedMode.value].elo);
      emit('showSearch', { mode: selectedMode.value, timeMode: selectedTime.value});
    }

    return {
      selectedTime,
      selectedMode,
      authenticated,
      hasActiveGame,
      user,
      startSearch
    }
  }
}
</script>

<style>

</style>