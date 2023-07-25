<template>
<UiCard :title="'Edit Details'" min-width="200" max-width="800" height="auto">
<template v-slot:default>
    <v-card>
        <v-card-text>
          <v-row >
            <v-col cols="12" sm="4">
                <label>
                First Name
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="firstName"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Second Name
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="secondName"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Last Name
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="lastName"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="3">
                <label>
                Date of Birth
                <v-text-field
                    type="date"
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="dob"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="3">
                <label>
                Gender<br>
                <div class="radioBox">
                    <input type="radio" id="male" name="gender" v-model="gender" value="MALE">
                    <label for="MALE">MALE</label>
                    <input type="radio" id="female" name="gender" v-model="gender" value="FEMALE">
                    <label for="flexMALE">FEMALE</label>
                </div>
                </label>
            </v-col>
            <v-col cols="12" sm="3">
                <label>
                Email
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="email"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="3">
                <label>
                Phone
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="mobile"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Address Line 1
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="address1"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                    Address Line 2
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="address2"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                    Address Line 3
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="address3"
                    required
                ></v-text-field>
                </label>
            </v-col>
            
            <v-col cols="12" sm="4">
                <label>
                City
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="city"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                State
                <v-autocomplete
                :items="stateLists"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                hide-details
                v-model="state"
                clearable
                required
                ></v-autocomplete>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Zip Code
                <v-text-field
                    type="number"
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="zip"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Emergency Contact Name
                <v-text-field
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="emergencyName"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Emergency Contact Relation
                <v-text-field
                variant="outlined"
                    density="compact"
                    hide-details
                    v-model="emergencyRelation"
                    required
                ></v-text-field>
                </label>
            </v-col>
            <v-col cols="12" sm="4">
                <label>
                Emergency Contact Number
                <v-text-field
                variant="outlined"
                    density="compact"
                    hide-details
                    v-model="emergencyNumber"
                    required
                ></v-text-field>
                </label>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
</template>
<template v-slot:footer>
    <!-- <v-spacer></v-spacer> -->
    <v-btn class="ml-2 bg-primary" @click="submit">Confirm</v-btn>
    <v-btn class="ml-2 bg-lightprimary" @click="closeDialog" >Cancel</v-btn>
</template>
</UiCard>
</template>
<style>
.radioBox{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 40px;
    border: 1px solid rgba(199, 192, 192, 0.87);
    border-radius: 4px;
}
</style>
<script>
import moment from 'moment'
import UiCard from '@/components/shared/CardHeaderFooter.vue'
export default{
    components:{UiCard},
    props:['user'],
    data(){
        return{
            firstName: this.user.firstName,
            secondName: this.user.middleName,
            lastName: this.user.lastName,
            dob: this.user.dob,
            gender: this.user.gender,
            email: this.user.email,
            mobile: `${this.user.phone.mobile}`,
            address1: this.user.address.line1,
            address2: this.user.address.line2,
            address3: this.user.address.line3,
            city: this.user.address.city,
            state: this.user.address.state.id,
            zip: `${this.user.address.zip}`,
            emergencyName: this.user.phone.emergencyContactName,
            emergencyRelation: this.user.phone.emergencyContactRelation,
            emergencyNumber: `${this.user.phone.emergencyContactNumber}`,
            stateLists:[]
        }
    },
    mounted(){
        this.getStates()
    },
    methods:{
        getStates(){
            var messageObject = {
                requestType: "get",
                messageType: `getStates`,
            };
            this.$store.dispatch("callWebService", messageObject)
            .then((result) => {
                this.stateLists = result.states
            })
            .catch((response) => {
                console.log(response.data.error);
            })
        },
        submit(){
            var messageObject = {
                requestType: "post",
                messageType: `editProfile`,
                credentials: {
                firstName: this.firstName,
                lastName: this.lastName,
                middleName: this.secondName,
                gender: this.gender,
                dob:  moment(this.dob).format('L'),
                phone: {
                    emergencyContactName: this.emergencyName,
                    emergencyContactNumber: parseInt(this.emergencyNumber),
                    emergencyContactRelation: this.emergencyRelation,
                    home: "",
                    mobile: parseInt(this.mobile),
                    office: "",
                    officeExtension: ""
                },
                officeEmail: this.email,
                address: {
                    line1: this.address1,
                    line2: this.address2,
                    line3: this.address3,
                    city: this.city,
                    state: {
                        id: this.state
                    },
                    zip: parseInt(this.zip)
                }
                }
            };
            this.$store.dispatch("callWebService", messageObject)
            .then((result) => {
              this.$store.dispatch('showSnackBar', 'success')
            })
            .catch((response) => {
                console.log(response.data.error);
            })
            this.$store.dispatch('getUserInfo')
            this.closeDialog()
        },
        closeDialog(){
            this.$emit('closeDialog');
        }
    }
}
</script>