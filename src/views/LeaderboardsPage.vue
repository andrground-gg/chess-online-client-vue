<template>
  <div class="base-container">
    <div class="grid__item">
      <Leaderboards :detailed="true" :playersAmount="10"></Leaderboards>
    </div>
  </div>
</template>

<script lang="ts">
import Leaderboards from '@/components/Leaderboards.vue';

export default {
  components: {
    Leaderboards
  }
}
</script>

<style>

</style>