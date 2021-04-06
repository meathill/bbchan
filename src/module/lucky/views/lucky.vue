<template lang="pug">
.lucky-editor
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
</template>

<script>
import { Query } from 'leancloud-storage';
import { DANMU } from '@/model/danmu';
import { ref } from 'vue';

export default {
  setup() {
    const startTime = ref('');
    const endTime = ref('');
    const winner = ref('');
    const choujiang = ref(null);

    const doOpenChoujiang = () => {
      if (typeof choujiang.value.showModal === 'function') {
        choujiang.value.showModal();
      } else {
        alert('当前浏览器不支持 `<dialog>`.');
      }
    };
    function doHideChoujiang() {
      choujiang.value.open = false;
    }
    async function doChoujiang() {
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
  },
};
</script>
