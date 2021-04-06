<template lang="pug">
nav.navbar.navbar-expand-lg.navbar-dark.bg-dark
  .container
    .navbar-brand.text-white.me-5 BB 酱
    button.navbar-toggler(
      type="button",
    )
      span.navbar-toggler-icon

    #main-navbar.collapse.navbar-collapse(
      v-if="currentUser",
    )
      ul.navbar-nav.me-auto
        li.nav-item
          router-link.nav-link(
            :to="{name: 'danmu'}",
          ) 弹幕列表
        li.nav-item
          router-link.nav-link(
            :to="{name: 'lucky.list'}",
          ) 🎉 抽奖

      ul.navbar-nav.mb-auto
        li.nav-item.dropdown(
          v-if="currentUser",
        )
          input#user-dropdown.dropdown-toggle-checkbox(
            type="checkbox",
            hidden,
          )
          label.nav-link.dropdown-toggle(
            for="user-dropdown",
            role="button",
          ) {{currentUser}}
          ul.dropdown-menu
            li
              router-link.dropdown-item(
                :to="{name: 'user.logout'}",
              ) 登出
        li.nav-item(
          v-else,
        )
          router-link.nav-link(
            :to="{name: 'user.login'}",
          ) Login

div(:class="containerStyle")
  router-view
</template>

<script>
import {
  watch,
  ref,
  onBeforeMount, computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { User } from 'leancloud-storage';
import { SET_ACCESS_FROM, SET_CURRENT_USER } from '@/store';

export default {
  setup() {
    const isLoading = ref(false);
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const containerStyle = ref();

    const currentUser = computed(() => {
      return store.state.currentUser && store.state.currentUser.email ||
        '';
    });

    function onRouteChange(name) {
      containerStyle.value = name && name.startsWith('user.')
        ? 'w-100 flex-grow-1'
        : 'container pt-3';
    }

    watch(() => route.name, onRouteChange);
    onBeforeMount(() => {
      onRouteChange(route.name);

      const user = User.current();
      if (user) {
        store.commit(SET_CURRENT_USER, user);
      } else {
        const { name, params, query, hash } = route;
        store.commit(SET_ACCESS_FROM, {
          name,
          params,
          query,
          hash,
        });
        router.replace({
          name: 'user.login',
        });
      }
    });

    return {
      isLoading,

      containerStyle,
      currentUser,
    };
  },
};
</script>
