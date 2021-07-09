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

  nav.ms-auto.d-flex
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

    router-link.btn.btn-primary.ms-3(
      :to="{name: 'user.new'}",
    )
      i.bi.bi-person-plus-fill.me-2
      | 添加用户

table.table.table-bordered
  thead
    tr
      th 用户名
      th 房间
      th 创建时间
      th 最近登录时间
      th 最近登录 IP
      th 状态
      th
  tbody(v-if="isLoading")
    tr
      td.text-center(colspan="6")
        span.spinner-border.spinner-border-sm.my-4
  tbody(
    v-if="list.length",
    @click="doFilter",
  )
    tr(v-for="(item, index) in list", :key="item.id")
      td
        router-link(
          :to="{name: 'user.edit', params: {id: item.id}}",
        ) {{item.username}}
      td
        .pre-wrap {{item.rooms.join('\n')}}
      td
        time(:datetime="item.createdAt")
          small.text-muted {{item.createdAt}}
      td {{item.lastLoginTime}}
      td {{item.lastLoginIp}}
      td
        span.badge.fs-6(
          :class="item.status ? 'bg-danger' : 'bg-success'",
        ) {{item.status ? '禁用' : '正常'}}
      td
        .btn-group-sm
          button.btn.btn-danger(
            type="button",
            :disabled="item.isSaving",
            @click="removeItem(item, index)",
          )
            span.spinner-border.spinner-border-sm.me-2(v-if="item.isSaving")
            i.bi.bi-slash-circle.me-2(v-else)
            | 禁用
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
