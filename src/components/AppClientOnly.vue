<!-- Helper component to avoid pre-rendering certain parts that cause hydration issues -->
<script setup lang="ts">

import { ref, onMounted } from 'vue';

const show = ref(false);

onMounted(() => {
  show.value = true;
});

</script>


<template>
    <slot v-if="show"></slot>
</template>