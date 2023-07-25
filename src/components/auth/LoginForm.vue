<template>
<v-form @submit.prevent="onSubmitLogin">
    <v-row class="d-flex mb-3">
    
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Username</v-label>
            <v-text-field 
            variant="outlined" 
            v-model="userName"
            :rules="validateUsername"
            ></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Password</v-label>
            <v-text-field 
            v-model="password"
            variant="outlined" 
            type="password"  
            :rules="validatePassword"
            ></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-btn type="submit" color="primary" size="large" block :loading="loading" flat>Sign in</v-btn>
        </v-col>
    </v-row>
</v-form>
</template>


<script lang="ts">
import xStore from "@/store/index";
import { defineComponent, ref } from "vue";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
  data: () => ({
      userName: '',
      password: '',
      validateUsername: [
        (value:any) => {
          if (value) return true

          return 'You must enter a username'
        },
      ],
      validatePassword: [
        (value:any) => {
          if (value) return true

          return 'You must enter a password'
        },
      ],
    }),
  setup() {
    const userName = ref("");
    const password = ref("");
    const loading = ref<boolean>(false);


    //Create form validation object
    const login = Yup.object().shape({
      email: Yup.string().email().required().label("Email"),
      password: Yup.string().min(4).required().label("Password"),
    });
    //Form submit function
    const onSubmitLogin = async () => {

      // Send login request
      loading.value = true;
      await xStore.dispatch('login',{
            accessCode: userName.value,
            verifyCode: password.value
          });
      loading.value = false;
    };

    return {
      onSubmitLogin,
      login,
      userName,
      password,
      loading
    };
  },
});
</script>