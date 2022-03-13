<template>
  <div class="modal-backdrop">
    <div class="modal modal--promotion">
      <button 
        @click="$emit('closeModal')"
        class="modal__close"
      >&times;</button>
      <div 
        v-if="color === 'black'"
        class="modal__pieces"
      >
        <img @click="$emit('choosePiece', 'q')" class="pieces__piece" src="@/assets/img/bQueen.png">
        <img @click="$emit('choosePiece', 'n')" class="pieces__piece" src="@/assets/img/bKnight.png">
        <img @click="$emit('choosePiece', 'r')" class="pieces__piece" src="@/assets/img/bRook.png">
        <img @click="$emit('choosePiece', 'b')" class="pieces__piece" src="@/assets/img/bBishop.png">
      </div>
      <div 
        v-else-if="color === 'white'"
        class="modal__pieces"
      >
        <img @click="$emit('choosePiece', 'q')" class="pieces__piece" src="@/assets/img/wQueen.png">
        <img @click="$emit('choosePiece', 'n')" class="pieces__piece" src="@/assets/img/wKnight.png">
        <img @click="$emit('choosePiece', 'r')" class="pieces__piece" src="@/assets/img/wRook.png">
        <img @click="$emit('choosePiece', 'b')" class="pieces__piece" src="@/assets/img/wBishop.png">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    color: {
      required: true,
      type: String,
      validator(val: string): boolean {
        return ['black', 'white'].includes(val);
      }
    }
  }
}
</script>

<style>

</style>