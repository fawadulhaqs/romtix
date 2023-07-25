<template>
    <DashboardTable
    :header="header"
    :listData="allergies"
    :apiLink="api"
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
            this.allergies=[],
            this.getAllergis()
        }
    },
    data() {
        return {
            header:['Allergies /Adverse Reaction'],
            allergies:[],
        }
    },
    computed:{
        api(){
            return `getAllergyDetails?patientId=${this.patient.id}&allergyId=`;
        }
    },
    mounted(){
            this.getAllergis()
    },
    methods:{
        getAllergis(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientAllergies?patientId=${this.patient.id}`,
            };
            store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.allergies = result.allergies.allergies
            })
            .catch((response) => {
                console.log(response.data.error);
            })
        }
    }
}
</script>
