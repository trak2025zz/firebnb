<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { ref } from "vue";
import { IconEye, IconEyeSlash } from "../../../utils/icons";
import { ErrorMessage, Field } from "vee-validate";

const props = defineProps({
  name: String,
  error: String,
  class: String,
  disabled: Boolean,
  type: {
    type: String,
    default: "text",
  },
  value: String,
  placeholder: String,
});

const _type = ref(props.type);

const handleButtonClick = () => {
  _type.value = _type.value === "text" ? "password" : "text";
};

const inputClass = twMerge(
  "rounded-md border border-gray-200 text-gray-600 text-sm leading-md px-3 py-2 placeholder:text-gray-400",
  "focus:outline-0 focus:ring-0 focus:border-gray-400 hover:border-gray-400",
  props.error && "border-error focus:border-error hover:border-error",
  props.disabled && "bg-gray-200 placeholder:text-gray-600",
  props.class
);

</script>

<template>
  <div className="relative">
    <Field
      v-bind="props"
      :type="_type"
      :class="inputClass"
      :aria-invalid="!!props.error"
      :aria-describedby="props.error ? `${props.name}-props.error` : undefined"
      :name="props.name || 'defaultName'"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
    />
    <button
      v-if="props.type === 'password'"
      class="absolute right-4 top-4"
      type="button"
      @click="handleButtonClick"
    >
      <IconEyeSlash v-if="_type === 'password'" />
      <IconEye v-else />
    </button>
    <ErrorMessage :name="props.name || 'defaultName'" class="text-xs text-red-500" />
  </div>
</template>
