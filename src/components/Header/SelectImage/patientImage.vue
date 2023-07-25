<template>
    <UiCard title="Image Upload" width="600" height="auto">
      <template v-slot:default>
        <div class="d-flex flex-column align-center">
          <v-card-item class="align-self-center">
            <v-card variant="tonal" class="mt-2">
              <input
              class="pa-3 "
                ref="fileInput"
                accept="image/*"
                type="file"
                @input="pickFile">
            </v-card>
          </v-card-item>
            <v-sheet
            class="ma-4 align-self-center"
            :elevation="10"
            rounded>
            <img 
            :src="previewImage ? previewImage: defaultImg"
            cover
            width="350"
            />
          </v-sheet>
          <v-card-actions>
            <v-btn v-if="!uploaded" :disabled="!previewImage" class="bg-primary" @click="uploadImage">Upload</v-btn>
            <v-btn class="bg-primary" @click="removeImage">Remove Image</v-btn>
          </v-card-actions>
        </div>
      </template>
      <template v-slot:footer>
        <!-- <v-spacer></v-spacer> -->
        <v-btn :disabled="!uploaded" class="bg-primary" @click="saveImage">Save</v-btn>
        <v-btn class="bg-lightprimary" @click="closeDialog">Cancel</v-btn>
      </template>
    </UiCard>
</template>



<script >
import UiCard from '@/components/shared/CardHeaderFooter.vue';
import auth from '@/services/auth';
import store from '@/store';

export default ({
components: {UiCard},
props:['defaultImg','patient'],
emits: ["closeDialog"],
data() {
      return {
        file:null,
        previewImage: null,
        uploaded: false
      };
    },
methods: {
  closeDialog(){
    this.$emit('closeDialog');
  },
  pickFile () {
    let input = this.$refs.fileInput
    this.file = input.files[0]
    let file = input.files
    if (file && file[0]) {
      let reader = new FileReader
      reader.onload = e => {
        this.previewImage = e.target.result
      }
      reader.readAsDataURL(file[0])
    }
    this.uploaded = false
  },
  uploadImage(){
    const formData = new FormData();
    formData.append('singlefile', this.file);
    var messageObject = {
      requestType: "post",
      messageType: `upload`,
      credentials: formData
    };
    store.dispatch("callWebService", messageObject)
    .then((result) => {
      this.uploaded = true
    })
    .catch((response) => {
      console.log(response.data.error);
    })
  },
  saveImage(){
    var messageObject = {
      requestType: "post",
      messageType: `savePatientImage`,
      credentials: {
        patientId: this.patient.id,
        frontImageName: this.file.name,
      }
    };
    store.dispatch("callWebService", messageObject)
    .then((result) => {
      auth.savePatientImage(this.previewImage);
      store.commit('patnImage',this.previewImage);
      this.closeDialog()
    })
    .catch((response) => {
    console.log(response.data.error);
    })
  },
  removeImage(){
    var messageObject = {
      requestType: "post",
      messageType: `removePatientImage?patientId=${this.patient.id}&imageSide=front`,
    };
    store.dispatch("callWebService", messageObject)
    .catch((response) => {
      console.log(response.data.error);
    })
  }
},
})
</script>