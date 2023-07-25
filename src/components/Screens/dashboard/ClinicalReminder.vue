<template>
  <DashboardTable
  :header="header"
  :listData="Reminders"
  :apiLink="api"
  />
</template>
<script>
import store from '@/store'
import ApiService from '@/services/ApiServices';
import DashboardTable from './DashboardTable.vue';
export default {
      components:{DashboardTable},
      props:['patient'],
      watch:{
          patient(newVal,_){
              this.Reminders=[]
              this.getReminders()
          }
      },
      data() {
          return {
              header:['Clinical Reminder','Due Date'],
              Reminders:[],
          }
      },
      computed:{
        api(){
            return `getReminderDetails?patientId=${this.patient.id}&reminderId=`;
        }
    },
      mounted(){
          this.getReminders()
      },
      methods:{
          getReminders(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientReminders?patientId=${this.patient.id}`,
            };
            store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.reminderObject(result.reminders)
            })
            .catch((response) => {
                console.log(response.data.error);
            })
            },
            reminderObject(data){
                for(let i=0; i<data.length;i++){
                    this.Reminders.push({
                        name: data[i].name,
                        id: data[i].id,
                        value1: data[i].status
                        
                    }) 
                }
            }
      }
  }
</script>