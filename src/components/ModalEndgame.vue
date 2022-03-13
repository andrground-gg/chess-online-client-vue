<template>
  <div class="modal-backdrop">
    <div class="modal modal--endgame">
      <button 
        @click="$emit('closeModal')"
        class="modal__close"
      >&times;</button>
      <div v-if="resultData?.white && resultData?.black" class="modal__data">
        <h1 class="data__result">{{ resultData.white.score === resultData.black.score ? "Draw" : (resultData.white.score === 1 ? "White Won" : "Black Won") }}</h1>
        <h2 class="data__mode">{{ gameData.mode.charAt(0).toUpperCase() + gameData.mode.slice(1) }}</h2>
        <div class="data__players">
          <div class="players__player">
            <h2 class="player__username">{{ gameData.white.username }}</h2>
            <p class="player__score" :class="resultData.white.score === 1 && resultData.black.score === 1 ? '' : resultData.white.score === 1 ? 'score--green' : 'score--red'">{{ resultData.white.score }}</p>
            <p class="player__rating">{{ resultData.white.newElo }} 
              <span :class="[ 'rating__diff', resultData.white.newElo - gameData.white.eloAtTheTime < 0 ? 'diff--red' : resultData.white.newElo - gameData.white.eloAtTheTime > 0 ? 'diff--green' : '']">({{ resultData.white.newElo - gameData.white.eloAtTheTime }})</span>
            </p>
          </div>
          <div class="players__headers">
            <p class="headers__username">Username</p>
            <p class="headers__score">Score</p>
            <p class="headers__rating">Rating</p>
          </div>
          <div class="players__player">
            <h2 class="player__username">{{ gameData.black.username }}</h2>
            <p class="player__score" :class="resultData.white.score === 1 && resultData.black.score === 1 ? '' : resultData.white.score !== 1 ? 'score--green' : 'score--red'">{{ resultData.black.score }}</p>
            <p class="player__rating">{{ resultData.black.newElo }} 
              <span :class="[ 'rating__diff', resultData.black.newElo - gameData.black.eloAtTheTime < 0 ? 'diff--red' : resultData.black.newElo - gameData.black.eloAtTheTime > 0 ? 'diff--green' : '']">({{ resultData.black.newElo - gameData.black.eloAtTheTime }})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    gameData: {
      required: true,
      type: Object
    },
    resultData: {
      required: true,
      type: Object
    }
  }
}
</script>

<style>

</style>