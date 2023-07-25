<template>
    <v-card
    color="white"
    height="70"
    max-width="240"
    class="ml-1 pa-3"
    @click="dialog = true"
    >
    <v-card-text class="text-overflow d-none d-sm-block pa-0 ma-0 text-body-2 mt-0">
        POSTINGS
    </v-card-text>
    <v-card-text 
    class="d-flex align-center justify-center pa-0 mt-2 font-weight-black text-error"
    >
        {{ computedHeading }}
    </v-card-text>
    </v-card>  
    <v-dialog
      v-model="dialog"
    >
    <PostingDialog :patient="patient" @closeDialog="dialog = false"/>
    </v-dialog>
</template>

<script>
import PostingDialog from './PostingDialog.vue';
export default({
    props:['patient'],
    components:{PostingDialog},
    data(){
        return{
            postings:[],
            dialog: false
        };
    },
    mounted(){
        this.getPosting()
    },
    computed:{
        computedHeading(){
            const lenght = this.postings.length
            let heading = '';
            if(lenght>0){
                if(this.postings.some((posting)=> posting === 'CRISIS NOTE')){
                    heading = `${heading}C`
                }if(this.postings.some((posting)=> posting === 'CLINICAL WARNING')){
                    heading = `${heading}W`
                }if(this.postings.some((posting)=> posting === 'ALLERGIES')){
                    heading = `${heading}A`
                }if(this.postings.some((posting)=> posting === 'ADVANCE DIRECTIVE')){
                    heading = `${heading}D`
                }
            }else{
            heading = 'No Postings'
            }
            return heading
        }
    },
    watch:{
        patient(newVal,oldVal){
            this.getPosting();
        }
    },
    methods:{
        getPosting(){
            var messageObject = {
                requestType: "get",
                messageType: `getPatientPostings?patientId=${this.patient.id}`,
            };
            this.$store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.postings = result.postings
            })
            .catch((response) => {
                console.log(response.data.error);
            })
        },

    }
})
</script>