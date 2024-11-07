<script setup>
import { ErrorMessage, useField } from "vee-validate";
import Input from "./input.vue";
import { styles } from "@firebnb/public";
import { twMerge } from "tailwind-merge";
import { watch } from "vue";

const props = defineProps({
  name: String,
  placeholder: String,
  label: String,
  class: String,
  type: {
    type: String,
    default: "text",
  },
});
</script>

<template>
  <div :class="twMerge('grid gap-1', props.class)">
    <label :htmlFor="props.name" :class="styles.paragraph2">
      {{ props.label }}
    </label>
    <Input
      v-bind="props"
      :placeholder="props.placeholder"
      :error="props.error"
      :type="props.type"
      :name="props.name"
      class="w-full"
    />
  </div>
</template>
