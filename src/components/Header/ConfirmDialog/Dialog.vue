<template>
  <UiCard :title="message.title" width="550" height="auto">
    <template v-slot:default>
      <v-card>
        <v-row class="w-100 mx-1 py-5" no-gutters>
          <p>{{ message.text }}</p>
        </v-row>
      </v-card>
    </template>
    <template v-slot:footer>
      <!-- <v-spacer></v-spacer> -->
      <v-btn class=" bg-primary" @click="$emit('submit');">Yes</v-btn>
      <v-btn class="ml-2 bg-lighterror" @click="$emit('closeDialog');">Cancel</v-btn>
    </template>
  </UiCard>
</template>

<script>
import UiCard from '@/components/shared/CardHeaderFooter.vue';

export default ({
  components: { UiCard },
  props: {
    message: {
      type: Object,
      required: true,
      default: () => { }
    },
  },
  data() {
    return {
      commentRule: [v => (v && v.length <= 60) || 'Description must be 60 characters or less'],
    }
  },
})
</script>

<style></style>