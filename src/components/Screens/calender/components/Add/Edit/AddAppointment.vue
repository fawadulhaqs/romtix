<template>
  <v-card-title class="mx-auto font-weight-bold"> {{ editable ? 'Edit' : 'Add' }} Appointment </v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-container>
      <v-row justify="center" v-if="!editable">
        <v-col cols="12" sm="8">
          <v-text-field
            hide-details
            density="compact"
            variant="outlined"
            :error="patientError"
            :placeholder="selectedPatient.name"
            v-model="filterText"
          ></v-text-field>
          <v-list-item
          v-for="(user,i) in filteredList"
          @click="selectedItem(user)"
          :key="i"
        >
         <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item>
        </v-col>
      </v-row>
      <v-row justify="center" v-else>
        <v-col cols="8">
          <v-text-field 
          v-model="dateObject.title" 
          label="name" variant="outlined" 
          dense :disabled="editable"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="shouldDisplayFields">
        <v-col cols="12" sm="6">
          <v-text-field 
          v-model="selectedPatient.dob" 
          label="Date of Birth" 
          variant="outlined" 
          dense disabled
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-radio-group 
          label="Gender"
          readonly
          v-model="selectedPatient.gender" 
          :inline="true"
          disabled
          >
            <v-radio label="Male" value="male"></v-radio>
            <v-radio label="Female" value="female"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="dateObject.startDate"
            type="date"
            :error-messages="startDateError" 
            label="Start Date"
            variant="outlined"
            dense
            :disabled="editable"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            type="date"
            v-model="dateObject.endDate"
            label="End Date"
            variant="outlined"
            :error-messages="endDateErrors"     
            dense
            :disabled="editable"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            type="time"
            v-model="dateObject.startTime"
            label="Start Time"
            variant="outlined"
            dense
            :disabled="editable"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            type="time"
            v-model="dateObject.endTime"
            label="End Time"
            variant="outlined"
            dense
            :disabled="editable"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6">
          <v-text-field
            v-model="dateObject.duration"
            label="Duration"
            variant="outlined"
            :error="error"
            :messages="error ? errorMessage : ''"
            readonly
            :disabled="editable"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            variant="outlined"
            auto-grow
            label="Description"
            rows="3"
            v-model="description"
            placeholder="description"
            row-height="20"
          ></v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div v-if="editable">
              <v-btn 
              color="error" 
              variant="flat" 
              @click="onEditAppointment"
              >Edit</v-btn>

              <v-btn 
              color="info" 
              variant="flat" 
              @click="onLoadComponent('cancel-appointment')"
              >Cancel Apt</v-btn>

              <v-btn 
              v-if="dateInfo.extendedProps.checkinDate" 
              color="#C0CA33" 
              variant="flat"
              @click="onCancelCheckIn"
                >Cancel Check In</v-btn>

              <v-btn 
              v-else color="warning" 
              variant="flat" @click="onLoadComponent('check-in')"
              >Check In</v-btn>

              <v-btn 
              v-if="!dateInfo.extendedProps.noShow" 
              color="success" variant="flat" 
              @click="onMarkNoShow"
              >Mark No show</v-btn>

              <v-btn 
              v-else color="success"
               variant="flat" 
               @click="onUndoNoShow"
               >Undo No show</v-btn>

            </div>

            <v-btn 
            v-else color="error" 
            variant="flat" 
            :disabled="error || endDateInvalid || startDateError.length > 0" 
            @click="onAddAppointment"
            >Add</v-btn>

            <v-btn 
            color="primary" 
            variant="flat" 
            @click="onCloseDialog"
            >close</v-btn>
          </v-card-actions>

          <v-dialog v-model="nestedDialog" max-width="600" persistent>
            <v-card>
              <v-card-text>
                <component :is="nestedComponent"
                 @closeDialog="onCloseDialog" 
                 :my-Object="dateObject" 
                 @customOverLays="overlays()" 
                 @fetchUpdatedData="updatedData()"
                 />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>

