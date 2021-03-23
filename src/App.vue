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

.container.pt-3
  .action-bar.d-flex.mb-3.align-items-center

    form.align-items-center.d-flex(
      @submit.prevent="refresh()",
    )
      label.w-25(for="search") 搜索
      input#search.form-control.flex-shrink-1(
        v-model="search",
        type="search",
      )

    button.btn.btn-outline-warning.ms-3(
      v-if="uname",
      type="button",
      @click="doClearFilter",
    ) {{uname}} &nbsp;&nbsp; &times;


    nav.ms-auto
      ul.pagination.mb-0
        li.page-item(
          :class="{disabled: page === 0 || isLoading}",
        )
          a.page-link(
            href="#",
            @click="doPrev",
          )
            span.spinner-border-sm.spinner-border(v-if="isLoading")
            template(v-else) &laquo;
        li.page-item(
          :class="{disabled: !hasNext || isLoading}",
        )
          a.page-link(
            href="#",
            @click="doNext",
          )
            span.spinner-border-sm.spinner-border(v-if="isLoading")
            template(v-else) &raquo;
  table.table.table-bordered
    thead
      tr
        th 用户名
        th 弹幕
        th 时间
    tbody(v-if="isLoading")
      tr
        td.text-center(colspan="4")
          span.spinner-border.spinner-border-sm.my-4
    tbody(
      v-if="list.length",
      @click="doFilter",
    )
      tr(v-for="item in list")
        td
          a(
            href="#",
            :data-uid="item.uid",
          ) {{item.uname}}
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
    const choujiang = ref(null);
    const search = ref('');
    const filter = {};
    const uname = ref('');
    const perPage = 20;

    async function refresh(createdAt = '', direction) {
      isLoading.value = true;
      const query = new Query(DANMU);
      if (createdAt) {
        if (direction) {
          query.lessThan('createdAt', createdAt);
        } else {
          query.greaterThan('createdAt', createdAt);
        }
      }
      if (filter.uid) {
        query.equalTo('uid', filter.uid);
      } else if (search.value) {
        query.contains('uname', search.value);
      } else {
        query.exists('uid')
      }
      query
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
      hasNext.value = result.length >= perPage;
      isLoading.value = false;
    }

    function doPrev() {
      if (page.value > 0) {
        page.value = page.value - 1;
      }
      const createdAt = list.value[0].model.get('createdAt');
      refresh(createdAt, 0);
    }
    function doNext() {
      if (hasNext.value) {
        page.value = page.value + 1;
      }
      const createdAt = list.value[list.value.length - 1].model.get('createdAt');
      refresh(createdAt, 1);
    }
    function doFilter({target}) {
      if (target.tagName !== 'A') {
        return;
      }

      const {uid} = target.dataset;
      const _uname = target.textContent;
      filter.uid = uid;
      uname.value = _uname;
      refresh();
    }
    function doClearFilter() {
      uname.value = null;
      filter.uid = null;
      refresh();
    }
    const doOpenChoujiang = () => {
      if (typeof choujiang.value.showModal === 'function') {
        choujiang.value.showModal();
      } else {
        alert('当前浏览器不支持 `<dialog>`.');
      }
    }
    function doHideChoujiang() {
      choujiang.value.open = false;
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
      choujiang,
      search,
      uname,

      refresh,
      doNext,
      doPrev,
      doOpenChoujiang,
      doHideChoujiang,
      doChoujiang,
      doFilter,
      doClearFilter,
    };
  },
};
</script>
