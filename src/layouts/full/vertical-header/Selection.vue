<template>
    <v-row 
    align="center"
    no-gutters
    >
    <v-dialog
        v-model="imgDialog"
        persistent
        width="auto"
    >
        <template v-slot:activator="{ props }">
            <v-col
            v-if="patientInfo"
            cols="2">
                <v-card 
                v-bind="props"
                >
                    <img 
                    :src="srcImage"
                    height="70"
                    /> 
                </v-card>
            </v-col>
        </template>

            <v-card>
                <PatientImage
                :patient="patientInfo"
                @closeDialog="imgDialog =false"
                :defaultImg="srcImage"
                />
            </v-card>
    </v-dialog>
    <v-dialog
        v-model="ptnDialog"
        persistent
    >
        <template v-slot:activator="{ props }">
            <v-col  cols="5">
                    <PatientCard
                    v-if="patientInfo"
                    class="ml-4 pl-1"
                    :heading="patientInfo.fullName"
                    :heading2="patientInfo.gender === 'FEMALE'? '(F)':'(M)'"
                    :sub-heading="patientInfo.dob"
                    :buttonenable="true"
                    button-text="Change Patient"
                    />
                    <v-btn
                    v-else
                    class="mx-2"
                    color="ml-2 bg-primary"
                    v-bind="props"
                    >
                    select Patient
                    </v-btn>
            </v-col>
        </template>
            <SelectPatient @closeDialog="ptnDialog =false"/>
    </v-dialog>
    <v-dialog
        v-model="vstDialog"
        persistent
    >
        <template v-slot:activator="{ props }">
            <v-col cols="5">
            <PatientCard
                v-if="visitInfo"
                class="pl-1 ma-0"
                :heading="visitInfo.clinic.name"
                :heading2="`(${visitInfo.appointmentDate})`"
                :sub-heading="visitInfo.provider.name"
                :buttonenable="true"
                button-text="Change Visit"
            />
            <v-btn
                v-else
                class="bg-lightprimary ml-5"
                target="_blank"                   
                v-bind="props"
            >
            Select Visit
            </v-btn>
        </v-col>
        </template>
                <SelectVisit v-if="patientInfo !== null" @closeDialog="vstDialog =false"/>
                <SelectPatient v-else @closeDialog="vstDialog =false"/>
    </v-dialog>
</v-row>
</template>

<script>
import SelectPatient from '@/components/Header/SelectPatient/Dialogue.vue';
import PatientImage from '@/components/Header/SelectImage/patientImage.vue';
import SelectVisit from '@/components/Header/SelectVisit/Dialog.vue'
import PatientCard from '@/layouts/full/vertical-header/PatientCard.vue'
import xStore from "@/store/index";
export default({
    components:{SelectPatient,SelectVisit,PatientCard,PatientImage},
    data(){
        return{
            ptnDialog : false,
            vstDialog : false,
            imgDialog : false
        };
    },
    watch:{
        patientInfo(newInfo,oldInfo){
        },
        srcImage(newVal,oldVal){
        }
    },
    computed:{
        patientInfo(){
            return  xStore.getters.getPatnInfo;
        },
        visitInfo(){
            return xStore.getters.getVisit;
        },
        srcImage(){
            const image = xStore.getters.getPatnImage;
            return image;
        }
        
    }
})
</script>