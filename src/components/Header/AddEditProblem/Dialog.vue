<template>
  <UiCard title="Add/Edit Problem" width="800" height="auto">
    <template v-slot:default>
      <v-card>
        <v-row class="w-100 mx-1">
          <v-col cols="12" md="7" class="d-flex">
            <v-row>
              <v-col cols="6">
                <p class="text-body-1 py-2">Problem</p>
                <v-text-field variant="outlined" density="compact" readonly v-model="problem.name"
                  append-icon="mdi-magnify" @click:append="$emit('search-problem')" :disabled="removeProblem" />
              </v-col>
              <v-col cols="6">
                <p class="text-body-1 py-2">Resp Provider</p>
                <v-select v-model="problem.responsibleProvider" class="text-muted mx-21" density="compact"
                  :items="respProviders" item-title="name" item-value="id" variant="outlined"
                  placeholder="Select provider" return-object :disabled="removeProblem" />
              </v-col>
              <v-col cols="6">
                <p class="text-body-1 py-2">Onset Date</p>
                <v-text-field type="date" variant="outlined" density="compact" v-model="problem.onsetDate"
                  :disabled="removeProblem" />
              </v-col>
              <v-col cols="6">
                <p class="text-body-1 py-2">Clinic</p>
                <v-select v-model="problem.clinic" class="text-muted mx-21" density="compact" :items="clinics"
                  item-title="name" item-value="id" variant="outlined" placeholder="Select provider" return-object
                  :disabled="removeProblem"></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5" class="d-flex">
            <v-col cols="6">
              <p class="text-body-1 py-2">Status</p>
              <v-radio-group v-model="problem.status" :disabled="removeProblem">
                <v-radio label="Active" color="primary" value="ACTIVE" density="compact"></v-radio>
                <v-radio label="Inactive" color="primary" value="INACTIVE" density="compact"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col v-if="problem.status === 'ACTIVE'" cols="6">
              <p class="text-body-1 py-2">immediacy</p>
              <v-radio-group v-model="problem.immediacy" :disabled="removeProblem">
                <v-radio label="Acute" color="primary" value="ACUTE" density="compact"></v-radio>
                <v-radio label="Chronic" color="primary" value="CHRONIC" density="compact"></v-radio>
                <v-radio label="<unknown>" color="primary" value="UNKNOWN" density="compact"></v-radio>
              </v-radio-group>
            </v-col>

          </v-col>
        </v-row>
        <v-row class="w-100 pa-2">
          <v-card class="mx-5 mb-10 pa-2">
            <v-card-title>
              <v-tooltip text="Add Comment">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-plus" :disabled="removeProblem" density="compact" color="primary" class="ma-1"
                    v-bind="props" @click="$emit('add-edit-comment', problem, {})" />
                </template>
              </v-tooltip>
              <span>Comments</span>
            </v-card-title>
            <v-data-table :headers="headers" :items="problem.comments" density="compact">
              <template #[`item.actions`]="{ item }">
                <div class="d-inline-flex">
                  <v-tooltip text="Edit Comment">
                    <template v-slot:activator="{ props }">
                      <v-btn size="small" icon="mdi-pencil" :disabled="removeProblem" variant="text" color="primary"
                        class="ma-1" v-bind="props" @click="$emit('add-edit-comment', problem, item.raw)" />
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Delete Comment">
                    <template v-slot:activator="{ props }">
                      <v-btn size="small" icon="mdi-delete" :disabled="removeProblem" variant="text" color="error"
                        class="ma-1" v-bind="props" @click="deleteComment(item.columns.comment)" />
                    </template>
                  </v-tooltip>
                </div>
              </template>
              <template #bottom>
              </template>
            </v-data-table>
          </v-card>
        </v-row>
        <v-row v-if="removeProblem" class="w-100 my-0 mx-1">
          <v-col>
            <p class="text-body-1 py-2">Reason</p>
            <v-text-field variant="outlined" :rules="requiredRule" density="compact" v-model="problem.reason" />
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-slot:footer>
      <!-- <v-spacer></v-spacer> -->
      <v-btn v-if="!removeProblem" class=" bg-primary" @click="$emit('submit')">Save</v-btn>
      <v-btn v-if="removeProblem" class=" bg-primary" @click="$emit('remove')">Remove</v-btn>
      <v-btn class="ml-2 bg-lighterror" @click="$emit('closeDialog');">Cancel</v-btn>
    </template>
  </UiCard>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import UiCard from '@/components/shared/CardHeaderFooter.vue';
import { boolean } from 'yup/lib/locale';

export default ({
  components: { UiCard, VDataTable },
  props: {
    problem: {
      type: Object,
      required: true,
      default: () => { }
    },
    patientInfo: {
      type: Object,
      required: true,
      default: () => { }
    },
    visitInfo: {
      type: Object,
      required: true,
      default: () => { }
    },
    removeProblem: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data() {
    return {
      patnId: '',
      selectedProvider: '',
      providers: [],
      tab: null,
      headers: [
        {
          title: 'Date',
          align: 'star',
          sortable: false,
          key: 'date'
        },
        {
          title: 'comment',
          align: 'star',
          sortable: false,
          key: 'comment'
        },
        {
          title: 'EnteredBy',
          align: 'star',
          sortable: false,
          key: 'enteredBy.name'
        },
        {
          title: 'Actions',
          align: 'star',
          sortable: false,
          key: 'actions'
        },
      ],
      respProviders: [
        {
          "id": 11,
          "name": "ONE, DOCTOR"
        },
        {
          "id": 15,
          "name": "TWO, DOCTOR"
        }
      ],
      requiredRule: [(v) => !!v || "Name is required"],
      clinics: [],
    }
  },
  mounted() {
    this.getClinics(this.visitInfo.provider.id);
    if (!this.problem.responsibleProvider) {
      this.problem.responsibleProvider = this.respProviders[0];
    }
    if (!this.problem.onsetDate) {
      this.problem.onsetDate = this.$moment().format('yyyy-MM-DD')
    }
    if (this.problem.comments) {
      this.problem.oldComments = [...this.problem.comments];
    }
  },
  methods: {
    overLay() {
      this.$store.commit('overLay');
    },
    getClinics(id) {
      this.overLay();
      var messageObject = {
        requestType: "get",
        messageType: `getClinics?userId=${id}`,
      };
      this.$store
        .dispatch("callWebService", messageObject)
        .then((result) => {
          this.clinics = result.clinics;
          this.problem.clinic = this.clinics[0];
        })
        .catch((response) => {
          console.log(response.data.error);
        })
        .finally(() => {
          this.overLay()
        });
    },
    deleteComment(comment) {
      const commInd = this.problem.comments.findIndex(com => com.comment === comment);
      if (commInd !== -1) {
        this.problem.comments.splice(commInd, 1);
      }
      if (this.problem.newComments) {
        const ncommInd = this.problem.newComments.findIndex(com => com === comment);
        if (ncommInd !== -1) {
          this.problem.newComments.splice(ncommInd, 1);
        }
      }
      if (this.problem.oldComments) {
        const ocommInd = this.problem.oldComments.findIndex(com => com.comment === comment);
        if (ocommInd !== -1) {
          this.problem.oldComments[ocommInd].comment ='';
        }
      }
    }
  },
})
</script>

<style></style>