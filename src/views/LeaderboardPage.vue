<template>
  <div class="base-container">
    <div class="grid__item">
      <div class="leaderboard-layout">
        <div class="mode-buttons">
          <button 
            @click="$router.push('/leaderboard/bullet/1')"
            :class="[
              'btn',
              mode === 'bullet' ? 'btn--chosen' : ''
            ]"
          >Bullet</button>

          <button 
            @click="$router.push('/leaderboard/blitz/1')"
            :class="[
              'btn',
              mode === 'blitz' ? 'btn--chosen' : ''
            ]"
          >Blitz</button>

          <button 
            @click="$router.push('/leaderboard/rapid/1')"
            :class="[
              'btn',
              mode === 'rapid' ? 'btn--chosen' : ''
            ]"
          >Rapid</button>
        </div>
        <Leaderboard 
          @changeTotalPagesVal="changeTotalPagesValue"
          @loading="isLoading = true"
          :detailed="true" 
          :playersAmount="20" 
          :page="page"
          :mode="mode"
        ></Leaderboard>
        <div v-if="!isLoading && parseInt(page) <= totalPages" class="page-buttons">
          <button 
            @click="$router.push(`/leaderboard/${mode}/1`)"
            :disabled="parseInt(page) === 1"
          >First</button>

          <button
            @click="$router.push(`/leaderboard/${mode}/${parseInt(page) - 1}`)"
            :disabled="parseInt(page) === 1"
          >
            <span class="arrow left"></span>
          </button>

          <button 
            v-for="pageNum in pagesArr"
            :key="pageNum"
            :disabled="pageNum === parseInt(page)"
            @click="$router.push(`/leaderboard/${mode}/${pageNum}`)"
            :class="[
              'btn',
              pageNum === parseInt(page) ? 'btn--chosen' : ''
            ]"
          >{{pageNum}}</button>

          <button
            @click="$router.push(`/leaderboard/${mode}/${parseInt(page) + 1}`)"
            :disabled="parseInt(page) === totalPages"
          >
            <span class="arrow right"></span>
          </button>
          
          <button 
            @click="$router.push(`/leaderboard/${mode}/${totalPages}`)"
            :disabled="parseInt(page) === totalPages"
          >Last</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, Ref, ComputedRef } from 'vue'; 
import { Router, useRouter } from 'vue-router';
import Leaderboard from '@/components/Leaderboard.vue';

export default {
  props: {
    mode: {
      type: String,
      required: true,
      validator: function(val: string): boolean {
        return ['bullet', 'blitz', 'rapid'].includes(val);
      }
    },
    page: {
      type: [String, Number],
      required: true
    }
  },
  setup(props: any): Record<string, unknown> {
    const router: Router = useRouter();

    let isLoading: Ref<boolean> = ref(true);
    const totalPages: Ref<number> = ref(-1);
    let pagesArr: ComputedRef<number[]> = computed(() => {
      let arr: number[] = [];
      if (totalPages.value <= 3) {
        arr = [1, 2, 3];
      }
      else if (parseInt(props.page) <= totalPages.value - 2) {
        arr = [parseInt(props.page), parseInt(props.page) + 1, parseInt(props.page) + 2];
      }
      else if (parseInt(props.page) === totalPages.value - 1) {
        arr = [parseInt(props.page) - 1, parseInt(props.page), parseInt(props.page) + 1];
      }
      else if (parseInt(props.page) === totalPages.value) {
        arr = [parseInt(props.page) - 2, parseInt(props.page) - 1, parseInt(props.page)];
      }

      return arr;
    });

    const changeTotalPagesValue = (payload: number): void => {
      totalPages.value = payload;
      isLoading.value = false;

      if (parseInt(props.page) > totalPages.value)
        router.replace(`/leaderboard/${props.mode}/${totalPages.value}`);
    }

    return {
      changeTotalPagesValue,
      totalPages,
      pagesArr,
      isLoading
    }
  },
  components: {
    Leaderboard
  }
}
</script>

<style>

</style>