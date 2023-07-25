<template>
    <v-table
      v-model="table"
      fixed-header
      height="280px"
      density="compact"
    >
      <thead>
          <tr>
          <th class="text-left font-weight-bold" style="background-color:rgb(238, 238, 238)">
            Clinic
          </th>
          <th class="text-left" style="background-color:rgb(238, 238, 238)">
            Date/Time
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
          <td>{{ item.clinic }}</td>
          <td>{{ item.appointmentDate }}</td>
          <td>
          <v-btn color="primary" size="small" rounded class="ma-0 pa-0" @click="onSelect(item)"> Select </v-btn>
        </td>
        </tr>
      </tbody>
      <v-card-text v-else class="align-center justify-center">No Appointments</v-card-text>
    </v-table>
  </template>
  
  <script>
    import store from '@/store'
    import auth from '@/services/auth';
    export default {
      props:['provider'],
        mounted(){
            this.patnId = store.getters.getPatnInfo.id
            this.getPatientAppointments(this.patnId)
        },
        data () {
            return {
                appointmentList : [],
                table:null,
                patnId:'',
            }
        },
        methods:{
          closeDialog(){
            this.$emit('closeDialog');
          },
          onSelect(data){
            const visit ={  
            appointmentDate: data.appointmentDate,
            appointmentEndDate: data.appointmentEndDate,
            clinic: {
                id: data.clinicId, 
                name: data.clinic
            },
            id: data.id,
            provider: {
                id: this.provider.id,
                name: this.provider.name
            }
            }
            store.commit('saveVisit',visit);
            auth.saveVisit(visit);
            this.closeDialog()
          },
          async getPatientAppointments(id){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientAppointments?patientId=${id}`,
            };
            store.dispatch("callWebService", messageObject)
            .then((result) => {
              this.appointmentList = result.appointments
            })
            .catch((response) => {
            console.log(response.data.error);
            })
        },

        }
    }
  </script>