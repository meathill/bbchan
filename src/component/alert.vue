<template lang="pug">
transition(
  name="custom-class-transition",
  enter-active-class="animated slideInDown",
  leave-active-class="animated slideOutUp",
)
  .alert(
    role="alert",
    v-if="message",
    :class="alertClass ? alertClass : (status ? 'alert-success' : 'alert-danger')",
  )
    slot {{message}}
</template>

<script setup>
import {
  defineProps,
  toRefs,
} from 'vue';
const props = defineProps({
  message: String,
  status: Boolean,
  alertClass: String,
});

const {
  message,
  status,
  alertClass,
} = toRefs(props);
</script>
