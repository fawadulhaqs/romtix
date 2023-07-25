<template>
<p class="text-h2 pa-5">Change Password</p>


<v-form @submit.prevent="submit">
    <v-btn class="ml-2" to="/profile">Cancel</v-btn>
    <v-btn class="ml-2 bg-primary" type="submit">Save Changes</v-btn>
    <hr class="my-5">
    <div class="d-flex flex-wrap justify-center">
        <p class="flex-1-1 text-body-1 px-3 pt-3 w-30">Current Password</p>
        <v-sheet width="180" color="lightprimary" class="flex-1-1 justify-start">
            <v-text-field
            type="Password"
            v-model="crntPass"
            :rules="curntRule"
            variant="outlined"
            placeholder="Current Password"
            required
            ></v-text-field>
        </v-sheet>
    </div>
    <div class="d-flex flex-wrap justify-center">
        <p class="flex-1-1 text-body-1 px-3 pt-3 w-30">New Password</p>
        <v-sheet width="180" color="lightprimary" class="flex-1-1 justify-start">
            <v-text-field
            type="Password"
            v-model="newPass"
            :counter="6"
            :rules="newRule"
            variant="outlined"
            placeholder="New Password"
            required
            ></v-text-field>
        </v-sheet>
    </div>
    <div class="d-flex flex-wrap justify-center">
        <p class="flex-1-1 text-body-1 px-3 pt-3 w-30">Verify Password</p>
        <v-sheet width="180" color="lightprimary" class="flex-1-1 justify-start">
            <v-text-field
            type="Password"
            v-model="confirmPass"
            :rules="confirmRule.concat(passwordConfirmationRule)"
            variant="outlined"
            placeholder="Confirm Password"
            required
            ></v-text-field>
        </v-sheet>
    </div>
</v-form>

</template>

<script>
import router from '@/router';
import Swal from 'sweetalert2';

export default{
    data(){
        return{
            crntPass:null,
            newPass:null,
            confirmPass:null,
            curntRule: [
                v => !!v || 'Name is required',
            ],
            newRule: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 6) || 'Password should be greater then 6 letters'
            ],
            confirmRule: [
                v => !!v || 'Password is required',
            ],
        }
    },
    methods:{
        submit(){
            var messageObject = {
            requestType: "post",
            messageType: `cvc`,
            credentials: {
                currentVerifyCode: this.crntPass,
                newVerifyCode: this.newPass,
                confirmNewVerifyCode: this.confirmPass
            }
            };
            this.$store.dispatch("callWebService", messageObject)
            .catch((response) => {
            console.log(response.data.error);
            Swal.fire({
                text: `${response.data.error}`,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "OK",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn fw-semibold btn-light-danger",
                },
            }).then(() => {
                router.push('/profile');
            });
            })
        }
    },
    computed:{
        passwordConfirmationRule() {
        return () =>
            this.newPass === this.confirmPass || "'Passsword' and 'Confirm Password' didn't match.";
        }
    }
}
</script>