<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button 
        @click="$emit('closeModal')"
        class="modal__close"
      >&times;</button>
      <LogIn 
        v-if="isLogin" 
        :switchOption="false"
        @closeModal="$emit('closeModal')"
      ></LogIn>
      <SignUp 
        v-else 
        :switchOption="false"
        @closeModal="$emit('closeModal')"
      ></SignUp>
    </div>
  </div>
</template>

<script lang="ts">
import SignUp from '@/components/SignUp.vue';
import LogIn from '@/components/LogIn.vue';

export default {
  props: {
    isLogin: {
      type: Boolean,
      required: true
    }
  },
  components: {
    SignUp,
    LogIn
  }
}
</script>

<style>

</style>