<template>
  <v-row justify="center">
  <v-card-title class="mx-auto font-weight-bold"> Cancel Appointment </v-card-title> 
</v-row>
<v-divider></v-divider>
  <v-card-text>
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-text-field readonly v-model="myObject.title" variant="outlined"> </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field readonly v-model="eventInfo.startDate" label="Start Date" variant="outlined" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field readonly v-model="eventInfo.endDate" label="End Date" variant="outlined" dense></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field readonly v-model="eventInfo.startTime" label="Start Time" variant="outlined" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field readonly v-model="eventInfo.endTime" variant="outlined" dense></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6">
          <v-text-field v-model="eventInfo.duration" label="Duration" variant="outlined" readonly></v-text-field>
        </v-col>
      </v-row>
      <v-radio-group v-model="selectedType">
        <v-radio label="Patient" name="patient" id="Patient" value="P"></v-radio>
        <v-radio label="Clinic" name="clinic" id="Clinic" value="C"></v-radio>
      </v-radio-group>
      <v-row>
        <v-col cols="12">
          <v-select 
          required 
          :error="selectedItemError" 
          :error-messages="selectedItemError ?'Please select One Reason' : ''" 
          :items="filteredItems" item-title="name" 
          clearable return-object item-value="id" 
          label="Select an item" v-model="selectedItem"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Remarks" v-model="remarks" :error="remarksError" :error-messages="remarksError ?'Please Fill this field':''" variant="outlined"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="primary" :disabled="selectedItemError && remarksError" @click="onCancelAppointment">Ok</v-btn>
      <v-btn variant="flat" color="#C0CA33" class="text-white" @click="closeDialog">Cancel</v-btn>
    </v-card-actions>
  </v-card-text>
</template>
<script>
export default {
  props: {
    myObject: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      selectedType: 'P',
      eventInfo: this.myObject,
      items: [],
      selectedItem: null,
      selectedItemError: false,
      remarksError: false,
      remarks : '',
      cancelledBy: 'Patient'
    };
  },
  emits: ['closeDialog', 'fetchUpdatedData','customOverLays'],
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    customOverLays(){
      this.$emit('customOverLays')
    },
    fetchUpdatedData(){
      this.$emit('fetchUpdatedData')
    },
    getCancelAppReasons() {
      var messageObject = {
        requestType: 'get',
        messageType:`getCancelReasons`,
        // credentials: reqBody
      }
      this.$store.dispatch('callWebService',messageObject)
        .then((response) => {
          this.items = response.reasons;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onCancelAppointment() {
      if(!this.selectedItem){
        this.selectedItemError = true
      }
      else if (!this.remarks) {
        this.remarksError = true
      }
      else{
        this.customOverLays()
      this.selectedItemError = false
      this.remarksError = false
      const { id } = this.myObject;
      const { ProviderId, calendarId } = this.myObject.selectedProvider;
      let cancelApp = {
      userId: ProviderId,
      calendarId: calendarId,
      appointmentId: id,
      cancelledBy: this.cancelledBy,
      reasonId: this.selectedItem ? this.selectedItem.id : null,
      remarks: this.remarks
        }
        var messageObject = {
        requestType: 'post',
        messageType:`cancelAppointment`,
         credentials: cancelApp
      }
        return new Promise((resolve, reject) => {
          this.$store.dispatch('callWebService',messageObject)
          .then(() => {
            resolve();
            this.customOverLays()
            this.fetchUpdatedData()
            this.closeDialog();
          })
          .catch((error) => {
            reject(error);
          });
      });
      }
    }
  },
  computed: {
    filteredItems() {
  if (!this.selectedType) {
    return this.items;
  }
  return this.items.filter((item) => item.type === this.selectedType);
},
  },
  watch: {
    selectedType(newVal) {
      this.cancelledBy = newVal === 'P' ? 'Patient' : 'Clinic';
      this.selectedItem = null; 
    },
    selectedItem(newVal) {
    if (newVal) {
      this.selectedItemError = false;
    }
  },
    remarks(newVal) {
      if(this.isButtonDisabled = newVal.trim() !== ''){
        this.remarksError = false 
      }
      else {
        this.remarksError = true
      }
    },
},
  created() {
    this.getCancelAppReasons()
  },
};
</script>
