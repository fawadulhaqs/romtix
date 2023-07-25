<template>
    <DashboardTable
    :header="header"
    :listData="MedicationList"
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
                this.MedicationList=[],
                this.getMedication()
            }
        },
        data() {
            return {
                header:['Active Medication'],
                MedicationList:[],
            }
        },
        computed:{
            api(){
                return `getMedicationDetails?patientId=${this.patient.id}&medicationId=`;
            }
        },
        mounted(){
            this.getMedication()
        },
        methods:{
            getMedication(){
                var messageObject = {
                    requestType: "get",
                    messageType: `getPatientMedications?patientId=${this.patient.id}`,
                };
                store.dispatch("callWebService", messageObject)
                .then((result) => {
                    this.MedicationList = result.medications
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
            }
        }
    }
</script>
