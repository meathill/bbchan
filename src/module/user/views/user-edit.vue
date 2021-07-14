<template lang="pug">
nav.user-edit(aria-label="breadcrumb")
  ol.breadcrumb
    li.breadcrumb-item
      router-link(
        :to="{name: 'user.list'}",
      ) 全部用户
    li.breadcrumb-item.active 创建用户

hr

form.w-50(
  ref="form",
  @submit.prevent="doSubmit",
)
  .mb-3
    label.form-label(
      for="email",
    ) 用户名
    input#email.form-control(
      type="email",
      required,
      v-model="email",
      autocomplete="email",
    )
  .mb-3
    label.form-label(
      for="password",
    ) 密码
    input#password.form-control(
      type="password",
      required,
      v-model="password",
      autocomplete="new-password",
    )
  .mb-3
    label.form-label(
      for="rooms",
    ) 房间
    input#rooms.form-control(
      required,
      v-model="rooms",
    )

  hr

  alert(:message="message", :status="status")

  button.btn.btn-primary
    span.spinner-border.spinner-border-sm.me-2(v-if="isSubmitting")
    i.bi.bi-person-plus-fill.me-2(v-else)
    | 保存
</template>

<script setup>
import {ref} from "vue";
import Alert from "@/component/alert";
import {User} from 'leancloud-storage';

const isSubmitting = ref(false);
const email = ref('');
const password = ref('');
const rooms = ref('');
const message = ref('');
const status = ref(false);
const form = ref(null);
async function doSubmit() {
  if (form.value.matches(':invalid')) {
    return;
  }
  const user = new User();
  user.setUsername(email.value);
  user.setPassword(password.value);
  user.setEmail(email.value);
  user.set('rooms', rooms.value.split(/\s*[,，]\s*/));
  try {
    await user.save();
    status.value = true;
    message.value = '创建成功';
  } catch (e) {
    message.value = '创建失败。' + e.message;
  }
}
</script>
