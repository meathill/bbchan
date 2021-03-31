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

    .checkbox.mb-3
      label
        input.me-2(
          type="checkbox",
          value="remember-me",
        )
        | Remember me

    button.w-100.btn.btn-lg.btn-primary Sign in

  p.mt-5.mb-3.text-muted.text-center BB Chan &copy; 2021
</template>

<script>
import { ref } from 'vue';
import { User } from 'leancloud-storage';
export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const remember = ref(false);

    async function doLogin() {
      const user = await User.loginWithEmail(email.value, password.value);
    }

    return {
      email,
      password,
      remember,

      doLogin,
    };
  },
};
</script>
