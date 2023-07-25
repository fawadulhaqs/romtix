<template>
  <v-card-title class="mx-auto font-weight-bold"> {{ eventObject.edit ? 'Delete ' : 'Add' }} Hours </v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field disabled v-model="startDate" label="Start Date" variant="outlined" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field disabled v-model="endDate" label="End Date" variant="outlined" dense></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field disabled v-model="startTime" label="Start Time" variant="outlined" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field disabled v-model="endTime" label="end-Time" variant="outlined" dense></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-text-field disabled v-model="numberOfSlots" label="Number Of Slots" variant="outlined"> </v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <v-textarea
            variant="outlined"
            auto-grow
            label="Description"
            v-model="description"
            rows="3"
            placeholder="description"
            row-height="20"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn v-if="!eventObject.edit" variant="flat" color="primary" @click="addActiveHours">Add</v-btn>
      <v-btn v-else="eventObject.edit" variant="flat" color="primary" @click="onDeleteActiveHours">Delete</v-btn>
      <v-btn variant="flat" color="#C0CA33" class="text-white" @click="closeDialog">Cancel</v-btn>
    </v-card-actions>
  </v-card-text>
</template>
<script>
import moment from 'moment';
export default {
  props: ['eventObject'],
  data() {
    return {
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      numberOfSlots: 0,
      description: ''
    };
  },
  emits: ['closeDialog','fetchData','isLoading'],
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    fetchData(){
      this.$emit('fetchData')
    },
    isLoading(){
      this.$emit('isLoading')
    },
    initForm() {
      const stDate = moment(this.eventObject.startStr);
      const edDate = moment(this.eventObject.endStr);
      this.startDate = stDate.format('YYYY-MM-DD');
      this.endDate = edDate.format('YYYY-MM-DD');
      this.startTime = stDate.format('HH:mm');
      this.endTime = edDate.format('HH:mm');
      this.numberOfSlots = this.getDifference(this.eventObject.end, this.eventObject.start);
    },
    getDifference(dt2, dt1) {
      const diff = moment(dt2, 'HH:mm').diff(moment(dt1, 'HH:mm'), 'minutes');
      let slotDuration = this.eventObject.timeScale || 30;
      return diff / slotDuration;
    },
    addActiveHours() {
      let sdt = moment(this.startDate).format('MM/DD/YYYY');
      let edt = moment(this.endDate).format('MM/DD/YYYY');
      let stDate = moment(sdt + ' ' + this.startTime, ['MM/DD/YYYY HH:mm']).format();
      let stDateUtc = moment(stDate).add(7, 'hours').format('MM/DD/YYYY HH:mm');
      let edDate = moment(edt + ' ' + this.endTime, ['MM/DD/YYYY HH:mm']).format();
      let edDateUtc = moment(edDate).add(7, 'hours').format('MM/DD/YYYY HH:mm');
      const start = stDateUtc.split(' ');
      const end = edDateUtc.split(' ');
      const newApp = {
        userId: this.eventObject.userId,
        calendarId: this.eventObject.calendarId,
        startDate: start[0],
        startTime: start[1],
        endDate: end[0],
        endTime: end[1],
        numberOfSlots: this.numberOfSlots,
        description: this.description || ''
      };
      this.isLoading()
      var messageObject = {
        requestType: 'post',
        messageType:`addAppointmentAvailability`,
         credentials: newApp
      }
      return new Promise((resolve, reject) => {
          this.$store.dispatch('callWebService',messageObject)
          .then(() => {   
            this.fetchData()
            this.closeDialog();
            this.isLoading()
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    onDeleteActiveHours() {
      if (this.eventObject.edit) {
       const delActiveHours = {
          userId :this.eventObject.userId,
          calendarId :this.eventObject.calendarId,
          availabilityId : this.eventObject.id,
        }
        var messageObject = {
        requestType: 'get',
        messageType:`deleteAvailability?userId=${delActiveHours.userId}&calendarId=${delActiveHours.calendarId}&availabilityId=${delActiveHours.availabilityId}`,
        //  credentials: newApp
      }
        this.isLoading()
        return new Promise((resolve, reject) => {
          this.$store.dispatch('callWebService',messageObject)
            .then(() => {   
              resolve();
              this.isLoading()
              this.fetchData()
              this.closeDialog();
              
            
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    }
  },
  created() {
    this.initForm();
  }
};
</script>
