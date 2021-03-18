<template lang="pug">
nav.navbar.navbar-expand-lg.nvabar-dark.bg-dark
  .container
    .navbar-brand.text-white BB 酱

.container.pt-3
  .action-bar.d-flex.justify-content-between.mb-3.align-items-center
    form(
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
      button.btn.btn-primary 抽奖

    .alert.alert-success.text-center(v-if="winner")
      p 🎉🎉 恭喜 🎉🎉
      h4 {{winner}}!!

    .btn-group
      button.btn.btn-outline-secondary(
        type="button",
        :disabled="page === 0",
        @click="doPrev",
      ) &lt;
      button.btn.btn-outline-secondary(
        type="button",
        :disabled="!hasNext",
        @click="doNext",
      ) &gt;
  table.table.table-bordered
    thead
      tr
        th 用户名
        th 弹幕
        th 时间
    tbody(v-if="isLoading")
      tr
        td(colspan="4")
          .spinner-border.spinner-border-sm.mx-auto.my-4
    tbody(v-if="list.length")
      tr(v-for="item in list")
        td {{item.uname}}
        td {{item.content}}
        td
          time.text-muted(:datetime="item.time") {{item.time}}


</template>

<script>
import moment from 'moment';
import {
  ref,
  onBeforeMount,
} from 'vue';
import {Query} from 'leancloud-storage';
import {DANMU} from "@/model/danmu";
export default {
  setup() {
    const list = ref([]);
    const isLoading = ref(false);
    const page = ref(0);
    const hasNext = ref(false);
    const startTime = ref('');
    const endTime = ref('');
    const winner = ref('');
    const perPage = 20;

    async function refresh(createdAt = '') {
      isLoading.value = true;
      const query = new Query(DANMU);
      if (createdAt) {
        query.greaterThan('createdAt', createdAt);
      }
      query
        .exists('uid')
        .descending('createdAt')
        .limit(perPage);
      const result = await query.find();
      list.value = result.map(item => {
        let time = moment(item.get('ts') * 1000).format('Y-M-D H:mm:ss');
        return {
          ...item.toJSON(),
          id: item.id,
          model: item,
          time,
        };
      });
      hasNext.value = list.length >= perPage;
      isLoading.value = false;
    }

    function doPrev() {
      if (page.value > 0) {
        page.value = page.value - 1;
      }
      refresh(page.value);
    }
    function doNext() {
      if (hasNext.value) {
        page.value = page.value + 1;
      }
      refresh(page.value);
    }
    async function doChoujiang() {
      const query = new Query(DANMU);
      const start = new Date(startTime.value).getTime() / 1000 >> 0;
      const end = new Date(endTime.value).getTime() / 1000 >> 0
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

    onBeforeMount(() => {
      refresh();
    });

    return {
      isLoading,

      page,
      hasNext,
      list,
      startTime,
      endTime,
      winner,

      doNext,
      doPrev,
      doChoujiang,
    };
  },
};
</script>
