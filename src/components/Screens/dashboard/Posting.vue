<template>
    <DashboardTable
    :header="header"
    :listData="postings"
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
            this.postings=[]
            this.getPosting()
        }
    },
    data() {
        return {
            header:['Posting'],
            postings:[],
        }
    },
    computed:{
            api(){
                return `getPostingDetails?patientId=${this.patient.id}&type=`;
            }
        },
    mounted(){
        this.getPosting()
    },
    methods:{
        getPosting(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientPostings?patientId=${this.patient.id}`,
            };
            store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.postingObject(result.postings); 
            })
            .catch((response) => {
                console.log(response.data.error);
            })
        },
        postingObject(data){
            for(let i=0; i<data.length;i++){
                this.postings.push({
                    name: data[i],
                    id: data[i]
                }) 
            }
        }
    }
}
</script>