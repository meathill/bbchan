<template lang="pug">
.change-password
  h3 修改密码
  hr

form.w-50(
  ref="form",
  @submit.prevent="doSave",
)
  fieldset(:disabled="isSubmitting")
    .mb-3
      label.form-label(
        for="old-password",
      ) 旧密码
      input#old-password.form-control(
        type="password",
        v-model="oldPassword",
        required,
        autocomplete="current-password",
      )
    .mb-3
      label.form-label(
        for="password",
      ) 新密码
      input#password.form-control(
        type="password",
        required,
        v-model="password",
        autocomplete="new-password",
      )

  alert(:message="message", :status="status")

  button.btn.btn-primary(:disabled="isSubmitting")
    span.spinner-border.spinner-border-sm.me-2(v-if="isSubmitting")
    i.bi.bi-person-plus-fill.me-2(v-else)
    | 保存
</template>

<script setup>
import {Cloud} from 'leancloud-storage';
import Alert from "@/component/alert";
import {
  ref,
} from 'vue';

const isSubmitting = ref(false);
const message = ref('');
const status = ref(null);
const form = ref(null);
const oldPassword = ref('');
const password = ref('');

async function doSave() {
  if (form.value.matches(':invalid')) {
    return;
  }

  isSubmitting.value = true;
  status.value = message.value = null;
  try {
    await Cloud.run('changePassword', {
      oldPassword: oldPassword.value,
      password: password.value,
    });
    status.value = true;
    message.value = '修改密码成功。';
  } catch (e) {
    message.value = '修改密码失败。' + e.message;
  }
  isSubmitting.value = false;
}
</script>
