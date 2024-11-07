<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps({
  disabled: Boolean,
  isLoading: Boolean,
  class: String,
  size: {
    type: String,
    default: "medium",
  },
  variant: String,
});

function getButtonClassName() {
  const baseClass = twMerge(
    "flex gap-2 rounded-md items-center justify-center text-white",
    props.size === "small" && "px-3 md:h-6 h-8 text-sm",
    props.size === "medium" && "px-4 md:h-9 h-12 text-md",
    props.size === "large" && "px-5 md:h-12 h-14 text-lg",
    props.disabled ? "bg-gray-400" : "bg-primary hover:opacity-80",
    props.variant === "primary-inverted" &&
      "bg-white text-primary border border-primary hover:bg-primary hover:text-white"
  );

  const disabledClass = props.disabled
    ? "cursor-not-allowed"
    : "transition-colors duration-200";

  const loadingClass = props.isLoading
    ? "animate-pulse pointer-events-none touch-none"
    : "";

  return twMerge(baseClass, disabledClass, loadingClass, props.class);
}
</script>

<template>
  <button
    v-bind="props"
    :class="getButtonClassName()"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>
