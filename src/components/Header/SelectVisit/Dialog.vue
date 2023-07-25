<template>
  <UiCard title="Select Visit" min-width="200" max-width="550" height="auto">
    <template v-slot:default>
      <v-card class="overflow-y-auto overflow-x-hidden">
        <p class="text-center pt-5">Encounter Providers</p>
        <v-card-item class="d-flex justify-center">
          <v-select v-model="selectedProvider" class="text-muted mx-21" density="compact" :items="providers"
            item-title="name" item-value="id" variant="outlined" placeholder="Select provider" return-object></v-select>
        </v-card-item>
        <v-tabs v-model="tab" bg-color="transparent">
          <v-tab value="one">Appointments</v-tab>
          <v-tab value="two">New Visit</v-tab>
        </v-tabs>
        <hr>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one">
              <v-card elevation="5">
                <AppointmentList :provider="selectedProvider" @closeDialog="closeDialog" class="px-md-15" />
              </v-card>
            </v-window-item>

            <v-window-item value="two">
              <v-card height="295" class="overflow-y-auto overflow-x-hidden">
                <NewVisit :selectedProvider="selectedProvider" @closeDialog="closeDialog" />
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </template>
    <template v-slot:footer>
      <!-- <v-spacer></v-spacer> -->
      <v-btn class="ml-2 bg-lightprimary" @click="closeDialog">Cancel</v-btn>
    </template>
  </UiCard>
</template>

<script >
import UiCard from '@/components/shared/CardHeaderFooter.vue';
import store from '@/store'
import AppointmentList from './AppointmentList.vue';
import NewVisit from './NewVisit.vue';

export default ({
  components: { UiCard, AppointmentList, NewVisit },
  mounted() {
    if (this.patientInfo.id) {
      this.getProviders(this.patientInfo.id);
    }
  },
  data() {
    return {
      selectedProvider: '',
      providers: [],
      tab: null
    }
  },
  computed: {
    patientInfo() {
      return store.getters.getPatnInfo;
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    getProviders(id) {
      var messageObject = {
        requestType: "get",
        messageType: `getProviders?patientId=${id}`,
      };
      this.$store
        .dispatch("callWebService", messageObject)
        .then((result) => {
          if (result.ok) {
            this.selectedProvider = result.providers[0];
            this.providers = result.providers
          }
        })
        .catch((response) => {
          console.log(response.data.error);
        })
    },
  },
})
</script>