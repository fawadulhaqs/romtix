<template>
  <v-table
    fixed-header
    height="350px"
    density="compact"
  >
    <thead>
        <tr>
        <th class="text-left" style="background-color:rgb(238, 238, 238)">
          Appointments 
        </th>
        <th class="text-left" style="background-color:rgb(238, 238, 238)">
          Starting Date/Time
        </th>
        <th class="text-left" style="background-color:rgb(238, 238, 238)">
         	Select
        </th>
      </tr>
    </thead>
    <tbody class="pt-3 text-body-1" v-if="appointmentList.length !== 0 ">
      <tr
        v-for="item in appointmentList"
        :key="item.name"
      >
        <td>{{ item.patientName }}</td>
        <td>{{ item.start }}</td>
        <td>
          <v-btn color="primary" size="small" rounded class="ma-0 pa-0" @click="onSelect(item)"> Select </v-btn>
        </td>
      </tr>
    </tbody>
    <v-card-text v-else class="align-center justify-center">No Appointments</v-card-text>
  </v-table>
</template>

<script>
import auth from '@/services/auth';
import store from '@/store';

  export default {
    expose: ['updateList'],
    props:['appointmentData'],
    data () {
      return {
        calendar: store.getters.getcaledars,
        date: new Date(),
        userId: store.getters.getMyInfo.id,
        appointmentList : [],
      }
    },
    methods:{
      onSelect(item){
        this.saveVisit(item,this.appointmentData)
        this.getPtientImage(item.patientId);
        this.$emit('savePatient',item.patientId,true);
      },
      updateList(days, provider) {
        const previousDate = new Date(
          this.date.getTime() - (days) * 24 * 60 * 60 * 1000
          )
          const newDate = this.getFormattedDate(previousDate);
        if(this.date>previousDate){
          const today = new Date(
            this.date.getTime() + 1 * 24 * 60 * 60 * 1000
          )
          const todayDate = this.getFormattedDate(today);
          this.getAppointmentList(newDate,todayDate,provider);
        }else{
          const today = new Date(
            this.date.getTime() - 0 * 24 * 60 * 60 * 1000
          )
          const todayDate = this.getFormattedDate(today);
          this.getAppointmentList(todayDate,newDate,provider);
        }
      },
      getAppointmentList(startingDate,endingDate,appointmentData){
        const data = JSON.parse(appointmentData);
        var messageObject = {
          requestType: "post",
          messageType: `listAppointments`,
          credentials: {
          userId : data.providerId,
          calendarId: data.calendarId,
          startDate: startingDate,
          endDate: endingDate,
        }
        };
        store.dispatch("callWebService", messageObject)
        .then((result) => {
          this.appointmentList = result.appointments;
        })
        .catch((response) => {
          console.log(response.data.error);
        })
      },
      async getPtientImage(id){
        var messageObject = {
          requestType: "get",
          messageType: `getPatientImage?patientId=${id}&imageSide=front`,
        };
        store.dispatch("callWebService", messageObject)
        .then((result) => {
          auth.savePatientImage(result.imgData);
          store.commit('patnImage',result.imgData)
        })
        .catch((response) => {
          console.log(response.data.error);
        })
      },
      saveVisit(data,appointmentData){
        const appointData = JSON.parse(appointmentData);
        const visit ={  
        appointmentDate: data.start,
        appointmentEndDate: data.end,
        clinic: {
            id: data.clinicId, 
            name: data.clinic

        },
        id: data.id,
        provider: {
            id: appointData.providerId,
            name: appointData.providerName
        }
        }
        store.commit('saveVisit',visit);
        auth.saveVisit(visit);
      },
      getFormattedDate(date){
        const month = date.getMonth() + 1
        const day = date.getDate()
        const year = date.getFullYear()

        return `${month.toString().padStart(2, '0')}/${day
          .toString()
          .padStart(2, '0')}/${year}`;
      }
    },
    mounted(){
      const startingDate= `0${new Date(this.date.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
      const endingDate= `0${new Date( this.date.getTime() + 1 * 24 * 60 * 60 * 1000 ).toLocaleDateString()}`
      this.getAppointmentList(startingDate,endingDate,this.appointmentData);
    },
  }
</script>