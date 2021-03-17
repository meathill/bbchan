<template lang="pug">
router-view.relative.z-10
</template>

<script>
import {danmuDb} from '@/db';
export default {
  setup() {
    danmuDb.put({
      _id: 'hello-world',
      message: 'meathill',
    });
  },
};
</script>
