<template>
    <DashboardTable
    :header="header"
    :listData="problemsList"
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
                this.problemsList=[],
                this.getProblems()
            }
        },
        data() {
            return {
                header:['Active Problems'],
                problemsList:[],
            }
        },
        computed:{
            api(){
                return `getProblemDetails?patientId=${this.patient.id}&problemId=`;
            }
        },
        mounted(){
            this.getProblems()
        },
        methods:{
            getProblems(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientProblems?patientId=${this.patient.id}`,
            };
            store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.problemsList = result.problems
            })
            .catch((response) => {
                console.log(response.data.error);
            })
            }
        }
    }
  </script>
  