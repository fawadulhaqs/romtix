<template>
  <v-row>
    <v-col cols="12">
      <FullCalendar :options="calendarOptions"></FullCalendar>
      <v-dialog v-model="activeHoursDialog" max-width="650" persistent>
        <v-card>
          <v-divider></v-divider>
          <v-card-text>
            <EditActiveHours
              @closeDialog="activeHoursDialog = !activeHoursDialog"
              :event-object="dateObject"
              @fetchData="onFetchData"
              @isLoading="overlays"
            ></EditActiveHours>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EditActiveHours from './Edit-Active-Hours/EditActiveHours.vue';
import moment from 'moment';
export default {
  props: ['providerData'],
  components: {
    FullCalendar,
    EditActiveHours
  },
  emits: ['overlays', 'onUpdateData'],
  data() {
    return {
      calendarOptions: null,
      activeHoursDialog: false,
      dateObject: null,
      availSlots: [],
      info: null
    };
  },
  methods: {
    onFetchData() {
      this.onUpdateData();
      this.getListAppointments();
    },
    onUpdateData() {
      this.$emit('onUpdateData');
    },
    initCalendar() {
      this.calendarOptions = {
        initialView: 'timeGridWeek',
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectAllow: function (e) {
          if (e.end.getTime() / 1000 - e.start.getTime() / 1000 <= 86400) {
            return true;
          }
        },
        select: this.handleSelectClick,
        selectOverlap: false,
        events: [],
        eventClick: this.eventClicked,
        slotDuration: `00:15:00`,
        slotLabelInterval: '01:00',
        selectable: true,
        selectMirror: true,
        unselectAuto: true,
        droppable: true,
        editable: true,
        nowIndicator: false,
        expandRows: true,
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
          this.getListAppointments();
        }
      };
    },
    overlays() {
      this.$emit('overlays');
    },
    handleSelectClick(info) {
      this.activeHoursDialog = true;
      this.dateObject = info;
      this.dateObject.edit = false;
      this.dateObject.userId = this.providerData.user;
      this.dateObject.calendarId = this.providerData.calendarid;
      this.dateObject.timeScale = this.providerData.timeScale;
    },
    eventClicked(info) {
      this.activeHoursDialog = true;
      this.dateObject = info.event;
      this.dateObject.edit = true;
      this.dateObject.userId = this.providerData.user;
      this.dateObject.calendarId = this.providerData.calendarid;
      this.dateObject.timeScale = this.providerData.timeScale;
    },
    getListAppointments() {
      const startDate = moment(this.info.startStr).format('MM/DD/YYYY');
      const endDate = moment(this.info.endStr).format('MM/DD/YYYY');
      const data = {
        userId: this.providerData.user,
        calendarId: this.providerData.calendarid,
        startDate,
        endDate
      };
      this.overlays();
      var messageObject = {
        requestType: 'post',
        messageType:`listAvailability`,
         credentials: data
      }
      this.$store
        .dispatch('callWebService', messageObject)
        .then((response) => {
          this.availSlots = this.setBusinessHour(response.availSlots);
          this.calendarOptions.events = this.availSlots;
          this.overlays();
        })
        .catch((error) => {});
    },
    setBusinessHour(availSlots) {
      let events = [];
      if (availSlots.length) {
        availSlots.forEach((e) => {
          const startStr = moment(e.start, 'MM/DD/YYYY HH:mm').format();
          const endStr = moment(e.end, 'MM/DD/YYYY HH:mm').format();
          let calendarevent = {
            extendedProps: { ...e },
            id: e.id,
            start: startStr,
            end: endStr,
            editable: false,
            backgroundColor: 'lightGreen',
            textColor: 'black'
          };
          events.push(calendarevent);
        });
        return events;
      }
    }
  },
  created() {
    this.initCalendar();
  }
};
</script>
