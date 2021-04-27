<template lang="pug">
component(
  :is="tagName",
  :type="type",
  :for="forInput",
  :class="['spin-button', {disabled: isSpinning}]",
  :disabled="isDisabled",
  @click="onClick",
)
  span.spinner-border.spinner-border-sm(v-if="isSpinning")
  i.bi(v-else, :class="icon")

  span.spin-button-label.ms-2
    slot(name="label") {{label}}
    slot
</template>

<script>
export default {
  props: {
    tagName: {
      type: String,
      default: 'button',
    },
    type: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isSpinning: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'fa-check',
    },
    forInput: {
      type: String,
      default: null,
    },
  },

  computed: {
    isDisabled() {
      return this.disabled || this.isSpinning;
    },
  },

  methods: {
    onClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="stylus">
.spin-button-label:empty
  display none
</style>
