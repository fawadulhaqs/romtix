<template>
  <div v-if="!showActiveHours">
    <select class="custom-select" v-model="selectedProvider" @change="handleSelectChange">
      <optgroup v-for="provider in userCalendars" :label="provider.name" :key="provider.id">
        <option
          v-for="calendar in provider.calendars"
          :value="{ ProviderId: provider.id, calendarId: calendar.id }"
          :selected="isSelectedProvider(provider.id, calendar.id)"
        >
          {{ calendar.name }} ({{ provider.name }})
        </option>
      </optgroup>
    </select>
    <v-btn @click="activeHourCalendar" variant="flat" color="primary">Edit Active Hours</v-btn>
    <v-row>
      <v-col cols="12">
        <v-card>
          <full-calendar :options="calendarOptions"></full-calendar>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-if="showActiveHours">
    <v-row>
      <v-col>
        <v-btn @click="activeHourCalendar" variant="flat" color="success">Back to Clinic Calendar</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <active-hours :provider-data="activeHoursObject" @overlays="handleOverLay" @onUpdateData="getUpdatedData()"></active-hours>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-overlay v-model="isLoading" class="align-center justify-center">
    <v-progress-circular color="primary" class="mb-0" indeterminate size="80"></v-progress-circular>
  </v-overlay>
  <v-row justify="center">
    <v-dialog v-model="showdialog" max-width="650" persistent>
      <v-card>
        <add-appointment
          :my-object="dateEvent"
          @onCloseDialog="handleClose"
          @overlays="handleOverLay"
          @updatedData="getUpdatedData()"
        ></add-appointment>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddAppointment from './components/Add/Edit/AddAppointment.vue';
