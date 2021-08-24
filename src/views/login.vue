<template lang="pug">
main.form-signin
  login(
    @logged-in="onLoggedIn",
  )
</template>

<script setup>
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {User} from 'leancloud-storage';
import { SET_CURRENT_USER } from '@/store';
import Login from '@/component/login';
import {onBeforeMount} from "vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

async function onLoggedIn(user) {
  store.commit(SET_CURRENT_USER, user);
  if (store.state.accessFrom) {
    router.replace(store.state.accessFrom);
  } else {
    router.replace({
      name: 'danmu',
    });
  }
}



onBeforeMount(async () => {
  if (route.name === 'user.logout') {
    await User.logOut();
  }
});
</script>
