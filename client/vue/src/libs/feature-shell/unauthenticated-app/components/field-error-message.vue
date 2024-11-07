<script setup lang="ts">
const props = defineProps({
  error: String,
  fieldName: String,
});
</script>

<template>
  <div className="py-1.5">
    <p
      role="alert"
      :id="`${props.fieldName}-${props.error}`"
      className="text-error text-red-500 text-xs"
    >
      {{ props.error }}
    </p>
  </div>
</template>
