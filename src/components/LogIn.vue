<template>
  <div class="login">
    <h1 class="header">Login</h1>
    <form @submit.prevent="logIn" class="form">
      
      <p v-if="isErrorShown" class="form__error">Incorrect credentials</p>
      
      <div class="form__control">
        <label for="username">Username</label>
        <input type="text" id="username" v-model.trim="username">
      </div>

      <div class="form__control">
        <label for="password">Password</label>
        <input type="password" id="password" v-model.trim="password">
      </div>

      <button
        :disabled="false" 
        class="btn btn--full"
        type="submit"
      >Log In</button>

      <p v-if="switchOption">New? 
        <span @click="$emit('switch')">Sign up</span>
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import { Store, useStore } from 'vuex';
import { Ref, ref } from 'vue';
import { server } from "@/helper";

export default {
  props: {
    switchOption: {
      type: Boolean,
      required: true
    }
  },
  setup(_: any, { emit }: any): Record<string, unknown> {
    const store: Store<any> = useStore();

    const username: Ref<string> = ref(''); 
    const password: Ref<string> = ref(''); 

    let isErrorShown: Ref<boolean> = ref(false);

    const logIn = (): void => {
      const user = {
        username: username.value,
        password: password.value
      }

      fetch(`${server.baseURL}/login`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then(data => {
        store.dispatch('getUser', data.passport.user);
        emit('closeModal');
        isErrorShown.value = false;
      })
      .catch(err => isErrorShown.value = true);
    }

    return {
      logIn,
      username,
      password,
      isErrorShown
    }
  }
}
</script>

<style>

</style>