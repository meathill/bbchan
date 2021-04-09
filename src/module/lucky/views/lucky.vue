<template lang="pug">
h2.lucky-editor.border-bottom.pb-3.mb-3 创建弹幕抽奖活动 🎉
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

      .mb-3.form-check
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
    .card.mb-3
      .card-header 状态
      .card-body {{formData.status}}

    .d-flex
      button.btn.btn-danger(
        type="button",
      )
        i.bi.bi-x.me-2
        | 取消抽奖

      button.btn.btn-success.ms-3(
        type="button",
      )
        i.bi.bi-check.me-2
        | 立即开奖
</template>

<script>
import assign from 'lodash/assign';
import each from 'lodash/each';
import { ACL, Object } from 'leancloud-storage';
import {
  computed,
  ref,
  reactive,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Lucky, { STATUS_NORMAL } from '@/model/lucky';

export default {
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
      auto: true,
      number: 1,
    });
    const isSubmitting = ref(false);
    const status = ref(false);
    const message = ref('');
    const form = ref(null);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const isNew = computed(() => {
      return !route.params.id;
    });
    const currentUser = computed(() => {
      return store.state.currentUser.model;
    });

    async function doSubmit() {
      if (form.value.matches(':invalid') || !isNew.value) {
        return;
      }

      isSubmitting.value = true;
      status.value = message.value = null;
      const lucky = new Lucky();
      each(formData, (value, key) => {
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

    onBeforeMount(async() => {
      let { model } = props;
      const { id } = route.params;
      if (!model) {
        try {
          model = Object.createWithoutData(Lucky, id);
          await model.fetch();
        } catch (e) {
          message.value = '获取对象失败。' + e.message;
          return;
        }
      }
      const {
        objectId,
        createdAt,
        updatedAt,
        owner,
        ...json
      } = model.toJSON();
      assign(formData, json);
    });

    return {
      isSubmitting,
      isNew,

      status,
      message,
      form,
      formData,

      doSubmit,
    };
  },
};
</script>
