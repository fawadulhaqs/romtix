<template>
    <DashboardTable
    :header="header"
    :listData="VisitList"
    :apiLink="api"
    />
</template>
<script>
import store from '@/store'
import ApiService from '@/services/ApiServices';
import DashboardTable from './DashboardTable.vue';
import moment from 'moment';
export default {
        components:{DashboardTable},
        props:['patient'],
        watch:{
            patient(newVal,_){
                this.VisitList = []
                this.getVisits()
            }
        },
        data() {
            return {
                header:['Visits/Appointments/Admissions','location'],
                VisitList:[],
            }
        },
        computed:{
            api(){
                return `getVisitDetails?patientId=${this.patient.id}&visitString=`;
            }
        },
        mounted(){
            this.getVisits()
        },
        methods:{
            getVisits(){
                var messageObject = {
                    requestType: "get",
                    messageType: `getPatientVisits?patientId=${this.patient.id}`,
                };
                store.dispatch("callWebService", messageObject)
                .then((result) => {
                    this.visitObject(result.visits)
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
            },
            visitObject(data){
            for(let i=0; i<data.length;i++){
                this.VisitList.push({
                    name: moment(`${data[i].dateTime}`).format("lll"),
                    id: data[i].visitSring,
                    value1: data[i].location
                    
                }) 
            
            }
        }
        }
    }
</script>