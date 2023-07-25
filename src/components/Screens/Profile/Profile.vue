<template>
    <v-sheet class="d-flex flex-wrap box">
      <v-sheet 
      color="lightprimary"
      width="350"
      rounded
      class="flex-1-1 ma-2 pa-5">
      <div v-if="user">
        <v-sheet class="d-flex pb-5" color="lightprimary">
          <v-sheet rounded="lg" width="80" height="80"></v-sheet>
          <div class="ml-3">
            <div class="d-flex">
            <p class="text-h4 pb-0 mb-0">{{ user.fullName }}</p>
            <button class="btn pl-3 text-primary" @click="dialog = true">Edit</button>
          </div>
            <p class="text-disabled">{{ user.degree }}</p>
            <p class="text-disabled">{{ user.dob }}</p>
            <p class="text-disabled">{{ user.gender }}</p>
          </div>
        </v-sheet>
        <v-sheet color="lightprimary" class="pa-0 ma-0">
          <div class="d-flex px-3 w-100">
            <p class="text-h6">Email:</p>
            <v-spacer></v-spacer>
            <p class="text-medium-emphasis">{{ user.email }}</p>
          </div>
          <div class="d-flex px-3 w-100">
            <p class="text-h6">Phone:</p>
            <v-spacer></v-spacer>
            <p class="text-medium-emphasis">{{ user.phone.mobile }}</p>
          </div>
          <div class="d-flex px-3 w-100">
            <p class="text-h6">Address:</p>
            <v-spacer></v-spacer>
            <p class="text-medium-emphasis">{{ `${user.address.line1}, ${user.address.line2}, ${user.address.line3}, ${user.address.city}, ${user.address.state.name}, ${user.address.zip}` }}</p>
          </div>
          <div class="d-flex px-3 w-100">
            <p class="text-h6">Emergency Contact Name:</p>
            <v-spacer></v-spacer>
            <p class="text-medium-emphasis">{{ user.phone.emergencyContactName }}</p>
          </div>
          <div class="d-flex px-3 w-100">
            <p class="text-h6">Emergency Contact Relation:</p>
            <v-spacer></v-spacer>
            <p class="text-medium-emphasis">{{ user.phone.emergencyContactRelation }}</p>
          </div>
          <div class="d-flex px-3 w-100">
            <p class="text-h6">Emergency Contact Number:</p>
            <v-spacer></v-spacer>
            <p class="text-medium-emphasis">{{ user.phone.emergencyContactNumber }}</p>
          </div>
          <v-sheet color="lightprimary" class="d-flex justify-center px-auto">
            <v-list class="w-100 bg-lightprimary">
              <v-list-item rounded color="primary" to="/profile/change-password">
                <v-list-item-title class="text-primary">Change Password</v-list-item-title>
              </v-list-item>
              <v-list-item rounded color="primary" to="/profile/change-electronic-signature">
                <v-list-item-title class="text-primary">Change Electronic Signature</v-list-item-title>
              </v-list-item>
              <v-list-item rounded color="primary" to="/profile/population-group">
                <v-list-item-title class="text-primary">Population Group</v-list-item-title>
              </v-list-item>
              <v-list-item rounded color="primary" to="/profile/speciality">
                <v-list-item-title class="text-primary">Specialty</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-sheet>
      </div>
      </v-sheet>
    
      <v-sheet 
      color="lightprimary"
      rounded 
      width="350"
      class="flex-1-1 ma-2 pa-2">
        <RouterView/>
      </v-sheet>
    </v-sheet>
    <v-dialog
      v-model="dialog"
    >
      <EditDetails
      :user="user"
      @closeDialog="dialog = false"
      />
    </v-dialog>
  </template>

<script>
import { RouterView } from 'vue-router';
import EditDetails from './EditDetails.vue';
export default{
    components:{EditDetails, RouterView},
    data(){
      return{
        dialog:false
      }
    },
    computed:{
      user(){
        return this.$store.getters.getMyInfo;
      }
    }
}

</script>

<style>
.box{
    display: flex;
    height: 89vh;
}
</style>