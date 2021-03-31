<template lang="pug">
nav.navbar.navbar-expand-lg.nvabar-dark.bg-dark
  .container
    .navbar-brand.text-white.me-5 BB 酱
    button.navbar-toggler(
      type="button",
    )
      span.navbar-toggler-icon

    #main-navbar.collapse.navbar-collapse
      ul.navbar-nav.me-auto
        li.nav-item
          router-link.nav-link(
            :to="{name: 'danmu'}",
          ) 弹幕
        li.nav-item
          button.btn.btn-success(
            type="button",
            @click="doOpenChoujiang",
          ) 🎉 抽奖

dialog.modal-content.w-50(
  ref="choujiang",
)
  header.modal-header
    h5.modal-title 开始抽奖
    button.btn-close(type="button", @click="doHideChoujiang")
  form#choujiang-form.modal-body(
    @submit.prevent="doChoujiang",
  )
    .form-group
      label.form-label(for="start-time") 开始时间
      input#start-time.form-control(
        type="datetime-local",
        v-model="startTime",
        required,
      )
    .form-group
      label.form-label(for="end-time") 开始时间
      input#end-time.form-control(
        type="datetime-local",
        v-model="endTime",
        required,
      )

  .modal-footer
    .alert.alert-success.text-center.py-2(v-if="winner") 🎉🎉 恭喜：
      strong {{winner}}
      | !! 🎉🎉
    button.btn.btn-primary(form="choujiang-form") 抽奖

div(:class="containerStyle")
  router-view
</template>

<script>
import {
  watch,
  ref,
  onBeforeMount,
} from 'vue';
import { useRoute } from 'vue-router';
import { Query } from 'leancloud-storage';
import { DANMU } from '@/model/danmu';

export default {
  setup() {
    const isLoading = ref(false);
    const startTime = ref('');
    const endTime = ref('');
    const winner = ref('');
    const choujiang = ref(null);
    const route = useRoute();
    const containerStyle = ref();

    const doOpenChoujiang = () => {
      if (typeof choujiang.value.showModal === 'function') {
        choujiang.value.showModal();
      } else {
        alert('当前浏览器不支持 `<dialog>`.');
      }
    };
    function doHideChoujiang() {
      choujiang.value.open = false;
    }
    async function doChoujiang() {
      const query = new Query(DANMU);
      const start = new Date(startTime.value).getTime() / 1000 >> 0;
      const end = new Date(endTime.value).getTime() / 1000 >> 0;
      query.greaterThanOrEqualTo('ts', start);
      query.lessThanOrEqualTo('ts', end);
      const result = await query.find();
      let uniqued = result.reduce((memo, item) => {
        const uid = item.get('uid');
        if (memo[uid]) {
          return memo;
        }
        memo[uid] = item.toJSON();
        return memo;
      }, {});
      uniqued = Object.values(uniqued);
      const rand = Math.random() * uniqued.length >> 0;
      winner.value = uniqued[rand].uname;
    }
    function onRouteChange(name) {
      containerStyle.value = name && name.startsWith('user.')
        ? 'w-100 flex-grow-1'
        : 'container pt-3';
    }

    watch(() => route.name, onRouteChange);
    onBeforeMount(() => {
      onRouteChange(route.name);
    });

    return {
      isLoading,

      startTime,
      endTime,
      winner,
      choujiang,
      containerStyle,

      doOpenChoujiang,
      doHideChoujiang,
      doChoujiang,
    };
  },
};
</script>
