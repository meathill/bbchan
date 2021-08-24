<template lang="pug">
form(@submit.prevent="doLogin")
  h1.h3.mb-3.fw-normal.text-center Please sign in

  .form-floating.mb-1
    input#email.form-control(
      type="email"
      placeholder="name@example.com",
      v-model="email",
      required,
    )
    label(for="email") Email address

  .form-floating.mb-3
    input#password.form-control(
      type="password"
      placeholder="Password"
      v-model="password"
      required,
    )
    label(for="password") Password

  .alert(
    v-if="message",
    :class="status ? 'alert-success' : 'alert-danger'",
  ) {{message}}

  button.w-100.btn.btn-lg.btn-primary(
    :disabled="isLogging",
  )
    span.spinner-border.spinner-border-sm.me-2(
      v-if="isLogging",
    )
    | Sign in

p.mt-4.mb-2.text-muted.text-center BB Chan &copy; 2021
</template>

<script setup>
import {
  ref,
  defineEmits,
} from 'vue';
import { User } from 'leancloud-storage';

const isLogging = ref(false);
const message = ref('');
const status = ref();
const email = ref('');
const password = ref('');

const emit = defineEmits(['loggedIn']);

async function doLogin() {
  isLogging.value = true;
  message.value = status.value = null;
  try {
    const user = await User.loginWithEmail(email.value, password.value);
    status.value = true;
    message.value = '登录成功';
    emit('loggedIn', user);
  } catch (e) {
    message.value = '登录失败。' + e.message;
  }
  isLogging.value = false;
}
</script>
