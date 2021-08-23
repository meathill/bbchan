<template lang="pug">
.popup(v-if="isLoggedIn")
  .d-flex
    h4 Hello, {{currentUser.username}}
    a.ms-auto(
      href="#",
      :class="{disabled: isLogging}",
      @click="logout",
    ) 登出

login.popup(v-else)

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
import Login from '@/views/login';

const isLogging = ref(false);
const currentUser = ref(null);

const isLoggedIn = computed(() => {
  return !!currentUser.value;
});

async function logout() {
  if (isLogging.value) {
    return;
  }
  isLogging.value = true;
  try {
    await currentUser.model.logOut();
  } catch (e) {
    console.log(e);
  }
  currentUser.value = null;
  isLogging.value = false;
}

onBeforeMount(async () => {
  const user = User.current();
  if (user) {
    currentUser.value = user.toJSON();
    currentUser.model = user;
  }
});
</script>