<script>
import CancelAppointment from '../../CancelAppointment/CancelAppointment.vue';
import CheckIn from '../../CheckIn/CheckIn.vue';
import moment from 'moment/moment';
export default {
  components: {
    CancelAppointment,
    CheckIn
  },
  props: {
    myObject: {
      type: Object,
      required: false
    }
  },
  emits: ['onCloseDialog', 'overlays','updatedData'],
  data() {
    return {
      patientList: [],
      filterText: '',
      nestedDialog: false,
      editable: null,
      loadComponent: null,
      selectedPatient: '',
      dateObject: {
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        duration: null
      },
      dateInfo: null,
      endDateErrors: [],
      startDateError: [],
      description: '',
      error: false,
      errorMessage: '',
      patientError: false,
    };
  },
  computed: {
    filteredList() {
      let filter = this.filterText;
      if (!filter.length) {
        return null;
      } else {
        return this.patientList.filter((patient) => patient.name.toLowerCase().includes(filter.toLowerCase()));
      }
    },
    nestedComponent() {
      return this.loadComponent;
    },
    endDateInvalid() {
      return this.endDateErrors.length > 0;
    },
    shouldDisplayFields(){
      return !!this.selectedPatient; 
    }
  },

  methods: {
    selectedItem(value) {
      this.selectedPatient = value;
      this.filterText = '';
      this.showList = false;
    },
    updatedData(){
      this.$emit('updatedData')
    },
    onMarkNoShow() {
      this.overlays()
      const { id } = this.dateObject;
      const { ProviderId, calendarId } = this.dateObject.selectedProvider;
      const reqBody = {
        userId: ProviderId,
        calendarId: calendarId,
        appointmentId: id
      };
      var messageObject = {
        requestType: 'post',
        messageType:`noShowAppointment`,
        credentials: reqBody
      }
      return new Promise((resolve, reject) => {
        this.$store.dispatch('callWebService',messageObject)
          .then(() => {
            resolve();
            this.overlays()
            this.updatedData()
            this.onCloseDialog();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    onUndoNoShow() {
      this.overlays()
      const { id } = this.dateObject;
      const { ProviderId, calendarId } = this.dateObject.selectedProvider;
      const reqBody = {
        userId: ProviderId,
        calendarId: calendarId,
        appointmentId: id
      };
      var messageObject = {
        requestType: 'post',
        messageType:`cancelNoShowAppointment`,
        credentials: reqBody
      }
      return new Promise((resolve, reject) => {
        this.$store.dispatch('callWebService',messageObject)
          .then(() => {
            resolve();
            this.updatedData()
            this.overlays()
            this.onCloseDialog();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    onCancelCheckIn() {
      this.overlays()
      const { id } = this.dateObject;
      const { ProviderId, calendarId } = this.dateObject.selectedProvider;
      const reqBody = {
        userId: ProviderId,
        calendarId: calendarId,
        appointmentId: id
      };   
      var messageObject = {
        requestType: 'post',
        messageType:`cancelAppointmentCheckin`,
        credentials: reqBody
      }
      return new Promise((resolve, reject) => {
        this.$store.dispatch('callWebService',messageObject)
          .then(() => {    
            resolve();
            this.overlays()
            this.updatedData()
            this.onCloseDialog();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    overlays() {
      this.$emit('overlays');
    },
    initTable() {
      this.editable = this.myObject.editable;
      if (this.editable) {
        this.dateInfo = this.myObject.event;
        this.dateObject.id = this.dateInfo.extendedProps.id;
        this.dateObject.selectedProvider = this.myObject.selectedProvider;
      } else {
        this.dateInfo = this.myObject;
      }
      this.dateObject.startDate = moment(this.dateInfo.startStr).format('YYYY-MM-DD');
      this.dateObject.endDate = moment(this.dateInfo.endStr).format('YYYY-MM-DD');
      this.dateObject.startTime = moment(this.dateInfo.startStr).format('HH:mm');
      this.dateObject.endTime = moment(this.dateInfo.endStr).format('HH:mm');
      this.dateObject.duration = moment(this.dateObject.endTime, 'HH:mm').diff(moment(this.dateObject.startTime, 'HH:mm'), 'minutes');
      this.dateObject.title = this.dateInfo.title;
    },
    onLoadComponent(val) {
      (this.nestedDialog = true), (this.loadComponent = val);
    },
    onCloseDialog() {
      this.$emit('onCloseDialog');
    },
    onEditAppointment() {
      this.overlays()
      this.show = true;
      const editApp = {
        userId: this.myObject.selectedProvider.ProviderId,
        calendarId: this.myObject.selectedProvider.calendarId,
        appointmentId: this.dateObject.id,
        description: this.description
      };
      var messageObject = {
        requestType: 'post',
        messageType:`editAppointment`,
        credentials: editApp
      }
      return new Promise((resolve, reject) => {
        this.$store.dispatch('callWebService',messageObject)
          .then(() => {
            resolve();
            this.overlays()
            this.updatedData()
            this.onCloseDialog();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    onAddAppointment() {
     if(this.shouldDisplayFields){
      this.patientError = false
      let sdt = moment(this.dateObject.startDate).format('MM/DD/YYYY');
      let edt = moment(this.dateObject.endDate).format('MM/DD/YYYY');
      let stDate = moment(sdt + ' ' + this.dateObject.startTime, ['MM/DD/YYYY HH:mm']).format();
      let stDateUtc = moment(stDate).add(7, 'hours').format('MM/DD/YYYY HH:mm');
      let edDate = moment(edt + ' ' + this.dateObject.endTime, ['MM/DD/YYYY HH:mm']).format();
      let edDateUtc = moment(edDate).add(7, 'hours').format('MM/DD/YYYY HH:mm');
      const start = stDateUtc.split(' ');
      const end = edDateUtc.split(' ');
      let addAppoint = {
        userId: this.myObject.selectedProvider.ProviderId,
        calendarId: this.myObject.selectedProvider.calendarId,
        patientId: this.selectedPatient.id,
        startDate: start[0],
        startTime: start[1],
        endDate: end[0],
        endTime: end[1],
        length: this.dateObject.duration,
        description: this.description
      };
      var messageObject = {
        requestType: 'post',
        messageType:`addAppointment`,
        credentials: addAppoint
      }
      this.overlays()
      return new Promise((resolve, reject) => {
        this.$store.dispatch('callWebService',messageObject)
          .then(() => {
            resolve();
            this.overlays()
            this.updatedData()
            this.onCloseDialog();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }else {
      this.patientError = true
    }
    },
    getPatientList() {
      this.overlays();
      var messageObject = {
        requestType: 'get',
        messageType:`getAllPatients`,
      }
        this.$store.dispatch('callWebService',messageObject)
          .then((response) => {
            this.patientList = response.patients.ITEMS;
            this.overlays();
          })
          .catch((error) => {
            console.log(error)
          });
    },
    calculateDuration() {
      const start = moment(this.dateObject.startTime, 'HH:mm');
      const end = moment(this.dateObject.endTime, 'HH:mm');
      const duration = end.diff(start, 'minutes');
      this.dateObject.duration = duration;
    }
  },
  watch: {
    'dateObject.startTime': function () {
      this.calculateDuration();
    },
    'dateObject.endTime': function () {
      this.calculateDuration();
    },
    'dateObject.duration'(newDuration) {
      if (newDuration < 0 || newDuration > 1440) {
        this.error = true;
        this.errorMessage = 'Invalid duration! Duration must be between 15 and 1440.';
      } else {
        this.error = false;
        this.errorMessage = '';
      }
    },
    'dateObject.endDate'(newVal, oldVal) {
      const currentDate = moment().format('YYYY-MM-DD');
      if (newVal < this.dateObject.startDate || newVal < currentDate) {
        this.endDateErrors = ['End date must not be less than start date'];
      } else {
        this.endDateErrors = [];
      }
    },
    'dateObject.startDate'(newVal, oldVal) {
      const currentDate = moment().format('YYYY-MM-DD');
      if (newVal < currentDate) {
        this.startDateError = ['Selected Date should be greater than or equal to Current Date'];
      } else {
        this.startDateError = [];
      }
    }
  },
  created() {
    this.initTable();
  },
  mounted() {
    this.getPatientList();
  }
};
</script>
