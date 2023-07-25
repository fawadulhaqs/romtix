<template>
    <p class="text-h2 pa-5">Change Electronic Signature</p>
    
    
    <v-form @submit.prevent="submit">
        <v-btn class="ml-2" to="/profile">Cancel</v-btn>
        <v-btn class="ml-2 bg-primary" type="submit">Save Changes</v-btn>
        <hr class="my-5">
        <div class="d-flex flex-wrap justify-center">
            <p class="flex-1-1 text-body-1 px-3 pt-3 w-30">New E-Signature Code</p>
            <v-sheet width="180" color="lightprimary" class="flex-1-1 justify-start">
                <v-text-field
                v-model="signCode"
                :rules="codeRule"
                variant="outlined"
                placeholder="Signature Code"
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
                signCode:null,
                codeRule: [
                    v => !!v || 'Signature Code is required',
                    v => (v && v.length >= 6) || 'Signature Code should be greater then 6 letters'
                ],
            }
        },
        methods:{
            submit(){
                var messageObject = {
                requestType: "get",
                messageType: `changeElectronicSignature?esc=${this.signCode}`,
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