<template>
  <UiCard title="Search Problem" width="550" height="auto">
    <template v-slot:default>
      <v-card>
        <v-row>
          <v-col class="mt-5 mx-5">
            <p class="py-2">Search for</p>
            <div class="d-flex">
              <v-text-field variant="outlined" :rules="commentRule" density="compact" v-model="searchText" class="mr-1" />
              <v-btn @click="searchProblems" color="primary">Search</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-list v-if="problems.length > 0" density="compact" max-height="66vh" :selected="[]">
          <template v-for="(problem, index) in problems" :key="index">
            <v-list-item v-if="!problem.problems" :title="problem.name" :value="problem.name" active-class="bg-primary" @click="selectedProblem=problem"></v-list-item>

            <v-list-group v-else :value="problem.name">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :title="problem.name" :value="problem.name" active-class="bg-primary" @click="selectedProblem=problem"></v-list-item>
              </template>

              <template v-for="(sProblem, ind) in problem.problems" :key="ind">
                <v-list-item v-if="!sProblem.problems" :title="sProblem.name" :value="sProblem.name" active-class="bg-primary" @click="selectedProblem=sProblem"></v-list-item>

                <v-list-group v-else :value="sProblem.name">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" :title="sProblem.name" :value="sProblem.name" active-class="bg-primary" @click="selectedProblem=sProblem"></v-list-item>
                  </template>

                  <template v-for="(gProblem, i) in sProblem.problems" :key="i">
                    <v-list-item v-if="!gProblem.problems" :title="gProblem.name" :value="gProblem.name" active-class="bg-primary" @click="selectedProblem = gProblem"></v-list-item>

                    <v-list-group v-else :value="gProblem.name">
                      <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" :title="gProblem.name" :value="gProblem.name" active-class="bg-primary" @click="selectedProblem = gProblem"></v-list-item>
                      </template>

                      <v-list-item v-for="(ggProblem,inde) in gProblem.problems" :key="inde" :title="ggProblem.name" :value="ggProblem.name" active-class="bg-primary" @click="selectedProblem=ggProblemproblem"></v-list-item>
                    </v-list-group>
                  </template>
                </v-list-group>
              </template>
            </v-list-group>
          </template>
        </v-list>
      </v-card>
    </template>
    <template v-slot:footer>
      <!-- <v-spacer></v-spacer> -->
      <v-btn class=" bg-primary" @click="$emit('submit', selectedProblem)">Add</v-btn>
      <v-btn class="ml-2 bg-lighterror" @click="$emit('closeDialog');">Cancel</v-btn>
    </template>
  </UiCard>
</template>

<script>
import UiCard from '@/components/shared/CardHeaderFooter.vue';

export default ({
  components: { UiCard },
  data() {
    return {
      commentRule: [v => (v && v.length <= 60) || 'Description must be 60 characters or less'],
      searchText: '',
      selectedProblem: {},
      problems: [],
    }
  },
  methods: {
    overLay() {
      this.$store.commit('overLay');
    },
    searchProblems() {
      this.overLay();
      var messageObject = {
        requestType: "get",
        messageType: `searchProblems?searchText==${this.searchText}`,
      };
      this.$store
        .dispatch("callWebService", messageObject)
        .then((result) => {
          this.problems = result.problems;
        })
        .catch((response) => {
          console.log(response.data.error);
        })
        .finally(() => {
          this.overLay()
        });
    },
  }
})
</script>

<style></style>