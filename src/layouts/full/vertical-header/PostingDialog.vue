<template>
    <UiCard :title="'Edit Details'" min-width="200" max-width="600" height="auto">
        <template v-slot:default>
            <v-card height="400">
                    <div class="overflow-y-auto h-50">
                    <MyTable
                    :header="allergyHeader"
                    :listData="allergies"
                    :apiLink="allergyApi"
                    />
                </div>
                <div class="overflow-auto h-50">
                <MyTable
                    :header="postingHeader"
                    :listData="postings"
                    :apiLink="postingApi"
                    class="overflow-auto"
                    />
                </div>
            </v-card>
        </template>
        <template v-slot:footer>
            <!-- <v-btn class="ml-2 bg-primary" :disabled="!list.length > 0" @click="generatePDF">Print</v-btn> -->
            <v-btn class="ml-2 bg-lightprimary" @click="closeDialog">Cancel</v-btn>
        </template>
    </UiCard>
</template>

<script>
import UiCard from '@/components/shared/CardHeaderFooter.vue'
import MyTable from '@/components/Screens/dashboard/DashboardTable.vue'
export default{
    components:{UiCard,MyTable},
    props:['patient'],
    watch:{
        patient(newVal,_){
            this.allergies=[],
            this.getAllergis()
            this.postings=[]
            this.getPosting()
        }
    },
    data() {
        return {
            allergyHeader:['Allergies','Severity', 'Sign/Symptoms'],
            allergies:[],
            postingHeader:['Crisis Notes, Warning Nottes, Directives','Date/Time'],
            postings:[],
        }
    },
    computed:{
        allergyApi(){
            return `getAllergyDetails?patientId=${this.patient.id}&allergyId=`;
        },
        postingApi(){
            return `getPostingDetails?patientId=${this.patient.id}&type=`;
        }
    },
    mounted(){
        this.getAllergis()
        this.getPosting()
    },
    methods:{
        closeDialog(){
            this.$emit('closeDialog');
        },
        getAllergis(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientAllergies?patientId=${this.patient.id}`,
            };
            this.$store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.allergyObject(result.allergies.allergies)
            })
            .catch((response) => {
                console.log(response.data.error);
            })
        },
        allergyObject(data){
            for(let i=0; i<data.length;i++){
                this.allergies.push({
                    name: data[i].name,
                    id: data[i].id,
                    value1: data[i].severity,
                    value2: data[i].symptoms
                }) 
            }
        },
        getPosting(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientProgressNotes?patientId=${this.patient.id}`,
            };
            this.$store.dispatch("callWebService", messageObject)
            .then((result) => {
                const signedList = result.notes.filter((note)=> note.key === "AS")
                this.postingObject(signedList[0].items); 
            })
            .catch((response) => {
                console.log(response.data.error);
            })
        },
        postingObject(data){
            const newList = data.filter((data)=> data.title === "Clinical warning" || data.title === "Crisis note" || data.title === "Advance directive")
            console.log(newList)
            for(let i=0; i<newList.length;i++){
                this.postings.push({
                    name: newList[i].title,
                    id: newList[i].id,
                    value1: newList[i].date,
                }) 
            }
        }
    }
}
</script>