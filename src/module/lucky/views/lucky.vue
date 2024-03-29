<template lang="pug">
nav(aria-label="breadcrumb")
  ol.breadcrumb
    li.breadcrumb-item
      router-link(
        :to="{name: 'lucky.list'}",
      ) 全部抽奖
    li.breadcrumb-item.active 创建弹幕抽奖活动 🎉

hr

.row
  form#choujiang-form.col(
    ref="form",
    @submit.prevent="doSubmit",
  )
    fieldset(:disabled="isSubmitting || !isNew")
      .mb-3
        label.form-label(for="lucky-name") 抽奖标题
        input#lucky-name.form-control(
          v-model="formData.name",
          required,
        )

      .mb-3.w-50
        label.form-label(for="room-id") 房间号
        select#room-id.form-control(
          v-model="formData.roomId",
          required,
        )
          option(disabled, value='') == 请选择 ==
          option(v-for="room of rooms", :value="room") {{room}}

      .mb-3
        label.form-label(for="description") 活动简介
        textarea#description.form-control(
          v-model="formData.description",
          rows="2",
        )

      .d-flex.mb-3
        .col
          label.form-label(for="start-time") 弹幕开始时间
          input#start-time.form-control(
            type="datetime-local",
            v-model="formData.startTime",
            required,
          )

        .col.ms-3
          label.form-label(for="end-time") 弹幕结束时间
          input#end-time.form-control(
            type="datetime-local",
            v-model="formData.endTime",
            required,
          )

      .mb-3
        label.form-label(for="lucky-content") 弹幕内容
        input#lucky-content.form-control(
          v-model="formData.content",
          placeholder="即发什么弹幕才能抽奖",
          :required="formData.strict",
        )
        .form-text 留空则任何弹幕均有机会得奖

      .row.mb-3
        .col-9
          label.form-label(for="lucky-prize") 奖品名称
          input#lucky-prize.form-control(
            v-model="formData.prize",
            required,
          )

        .col-3
          label.form-label(for="lucky-number") 奖品数量
          input#lucky-number.form-control(
            v-model="formData.number",
            type="number",
            min="1"
          )

      .mb-3.form-check
        input#lucky-strict.form-check-input(
          type="checkbox",
          v-model="formData.strict",
        )
        label.form-check-label(for="lucky-strict") 必须与上文完全一致

      .mb-3.form-check
        input#lucky-only-once.form-check-input(
          type="checkbox",
          v-model="formData.onlyOnce",
        )
        label.form-check-label(for="lucky-only-once") 每个人只有一次机会

      .mb-3.form-check(hidden)
        input#lucky-auto.form-check-input(
          type="checkbox",
          v-model="formData.auto",
        )
        label.form-check-label(for="lucky-auto") 到时自动开奖

    .alert(
      v-if="message",
      :class="status ? 'alert-success' : 'alert-danger'",
    ) {{message}}

    button.btn.btn-primary.btn-lg.w-100(
      v-if="isNew",
      :disabled="isSubmitting",
    )
      span.spinner-border.spinner-border-sm.me-2(v-if="isSubmitting")
      | 创建抽奖

  .col(v-if="!isNew")
    .input-group.input-group-lg.mb-3
      .input-group-text 状态
      .input-group-text.bg-white.flex-grow-1(
        :class="statusClass",
      ) {{statusLabel}}

    .d-flex(v-if="formData.status === STATUS_NORMAL")
      spin-button.btn.btn-danger(
        icon="bi-x-circle",
        @click="doCancel",
        :is-spinning="isSubmitting",
      ) 取消抽奖

      spin-button.btn.btn-success.ms-3(
        icon="bi-check-circle-fill",
        @click="doDraw",
        :is-spinning="isSubmitting",
      ) 立即开奖

    table.table.table-bordered.mt-3
      caption 中奖名单
      thead
        tr
          th ID
          th 昵称
          th 内容
      tbody
        tr(v-for="winner of winners")
          td {{winner.objectId}}
          td {{winner.uname}} （{{winner.uid}}）
          td {{winner.content}}
