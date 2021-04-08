<template lang="pug">
.action-bar.d-flex.mb-3.align-items-center.pt-3
  form.align-items-center.d-flex(
    @submit.prevent="refresh()",
  )
    label.w-25(for="search") 搜索
    input#search.form-control.flex-shrink-1(
      v-model="filter.search",
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
import {
  ref,
  onBeforeMount,
} from 'vue';
import useList from '@/use/list';
import moment from 'moment';
import { DANMU } from '@/model/danmu';

export default {
  setup() {
    const uname = ref('');
    function rowFormatter(item) {
      const time = moment(item.get('ts') * 1000).format('Y-M-D H:mm:ss');
      return {
        ...item.toJSON(),
        id: item.id,
        model: item,
        time,
      };
    }

    const listFunctions = useList({
      rowFormatter,
      model: DANMU,
      searchKey: 'uname',
    });
    const { refresh, filter } = listFunctions;
    function doFilter(event) {
      const { target } = event;
      event.preventDefault();
      if (target.tagName !== 'A') {
        return;
      }

      const { uid } = target.dataset;
      const _uname = target.textContent;
      filter.column.uid = uid;
      uname.value = _uname;
      refresh();
    }
    function doClearFilter() {
      filter.column = null;
      uname.value = '';
      refresh();
    }

    onBeforeMount(() => {
      refresh();
    });

    return {
      ...listFunctions,
      uname,
      doFilter,
      doClearFilter,
    };
  },
};
</script>
