<template lang="pug">
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

    onBeforeMount(() => {
      refresh();
    });

    return {
      isLoading,

      page,
      hasNext,
      list,
      search,
      uname,

      refresh,
      doNext,
      doPrev,
      doFilter,
      doClearFilter,
    };
  },
};
</script>
