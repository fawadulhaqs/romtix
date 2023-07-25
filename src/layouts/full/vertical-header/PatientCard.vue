<template>
    <v-card
    color="white"
    height="70"
    max-width="240"
    class="ml-1 pa-0"
    >
        <v-row justify="start" no-gutters>
            <v-col cols="12">
                <v-card-text class="text-overflow pa-0 mt-2 font-weight-black">
                    {{ computedHeading }}
                </v-card-text>
            </v-col>
            <v-col cols="5">
                <v-card-text class="text-overflow d-none d-sm-block pa-0 ma-0 text-body-2 mt-4">
                    {{ subHeading }}
                </v-card-text>
            </v-col>
            <v-col cols="5">
                <v-dialog
                    v-model="vstDialog"
                    persistent
                    width="auto"
                >
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-if="buttonenable"
                            class="bg-primary mt-2"
                            target="_blank"                   
                            v-bind="props"
                            min-width="90"
                            size="small"
                        >
                        {{ buttonText }}
                        </v-btn>
                    </template>
                        <v-card>
                            <SelectVisit v-if="buttonText !== 'Change Patient'" @closeDialog="vstDialog =false"/>
                            <SelectPatient v-else @closeDialog="vstDialog =false"/>
                        </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-card>  
</template>

<style scoped>
  .text-overflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<script>
import SelectPatient from '@/components/Header/SelectPatient/Dialogue.vue';
import SelectVisit from '@/components/Header/SelectVisit/Dialog.vue'
export default({
    components:{SelectPatient,SelectVisit},
    props:['heading', 'heading2', 'subHeading','buttonText','buttonenable'],
    data(){
        return{
            ptnDialog : false,
            vstDialog : false,
        };
    },
    mounted(){
    },
    computed:{
        computedHeading(){
            const heading = `${this.heading} ${this.heading2}`
            return heading
        }
    }
})
</script>