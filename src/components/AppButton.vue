<script setup lang="ts">

defineEmits(['click'])

defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
    <button :disabled="disabled" @click="$emit('click')"><slot></slot></button>
</template>

<style scoped>

button {
  display: flex;
  gap: 0.5em;
  border: 1px solid var(--color-primary);
  border-radius: 22px;
  padding: 13px 16px;

  color: var(--color-primary);
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
}

button:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

button:focus {
  outline: none;
}


</style>

<style>

button svg {
  fill: var(--color-primary);
}

button:hover svg {
  fill: var(--color-accent);
}

</style>