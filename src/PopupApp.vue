<template lang="pug">
.popup(v-if="isLoggedIn")
  .d-flex
    h4 Hello, {{currentUser.username}}
    button.btn.btn-link.btn-sm.ms-auto.logout-button(
      type="button",
      :class="{disabled: isLogging}",
      @click="logout",
    ) 登出

  form(
    ref="form",
    @submit.prevent="onSubmit",
  )
    fieldset.mb-3
      legend 同步弹幕
      .form-check
        input#sync-toggle.form-check-input(
          type="checkbox",
          v-model="sync",
          @change="onSwitch",
        )
        label.form-check-label(
          for="sync-toggle",
        ) 启动

    button.btn.btn-primary(
      v-if="isChanged",
    ) 保存

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
const isChanged = ref(false);
const currentUser = ref(null);
const sync = ref(false);
const form = ref(null);

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

function onSwitch() {
  isChanged.value = true;
}

async function onSubmit() {
  if (form.value.matches(':invalid')) {
    return;
  }

  isChanged.value = false;
  const result = await chrome.runtime.sendMessage({
    sender: 'bbjiang',
    sync: sync.value,
  });
}

async function onLoggedIn() {

}

onBeforeMount(async () => {
  const user = User.current();
  if (!user) {
    return;
  }
  currentUser.value = user.toJSON();
  currentUser.model = user;

  const tab = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const {url} = tab;

});
</script>
