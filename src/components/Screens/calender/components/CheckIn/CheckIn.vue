<template>
  <v-card-title class="mx-auto font-weight-bold"> Check In </v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-text-field readonly v-model="eventInfo.title" variant="outlined"> </v-text-field>
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
          <v-text-field readonly label="end-Time" v-model="eventInfo.endDate" variant="outlined" dense></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-text-field readonly v-model="eventInfo.duration" variant="outlined"> </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field type="date" label="Check In Date" :error-messages="error ?'time and date should be greater then current date': ''" variant="outlined" v-model="checkinDate"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field type="time" :error-messages="error ?'time and date should be greater then current date': ''" v-model="checkinTime" variant="outlined" label="check in time" dense></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn variant="flat" color="primary" @click="onCheckIn" :disabled="error">Confirm</v-btn>
      <v-btn variant="flat" color="#C0CA33" class="text-white" @click="closeDialog">Cancel</v-btn>
    </v-card-actions>
  </v-card-text>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    myObject: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      eventInfo: this.myObject,
      error: false,
      checkinDate: moment().format('YYYY-MM-DD'),
      checkinTime: moment().format('HH:mm')
    };
  },
  watch : {
    checkinTime(newVal){
      const currentTime = moment().format('HH:mm')
      if(newVal < currentTime) {
        this.error = true
      }
      else {
        this.error = false
      }
    },
    checkinDate(newVal){
      const currentDate = moment().format('YYYY-MM-DD')
      if(newVal < currentDate){
        this.error = true
      }else{
        this.error = false
      }
    }
  },
  emits: ['closeDialog','customOverLays','fetchUpdatedData'],
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
    onCheckIn() {
      this.customOverLays()
      const { id } = this.myObject;
      const { ProviderId, calendarId } = this.myObject.selectedProvider;
      const time = this.checkinTime;
      const date = this.checkinDate;
      const fDatte = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm');
      const fullDate = fDatte.format();
      const utcDate = moment(fullDate).add(7, 'hours').format('MM/DD/YYYY HH:mm');
      const dt = utcDate.split(' ');
      const checkInReqBody = {
        checkinDate: dt[0],
        checkinTime: dt[1],
        userId: ProviderId,
        calendarId,
        appointmentId: id
      };
      var messageObject = {
        requestType: 'post',
        messageType:`checkinAppointment`,
         credentials: checkInReqBody
      }
      return new Promise((resolve, reject) => {
        this.$store.dispatch('callWebService', messageObject)
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
};
</script>
