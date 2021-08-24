<template lang="pug">
.popup(v-if="isLoggedIn")
  .d-flex
    h4 Hello, {{currentUser.username}}
    btn.btn.btn-link.btn-sm.ms-auto.logout-button(
      href="#",
      :class="{disabled: isLogging}",
      @click="logout",
    ) 登出

  form(@submit.prevent="onSubmit")
    fieldset
      legend 同步弹幕
      .form-check
        input#sync-toggle.form-check-input(
          type="checkbox",
          v-model="sync",
        )
        label.form-check-label(
          for="sync-toggle",
        ) 启动

login.popup(
  v-else,
  @logged-in="onLoggedIn",
)

</template>

<script setup>
import {
  ref,
  computed,
  onBeforeMount,
} from 'vue';
import {
  User,
} from 'leancloud-storage';
import Login from '@/component/login';

const isLogging = ref(false);
const currentUser = ref(null);
const sync = ref(false);

const isLoggedIn = computed(() => {
  return !!currentUser.value;
});

async function logout() {
  if (isLogging.value) {
    return;
  }
  isLogging.value = true;
  try {
    await User.logOut();
  } catch (e) {
    console.log(e);
  }
  currentUser.value = null;
  isLogging.value = false;
}

async function onSubmit() {

}

async function onLoggedIn() {

}

onBeforeMount(async () => {
  const user = User.current();
  if (user) {
    currentUser.value = user.toJSON();
    currentUser.model = user;
  }
});
</script>