import ActiveHours from './components/ActiveHours/ActiveHours.vue';
import moment from 'moment';
export default {
  components: {
    FullCalendar,
    AddAppointment,
    ActiveHours
  },

  data() {
    return {
      activeHoursObject: {},
      info: null,
      timeScale: null,
      selectedProvider: {},
      eventObject: {},
      showdialog: false,
      dateEvent: {},
      calendarOptions: null,
      editable: false,
      userCalendars: [],
      eventsArray: [],
      showActiveHours: false,
      isLoading: false
    };
  },
  computed: {},
  watch: {
    selectedProvider: {
      deep: true,
      handler() {
        this.getListAppointmentsInfo();
      }
    }
  },

  methods: {
    activeHourCalendar() {
      this.showActiveHours = !this.showActiveHours;
    },
    initTable() {
      this.calendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'today prev,next',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth'
        },
        initialView: 'timeGridWeek',
        editable: true,
        selectable: true,
        selectMirror: true,
        events: [],
        businessHours: [],
        dayMaxEvents: true,
        weekends: true,
        eventClick: this.handleEventClick,
        select: this.handleDateClick,
        slotLabelInterval: '01:00',
        unselectAuto: true,
        droppable: true,
        nowIndicator: true,
        expandRows: true,
        selectAllow: function (e) {
          if (e.end.getTime() / 1000 - e.start.getTime() / 1000 <= 86400) {
            return true;
          }
        },
        selectOverlap: (event) => {
          return event.rendering === 'background';
        },
        height: screen.height * 3,
        windowResize: () => {
          if (screen.width < 577) {
            this.calendarOptions.contentHeight = 1500;
          } else {
            this.calendarOptions.contentHeight = 2000;
          }
        },
        datesSet: (info) => {
          this.info = info;
          this.getListAppointmentsInfo();
        }
      };
    },
    getListAppointmentsInfo() {
      const startDate = moment(this.info.startStr).format('MM/DD/YYYY');
      const endDate = moment(this.info.endStr).format('MM/DD/YYYY');
      if (!this.selectedProvider.ProviderId || !this.selectedProvider.calendarId) {
        return;
      }
      const fetchAppointments = () => {
        if (this.selectedProvider && this.selectedProvider.ProviderId && this.selectedProvider.calendarId) {
          const selectedProvider = this.userCalendars.find((provider) => provider.id === this.selectedProvider.ProviderId);
          const selectedCalendar = selectedProvider.calendars.find((calendar) => calendar.id === this.selectedProvider.calendarId);
          const data = {
            userId: selectedProvider.id,
            calendarId: selectedCalendar.id,
            startDate,
            endDate
          };
          var messageObject = {
            requestType : 'post',
            messageType: 'listAppointments',
            credentials: data
          }
          this.$store.dispatch('callWebService',messageObject)
          .then((response) =>{
            if(response.ok){
              this.eventsArray= this.getAppointmentEvents(response.appointments)
              this.calendarOptions.events = this.eventsArray
            }
          })
          .catch((response) => {
          console.log(response.data.error);
        })
          var messageObject2 = {
            requestType : 'post',
            messageType: 'listAvailability',
            credentials: data
          }
          this.$store
            .dispatch('callWebService', messageObject2)
            .then((response) => {
              let activeHours = this.getBusinessHours(response.availSlots);
              this.calendarOptions.businessHours = activeHours;
            })
            .catch((error) => {});
        } else {
          setTimeout(fetchAppointments, 100);
        }
      };
      fetchAppointments();
    },
    getAppointmentEvents(appointments) {
      let events = [];
      if (appointments.length) {
        appointments.forEach((e) => {
          const startStr = moment(e.start, 'MM/DD/YYYY HH:mm').format();
          const endStr = moment(e.end, 'MM/DD/YYYY HH:mm').format();
          let calendarevent = {
            extendedProps: { ...e },
            id: e.id,
            title: e.patientName,
            start: startStr,
            end: endStr,
            allDay: e.allDay ? e.allDay : false,
            editable: false,
            url: e.url ? e.url : window.location.hash,
            backgroundColor: e.noShow ? 'red' : e.checkinDate ? 'yellow' : '',
            textColor: 'black'
          };
          events.push(calendarevent);
        });
      }
      return events;
    },
    getBusinessHours(availSlots) {
      let activeHours = [];
      if (availSlots.length) {
        availSlots.forEach((e) => {
          const startStr = moment(e.start, 'MM/DD/YYYY HH:mm').format();
          const endStr = moment(e.end, 'MM/DD/YYYY HH:mm').format();
          let dayOfWeek = moment(startStr).weekday();
          activeHours.push({
            daysOfWeek: [dayOfWeek],
            startTime: moment(startStr).format('HH:mm'),
            endTime: moment(endStr).format('HH:mm'),
            display: 'background'
          });
        });
      }
      return activeHours;
    },
    getUpdatedData() {
      this.getListAppointmentsInfo();
    },
    handleOverLay() {
      this.isLoading = !this.isLoading;
    },
    isSelectedProvider(providerId, calendarId) {
      return this.selectedProvider.ProviderId === providerId && this.selectedProvider.calendarId === calendarId;
    },
    handleSelectChange() {
      const selectedPr = this.userCalendars.find((provider) => provider.id === this.selectedProvider.ProviderId);
      const selectedCalendar = selectedPr.calendars.find((calendar) => calendar.id === this.selectedProvider.calendarId);
      this.timeScale = selectedCalendar.timeScale;
      (this.calendarOptions.slotDuration = `00:${this.timeScale}:00`),
        (this.selectedProvider = {
          ProviderId: selectedPr.id,
          calendarId: selectedCalendar.id
        });
      this.activeHoursObject.user = this.selectedProvider.ProviderId;
      this.activeHoursObject.calendarid = this.selectedProvider.calendarId;
      this.activeHoursObject.timeScale = this.timeScale;
    },

    handleDateClick(arg) {
      this.dateEvent = arg;
      this.dateEvent.editable = false;
      this.dateEvent.selectedProvider = this.selectedProvider;
      this.showdialog = true;
    },
    handleClose() {
      this.showdialog = false;
      this.editable = false;
    },

    handleEventClick(info) {
      this.editable = true;
      this.dateEvent = info;
      this.dateEvent.editable = true;
      this.dateEvent.selectedProvider = this.selectedProvider;
      this.showdialog = true;
    },
    loadCalendars() {
      this.isLoading = true;

      var messageObject = {
        requestType: 'get',
        messageType: `getCalendars`
      };
      this.$store
        .dispatch('callWebService', messageObject)
        .then((result) => {
          if (result.ok) {
            this.userCalendars = result.calendars;
            if (this.userCalendars.length > 0 && this.userCalendars[0].calendars.length > 0) {
              const firstCalendar = this.userCalendars[0].calendars[0];
              this.timeScale = firstCalendar.timeScale;
              (this.calendarOptions.slotDuration = `00:${this.timeScale}:00`),
                (this.selectedProvider = {
                  ProviderId: this.userCalendars[0].id,
                  calendarId: firstCalendar.id
                });
              this.activeHoursObject.user = this.selectedProvider.ProviderId;
              this.activeHoursObject.calendarid = this.selectedProvider.calendarId;
              this.activeHoursObject.timeScale = this.timeScale;
              this.isLoading = false;
            }
          }
        })
        .catch((response) => {
          console.log(response.error);
        })
    }
  },
  created() {
    this.initTable();
    this.loadCalendars();
  }
};
</script>
<style>
.custom-select {
  height: 80%;
  margin: 0 4px 5px 3px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  user-select: none;
  padding: 7px 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
  width: 200px;
}
.custom-select:hover {
  background-color: lightgrey;
  color: black;
}
.custom-select::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #555;
}
.custom-select select {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.fc-scroller {
  overflow-y: hidden !important;
}
.fc-body {
  background-color: #c2b78e;
}

.fc-nonbusiness {
  opacity: 1;
}
@media screen and (max-width: 767px) {
  .fc-toolbar.fc-header-toolbar {
    font-size: 50%;
  }
  .custom-select {
    width: 50%;
  }
}
</style>
