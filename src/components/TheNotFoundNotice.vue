<script setup lang="ts">

import { ref, watch } from 'vue';
import AppButton from './AppButton.vue';
import AppArrowRight from './AppArrowRight.vue'

const requested = ref(false)
const loading = ref(false)
const error = ref<string | null>()

const props = defineProps({
    word: {
        type: String,
        required: true
    }
})

watch(() => props.word, () => {
    requested.value = false
    error.value = null
})

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function request() {
    loading.value = true
    try {
        const url = `${import.meta.env.VITE_API_BASE_URL}request?word=${props.word}`
        const response = await fetch(url, { method: 'POST' })
        if (!response.ok) {
            throw new Error(`Network response: ${response.status} ${response.statusText}`)
        }
        // wait a bit more just to make sure the user see's something happens
        await wait(500)
    } catch (err) {
        console.error(err)
        error.value = 'Something went wrong, please try again later.'
    } finally {
        requested.value = true
        loading.value = false
    }
}

</script>

<template>
    <div v-if="loading">Sending request..</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="requested" class="not-found">
        <span>Thank you. It's on our todo!</span>
    </div>
    <div v-else class="not-found">
        <span class="mb-2"><span class="word">{{ word }}</span> is not a noun we know. We can add it if you like?</span>
        <AppButton @click="request">Request to add <AppArrowRight/></AppButton>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.word {
    font-style: italic;
    color: var(--color-accent);
}

</style>