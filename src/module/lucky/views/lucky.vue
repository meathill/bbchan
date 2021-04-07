<template lang="pug">
h2.lucky-editor.border-bottom.pb-3.mb-3 创建弹幕抽奖活动 🎉
form#choujiang-form.w-50(
  @submit.prevent="doSubmit",
)
  .mb-3
    label.form-label(for="lucky-name") 抽奖标题
    input#lucky-name.form-control(
      v-model="formData.name",
      required,
    )

  .d-flex.mb-3
    .col
      label.form-label(for="start-time") 弹幕开始时间
      input#start-time.form-control(
        type="datetime-local",
        v-model="startTime",
        required,
      )

    .col.ms-3
      label.form-label(for="end-time") 弹幕结束时间
      input#end-time.form-control(
        type="datetime-local",
        v-model="endTime",
        required,
      )

  .mb-3
    label.form-label(for="lucky-content") 弹幕内容
    input#lucky-content.form-control(
      v-model="formData.content",
      placeholder="即发什么弹幕才能抽奖",
      :required="formData.strict",
    )

  .d-flex.mb-3
    .col-9
      label.form-label(for="lucky-prize") 奖品名称
      input#lucky-prize.form-control(
        v-model="formData.prize",
        required,
      )

    .ms-3.col-3
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

  button.btn.btn-primary.btn-lg.w-100(
    :disabled="isSubmitting",
  )
    span.spinner-border.spinner-border-sm.me-2(v-if="isSubmitting")
    | 创建抽奖
</template>

<script>
import { Query } from 'leancloud-storage';
import { DANMU } from '@/model/danmu';
import {
  ref,
  reactive,
} from 'vue';

export default {
  setup() {
    const formData = reactive({
      onlyOnce: true,
      strict: true,
      auto: true,
      number: 1,
    });
    const isSubmitting = ref(false);

    async function doSubmit() {
      const query = new Query(DANMU);
      const start = new Date(startTime.value).getTime() / 1000 >> 0;
      const end = new Date(endTime.value).getTime() / 1000 >> 0;
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

    return {
      isSubmitting,
      formData,
    };
  },
};
</script>
