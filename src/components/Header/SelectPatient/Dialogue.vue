<template>
    <UiCard title="Select Patient" min-width="200" max-width="800" height="auto">
    <template v-slot:default>
      <v-card height="500" class="overflow-y-auto overflow-x-hidden">
        <v-row>
            <v-col cols="12" sm="4" class="py-0">
                <p class="pt-10 pl-5" >Filter</p>
                <v-radio-group color="primary" v-model="toggle">
                <v-radio class="pa-0" label="Patients" value="patient"></v-radio>
                <v-radio class="pa-0" label="Appointments" value="appointment"></v-radio>
                </v-radio-group>
                <div  v-if="toggle === 'appointment' ">
                <select
                  class="d-flex text-muted select-text"
                  v-model="selectedProvider"
                  @change="appointmentList(selectedDate.days, $event.target.value)"
                >
                  <optgroup v-for="items in calendar" :label="items.name">
                    <option v-for="item in items.calendars" class="option-item" :value="JSON.stringify({providerName:items.name ,providerId:items.id, calendarName:item.name, calendarId:item.id})">
                      {{item.name}}
                    </option>
                  </optgroup>
                </select>
                <v-select
                  v-model="selectedDate"
                  class="d-flex text-6 mx-21 pt-5"
                  density="compact"
                  :items="selectDuration"
                  item-title="name"
                  item-value="days"
                  variant="outlined"
                  return-object
                  @update:modelValue="appointmentList(selectedDate.days, selectedProvider)"
                ></v-select>

                </div>
            </v-col>
            <v-col v-if="toggle === 'appointment'" cols="12" sm="8" class="pa-10">
              <v-card >
                <SelectAppointment
                :appointmentData="selectedProvider"
                ref="appointments"
                @savePatient="saveInfo"
                />
              </v-card>
            </v-col>
            <v-col v-else cols="12" sm="8" class="py-0 w-100 mt-sm-10">
                <SelectPatient
                @savePatient="savePatientInfo"
                />
            </v-col>
        </v-row>
      </v-card>
      </template>
        <template v-slot:footer>
          <!-- <v-spacer></v-spacer> -->
          <v-btn v-if="toggle === 'patient'" :disabled="!selectedPatient" class="ml-2 bg-primary" @click="saveInfo(selectedPatient.id,false)">Confirm</v-btn>
          <v-btn class="ml-2 bg-lightprimary" @click="closeDialog">Cancel</v-btn>
        </template>
    </UiCard>
</template>

<style>
.select {
position: relative;
width: 100px
}
.select-text {
position: relative;
font-family: inherit;
background-color: transparent;
padding: 10px 10px 10px 10px;
width: 100px;
font-size: 13px;
border-radius: 4px;
border: 1px solid rgb(139, 143, 150);
}
.select-text:focus {
outline: none;
border: 2px solid rgb(90, 106, 133);
}
.select .select-text {
appearance: none;
-webkit-appearance:none;
color: gray;
}

.option-item {
  height: 90px;
  padding: 10px; /* Adjust the padding value as needed */
  font-size: 13px; /* Adjust the font size value as needed */
}
</style>

<script >
import UiCard from '@/components/shared/CardHeaderFooter.vue';
import SelectPatient from './SelectPatient.vue'
import SelectAppointment from './SelectAppointment.vue';
import store from '@/store';
import Cookies from 'js-cookie';
import auth from '@/services/auth';
export default ({
components: {UiCard,SelectAppointment,SelectPatient},
mounted() {
  this.config = {
          headers: {
            Authorization: Cookies.get('token'),
          }
        };
  this.calendar = store.getters.getCalendar
  this.selectedProvider = JSON.stringify({providerName:this.calendar[0].name, providerId:this.calendar[0].id, calendarName:this.calendar[0].calendars[0].name ,calendarId:this.calendar[0].calendars[0].id})
},
data() {
  return {
    calendar: null,
    imgSrc: null,
    toggle:'patient',
    config: '',
    selectedProvider: null,
    selectedPatient: '',
    filterText: '',
    selectedDate: {
        name: 'today',
        days: 1,
      },
    selectDuration: [
      {
        name: 'tomorrow',
        days: -2,
      },
      {
        name: 'today',
        days: 1,
      },
      {
        name: 'yesterday',
        days: 2,
      },
      {
        name: 'past week',
        days: 8,
      },
      {
        name: 'past month',
        days: 40,
      },
    ],
  }
},
methods: {
  appointmentList(days, provider){
    this.$refs.appointments.updateList(days, provider);
  },
  savePatientInfo(info,imgSrc){
    this.selectedPatient = info
    this.imgSrc = imgSrc;
  },
  saveInfo(value,isVisitSelected){
    if(!isVisitSelected){
      store.commit('saveVisit',null);
      auth.deleteVisit();
      auth.savePatientImage(this.imgSrc);
      store.commit('patnImage',this.imgSrc);
    }
    store.dispatch('getPatientInfo',value)
    .finally(()=>{
      this.closeDialog()
    });
  },
  closeDialog(){
    this.$emit('closeDialog');
  },
},
})
</script>