<template lang="pug">
.lucky-list.action-bar.d-flex.mb-3.align-items-center.pt-3
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
      :to="{name: 'lucky.new'}",
    )
      i.bi.bi-plus.me-2
      | 新建 🎉抽奖

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
  onBeforeMount,
} from 'vue';
import useList from "@/use/list";
import Lucky from "@/model/lucky";
import moment from "moment";

export default {
  setup() {
    function formatter(item) {
      const time = moment(item.get('ts') * 1000).format('Y-M-D H:mm:ss');
      return {
        ...item.toJSON(),
        id: item.id,
        model: item,
        time,
      };
    }

    const listFunctions = useList({
      model: Lucky,
      rowFormatter: formatter,
      searchKey: 'name',
    });
    const {refresh} = listFunctions;

    onBeforeMount(refresh);

    return {
      ...listFunctions,
    };
  },
};
</script>
