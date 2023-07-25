<script setup lang="ts">
const props = defineProps({
    title: String
});
</script>

<template>
    <v-card elevation="0" class="withbg mx-auto">
            <v-card-text class="text-h5 pa-2 text-center">{{ title }}</v-card-text>
            <hr style="border-top: 0.5px grey">
        <v-card-item class="px-1 py-0">
            <slot />
        </v-card-item>
        <hr style="border-top: 0.5px grey">
        <v-card-actions class="pa-2 align-items-end justify-end">
            <slot name="footer" />
        </v-card-actions>
    </v-card>
</template>
