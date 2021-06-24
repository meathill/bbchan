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

<script setup>
import {
  ref,
  onBeforeMount,
} from 'vue';
import useList from '@/use/list';
import { rowItemFormatter } from '@/utils/format';

const username = ref('');

const listFunctions = useList({
  rowFormatter: rowItemFormatter,
  model: '_User',
  searchKey: 'username',
});
const {
  list,
  isLoading,
  hasNext,
  filter,
  page,

  refresh,
  doPrev,
  doNext,
} = listFunctions;

onBeforeMount(() => {
  refresh();
});
</script>
