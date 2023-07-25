<template>

<v-row class="px-5">
                <v-col cols="12" sm="6" class="d-flex justify-center">
                  <MyVirtualScroller
                  :data-list="patientList"
                  :list-hieght="360"
                  :label="'Patient'"
                  @onClicked="selectedItem"
                  />
                </v-col>
                <v-col cols="8" sm="6">
                  <p class="pt-10 pl-5" >Details</p>
                <v-list>
                  <v-list-item v-if="imageSrc">
                    <v-img
                      :width="253"
                      lazy-src="assets/images/users/lazyLoad.jpg"
                      :src="imageSrc"
                    >
                  </v-img>
                  </v-list-item>
                  <v-list-item>
                    <p>{{ selectedPatient.name?? "" }}</p>
                  </v-list-item>
                  <v-list-item>
                    <p>SSN: {{ selectedPatient.ssn?? "" }}</p>
                  </v-list-item>
                  <v-list-item>
                    <p>DOB: {{ selectedPatient.dob?? "" }}</p>
                  </v-list-item>
                  <v-list-item>
                    <p>{{ selectedPatient.gender?? "" }}</p>
                  </v-list-item>
                </v-list>
                </v-col>
              </v-row>
</template>
<script>
import store from '@/store'
import MyVirtualScroller from '@/components/shared/MyVirtualScroller.vue';
export default ({
components:{MyVirtualScroller},
mounted() {
  this.getPatientList();
},
data() {
  return {
    imageSrc: null,
    patientList: [],
    selectedPatient: '',
  }
},
methods: {
  savePatient(info, img){
        this.$emit('savePatient',info,img);
  },
  selectedItem(value) {
    this.selectedPatient = value
    this.imageSrc = null
    this.getPtientImage(value);
  },
  async getPtientImage(value){
    var messageObject = {
    requestType: "get",
    messageType: `getPatientImage?patientId=${value.id}&imageSide=front`,
    };
    store.dispatch("callWebService", messageObject)
    .then((result) => {
      this.imageSrc = result.imgData;
      this.savePatient(value, result.imgData)
    })
    .catch((response) => {
      console.log(response.data.error);
    })
  },
  async getPatientList(){
    var messageObject = {
      requestType: "get",
      messageType: `getAllPatients`,
    };
    store.dispatch("callWebService", messageObject)
    .then((result) => {
      this.patientList = result.patients.ITEMS;
    })
    .catch((response) => {
    console.log(response.data.error);
    })
  }
},
})
</script>