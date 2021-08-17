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
      v-model="formData.email",
      autocomplete="email",
      :readonly="isEdit",
    )
  .mb-3
    label.form-label(
      for="password",
    ) {{isEdit ? '修改' : ''}}密码
    input#password.form-control(
      type="password",
      :required="!isEdit",
      v-model="formData.password",
      autocomplete="new-password",
    )
  .mb-3
    label.form-label(
      for="rooms",
    ) 房间
    input#rooms.form-control(
      :required="!isEdit",
      v-model="formData.rooms",
    )

  hr

  alert(:message="message", :status="status")

  button.btn.btn-primary
    span.spinner-border.spinner-border-sm.me-2(v-if="isSubmitting")
    i.bi.bi-person-check-fill.me-2(v-else-if="isEdit")
    i.bi.bi-person-plus-fill.me-2(v-else)
    | 保存
</template>

<script setup>
import {
  reactive,
  ref,
  onBeforeMount,
} from "vue";
import Alert from "@/component/alert";
import {
  Cloud,
  User,
  Query,
} from 'leancloud-storage';
import {useRoute} from 'vue-router';
import each from 'lodash/each';

const isSubmitting = ref(false);
const isEdit = ref(false);
const formData = reactive({
  email: '',
  password: '',
  rooms: '',
})
const message = ref('');
const status = ref(false);
const form = ref(null);
const route = useRoute();

let user;
async function doSubmit() {
  if (form.value.matches(':invalid')) {
    return;
  }
  let p;
  let action = '创建';
  if (isEdit) {
    const {password, rooms} = formData;
    p = Cloud.run('setUser', {
      rooms,
      password,
      userId: route.params.id,
    });
    action = '编辑';
  } else {
    user = new User();
    each(formData, (value, key) => {
      if (key === 'rooms') {
        value = value.split(/\s*[,，]\s*/);
      }
      user.set(key, value);
    });
    p = user.save();
  }

  try {
    await p;
    status.value = true;
    message.value = action + '成功';
  } catch (e) {
    message.value = action + '失败。' + e.message;
  }
}
onBeforeMount(async () => {
  const {id} = route.params;
  if (id) {
    isEdit.value = true;
    const query = new Query('_User');
    user = await query.get(id);
    each(formData, (value, key) => {
      value = user.get(key);
      if (key === 'rooms') {
        value = value.join(', ');
      }
      formData[key] = value;
    });
  }
});
</script>
