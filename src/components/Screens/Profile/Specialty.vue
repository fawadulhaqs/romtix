<template>
    <p class="text-h2 pa-5">Speciality</p>
    <hr class="my-5">

    <v-list density="compact" class="bg-lightprimary">
        <v-list-item >
            Name
            <template v-slot:append>
                Status
            </template>
        </v-list-item>
        <hr aria-orientation="horizontal" noshade style="width:100%;  text-align:center;">
        <v-list-item v-for="list in speciality" :key="list.id">
            {{ list.name }}
            <template v-slot:append>
                <label class="switch">
                <input type="checkbox" @change="update($event, list.id)" :checked="list.status === 0 ? false: true">
                <span class="slider round"></span>
                <hr aria-orientation="horizontal" style="text-align:center;margin-left:0">
                </label>
            </template>
            <hr aria-orientation="horizontal" style="text-align:left;margin-top:7px">
        </v-list-item>
    </v-list>    
</template>
<style>
.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 15px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff0000;
  -webkit-transition: .2s;
  transition: .2s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 11px;
  width: 11px;
  left: 2px;
  bottom: 2px;
  background-color: rgb(255, 255, 255);
  -webkit-transition: .2s;
  transition: .2s;
}

input:checked + .slider {
  background-color: #218d00;
}

input:focus + .slider {
  box-shadow: 0 0 1px #218d00;
}

input:checked + .slider:before {
  -webkit-transform: translateX(17px);
  -ms-transform: translateX(17px);
  transform: translateX(17px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
<script>    
    export default{
        data () {
            return {
                model: false,
                speciality:[]
            }
        },
        mounted(){
            this.getSpeciality()
        },
        methods:{
            update(e,id){
                console.log(e.target.checked)
                let status = null
                if(e.target.checked === true){
                    status = 1
                }else{
                    status = 0
                }
                var messageObject = {
                    requestType: "get",
                    messageType: `setUserSpecialty?specialtyId=${id}&status=${status}`,
                };
                this.$store.dispatch("callWebService", messageObject)
                .catch((response) => {
                    console.log(response.data.error);
                })
            },
            getSpeciality(){
                var messageObject = {
                    requestType: "get",
                    messageType: `getUserSpecialties`,
                };
                this.$store.dispatch("callWebService", messageObject)
                .then((result) => {
                    this.speciality = result.specialties
                })
                .catch((response) => {
                    console.log(response.data.error);
                })
            }
        }
    }
    </script>