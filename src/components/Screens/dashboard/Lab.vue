<template>
    <DashboardTable
    :header="header"
    :listData="labList"
    />
</template>
<script>
import store from '@/store'
import DashboardTable from './DashboardTable.vue';
export default {
        components:{DashboardTable},
        props:['patient'],
        watch:{
            patient(newVal,_){
                this.labList=[]
                this.getLabResults()
            }
        },
        data() {
            return {
                header:['Recent Lab Results'],
                labList:[]
            }
        },
        mounted(){
            this.getLabResults()
        },
        methods:{
            getLabResults(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientLabTypeItems?patientId=${this.patient.id}`,
            };
            store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.labList = result.labs
            })
            .catch((response) => {
                console.log(response.data.error);
            })
            }
        }
    }
</script>