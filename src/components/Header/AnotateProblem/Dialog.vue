<template>
  <UiCard title="Annotate a Problem" width="550" height="auto">
    <template v-slot:default>
      <v-card>
        <v-row>
          <v-col cols="9" class="mt-5 ml-2">
            <p class="py-2">Enter a new Comment(up to 60 characters)</p>
            <v-text-field variant="outlined" :rules="commentRule" density="compact" v-model="comment.comment" />
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-slot:footer>
      <!-- <v-spacer></v-spacer> -->
      <v-btn class=" bg-primary" @click="$emit('submit');">Add</v-btn>
      <v-btn class="ml-2 bg-lighterror" @click="$emit('closeDialog');">Cancel</v-btn>
    </template>
  </UiCard>
</template>

<script>
import UiCard from '@/components/shared/CardHeaderFooter.vue';

export default ({
  components: { UiCard },
  props: {
    comment: {
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