</template>

<script>
import assign from 'lodash/assign';
import each from 'lodash/each';
import { ACL, Cloud, Object, Query } from 'leancloud-storage';
import {
  computed,
  ref,
  reactive,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Lucky, {
  STATUS_NORMAL,
  STATUS_CANCELED,
  STATUS_COMPLETED,
  formatLuck,
  STATUS_LABEL,
  STATUS_STYLE,
} from '@/model/lucky';
import SpinButton from '@/component/spin-button';

export default {
  components: { SpinButton },
  props: {
    model: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const formData = reactive({
      onlyOnce: true,
      strict: true,
      auto: false,
      number: 1,
      status: 0,
    });
    const isSubmitting = ref(false);
    const status = ref(false);
    const message = ref('');
    const form = ref(null);
    const winners = ref(null);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    let luckyModel;

    const isNew = computed(() => {
      return !route.params.id;
    });
    const currentUser = computed(() => {
      return store.state.currentUser.model;
    });
    const rooms = computed(() => {
      return store.state.currentUser.model.get('rooms');
    });
    const statusLabel = computed(() => {
      return STATUS_LABEL[formData.status];
    });
    const statusClass = computed(() => {
      return STATUS_STYLE[formData.status];
    });

    async function doDraw() {
      if (isSubmitting.value) {
        return;
      }
      isSubmitting.value = true;
      message.value = status.value = null;
      try {
        const result = await Cloud.run('drawWinner', {
          luckyId: route.params.id,
        });
        if (result.status) {
          message.value = '抽奖失败。' + result.message;
        } else {
          winners.value = result.winners;
          formData.status = STATUS_COMPLETED;
        }
      } catch (e) {
        message.value = '抽奖失败。' + e.message;
      }
      isSubmitting.value = false;
    }
    async function doSubmit() {
      if (form.value.matches(':invalid') || !isNew.value) {
        return;
      }

      isSubmitting.value = true;
      status.value = message.value = null;
      const lucky = new Lucky();
      each(formData, (value, key) => {
        if (key === 'number') {
          value = Number(value);
        }
        lucky.set(key, value);
      });
      const acl = new ACL();
      acl.setPublicReadAccess(false);
      acl.setReadAccess(currentUser.value.id, true);
      acl.setWriteAccess(currentUser.value.id, true);
      lucky.setACL(acl);
      lucky.set('owner', currentUser.value);
      lucky.set('status', STATUS_NORMAL);

      try {
        await lucky.save();
        luckyModel = lucky;
      } catch (e) {
        message.value = '保存抽奖活动失败。' + e.message;
        isSubmitting.value = false;
        return;
      }

      status.value = true;
      message.value = '保存成功。';
      if (!route.params.id) {
        router.replace({
          name: 'lucky.edit',
          params: {
            id: lucky.id,
          },
        });
      }
      isSubmitting.value = false;
    }
    async function doCancel() {
      isSubmitting.value = true;
      message.value = status.value = null;
      luckyModel.set('status', STATUS_CANCELED);
      try {
        await luckyModel.save();
        assign(formData, formatLuck(luckyModel));
      } catch (e) {
        message.value = '取消抽奖失败。' + e.message;
      }
      isSubmitting.value = false;
    }

    onBeforeMount(async() => {
      let { model } = props;
      const { id } = route.params;
      if (!model && id) {
        try {
          const query = new Query(Lucky);
          query.include('winners');
          model = await query.get(id);
          luckyModel = model;
        } catch (e) {
          console.error(e);
          message.value = '获取对象失败。' + e.message;
          return;
        }
      }
      assign(formData, formatLuck(model));
      winners.value = formData.winners;
    });

    return {
      STATUS_NORMAL,

      isSubmitting,
      isNew,

      status,
      message,
      form,
      formData,
      winners,
      rooms,
      statusLabel,
      statusClass,

      doSubmit,
      doCancel,
      doDraw,
    };
  },
};
</script>
