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
      th ID
      th 活动名称
      th 活动简介
      th 持续时间
      th 弹幕内容
      th 奖品
      th 状态
      th 其它
  tbody(v-if="isLoading")
    tr
      td.text-center(colspan="8")
        span.spinner-border.spinner-border-sm.my-4
  tbody(
    v-if="list.length",
    @click="doFilter",
  )
    tr(v-for="item in list")
      td
        small {{item.id}}
      td
        router-link(
          :to="{name: 'lucky.edit', params: {id: item.id}}",
        ) {{item.name}}
      td
        small {{item.description}}
      td
        small
          time.text-muted(:datetime="item.startTime") {{item.startTime}}
        br
        small
          time.text-muted(:datetime="item.endTime") {{item.endTime}}
      td
        blockquote {{item.content}}
      td {{item.prize}} ( x
        strong.me-1 {{item.number}}
        | )
      td
        span.badge.fs-6(:class="item.statusClass") {{item.status}}
      td
</template>

<script>
import {
  onBeforeMount,
} from 'vue';
import useList from '@/use/list';
import Lucky, {
  STATUS_COMPLETED,
  STATUS_LABEL,
  STATUS_NORMAL,
} from '@/model/lucky';
import moment from 'moment';
import { TIME } from '@/data/constant';

export default {
  setup() {
    function formatter(item) {
      const json = item.toJSON();
      let {
        startTime,
        endTime,
        status,
      } = json;
      startTime = moment(startTime).format(TIME);
      endTime = moment(endTime).format(TIME);
      const statusClass = status === STATUS_NORMAL
        ? 'bg-info'
        : (status === STATUS_COMPLETED) ? 'bg-success' : 'bg-muted';
      status = STATUS_LABEL[status];
      return {
        ...json,
        id: item.id,
        startTime,
        endTime,
        status,
        statusClass,
      };
    }

    const listFunctions = useList({
      model: Lucky,
      rowFormatter: formatter,
      searchKey: 'name',
    });
    const { refresh } = listFunctions;

    onBeforeMount(refresh);

    return {
      ...listFunctions,
    };
  },
};
</script>
