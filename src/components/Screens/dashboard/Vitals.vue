<template>
    <DashboardTable
    :header="header"
    :listData="vitalList"
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
                this.vitalList=[]
                this.getVitals()
            }
        },
        data() {
            return {
                header:['Vitals', 'Value'],
                vitalList:[]
            }
        },
        mounted(){
            this.getVitals()
        },
        methods:{
            getVitals(){
                var messageObject = {
                    requestType: "get",
                    messageType: `getPatientVitals?patientId=${this.patient.id}`,
                };
                store.dispatch("callWebService", messageObject)
                .then((result) => {
                    this.vitalObject(result.vitals)
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
            },
            vitalObject(data){
            for(let i=0; i<data.length;i++){
                this.vitalList.push({
                    name: data[i].type,
                    id: data[i].id,
                    value1: data[i].displayValue
                }) 
            }
        }
        }
    }
</script>