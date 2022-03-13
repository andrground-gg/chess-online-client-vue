<template>
  <div class="signup">
    <h1 class="header">Create an account</h1>
    <form @submit.prevent="signUp" class="form" id="form">

      <p v-if="isErrorShown" class="form__error">{{errorMsg}}</p>

      <div class="form__control">
        <label for="username">Username</label>
        <input type="text" id="username" v-model.trim="username">
      </div>

      <div class="form__control">
        <label for="email">Email</label>
        <input type="email" id="email" v-model.trim="email">
      </div>

      <div class="form__control">
        <label for="password">Password</label>
        <input type="password" id="password" v-model.trim="password">
      </div>

      <button
        :disabled="false" 
        class="btn btn--full"
        type="submit"
      >Sign Up</button>

      <p v-if="switchOption">Already have an account? 
        <span @click="$emit('switch')">Log in</span>
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
    const username: Ref<string> = ref(''); 
    const email: Ref<string> = ref(''); 
    const password: Ref<string> = ref(''); 
    const store: Store<any> = useStore();

    let isErrorShown: Ref<boolean> = ref(false);
    let errorMsg: Ref<string> = ref('');

    const signUp = (): void => {
      const user: Record<string, unknown> = {
        username: username.value,
        email: email.value,
        password: password.value
      }

      fetch(`${server.baseURL}/users/create`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then((data) => {
        if (data.statusCode !== 400) {
          isErrorShown.value = false;
          errorMsg.value = '';
          fetch(`${server.baseURL}/login`, {
            method: 'POST', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username, password: user.password })
          })
          .then(res => res.json())
          .then(data => {
            store.dispatch('getUser', data.passport.user);
            emit('closeModal');
          })
        }
        else {
          isErrorShown.value = true;
          errorMsg.value = data.message[0].charAt(0).toUpperCase() + data.message[0].slice(1);
        }
      });
    }

    return {
      signUp,
      username,
      email,
      password,
      isErrorShown,
      errorMsg
    }
  }
}
</script>

<style>

</style>