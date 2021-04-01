<template lang="pug">
main.form-signin
  form(@submit.prevent="doLogin")
    h1.h3.mb-3.fw-normal.text-center Please sign in

    .form-floating
      input#email.form-control(
        type="email"
        placeholder="name@example.com",
        v-model="email",
        required,
      )
      label(for="email") Email address

    .form-floating
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

  p.mt-5.mb-3.text-muted.text-center BB Chan &copy; 2021
</template>

<script>
import {
  ref,
  onMounted,
} from 'vue';
import { User } from 'leancloud-storage';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { SET_CURRENT_USER } from '@/store';

export default {
  setup() {
    const isLogging = ref(false);
    const message = ref('');
    const status = ref();
    const email = ref('');
    const password = ref('');
    const remember = ref(false);
    const store = useStore();
    const route = useRoute();

    async function doLogin() {
      isLogging.value = true;
      message.value = status.value = null;
      try {
        const user = await User.loginWithEmail(email.value, password.value);
        store.commit(SET_CURRENT_USER, user);
        status.value = true;
        message.value = '登录成功';
      } catch (e) {
        message.value = '登录失败。' + e.message;
      }
      isLogging.value = false;
    }

    onMounted(() => {
      if (route.name === 'user.logout') {

      }
    });

    return {
      isLogging,

      email,
      password,
      remember,
      message,
      status,

      doLogin,
    };
  },
};
</script>
