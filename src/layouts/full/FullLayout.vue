<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainView from './Main.vue';
import { onMounted, computed, watch, ref} from 'vue';
import Cookies from 'js-cookie';
import store from '@/store';
import Swal from 'sweetalert2';
import router from '@/router';
import auth from '@/services/auth';
const onRefresh = () => {
    const token = Cookies.get('token_id');
    if (!!token) {
        store.dispatch('onRefresh', token);
    } else {
        Swal.fire({
            text: 'Your session is expired!. Please login again!!',
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Login Again!",
            heightAuto: false,
            customClass: {
                confirmButton: "btn fw-semibold btn-light-danger",
            },
        }).then(() => {
            deleteStorage()
            router.push({ name: "Login" });

        });
    }
}
const overLay = computed(() => {
    return store.getters.overLay;
})

const snackBar = computed(() => {
    return store.getters.getSnackBar;
})

onMounted(() => {
    onRefresh();
});


const deleteStorage = ()=>{
    auth.deleteStorage()
}

</script>

<template>
    <v-locale-provider>
        <v-app>
            <MainView />
            <v-overlay 
            v-if="overLay" 
            v-model="overLay" 
            persistent
            class="align-center justify-center">
                <v-progress-circular
                    color="primary"
                    indeterminate
                    size="64"
                ></v-progress-circular>
            </v-overlay>
            <div id="snackbar">{{ snackBar }}</div>
            <v-main>
                <div>
                    <RouterView />
                </div>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>

<style>

#snackbar {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: rgb(0, 0, 0);
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 16px;
    position: fixed;
    z-index: 9999;
    right: 5%;
    bottom: 30px;
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.5);
}

.showSuccess {
    visibility: visible !important;
    background-color: green !important;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
.showError {
    visibility: visible !important;
    background-color: red !important;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
v-progress-circular{
    z-index: 99999999;
}
</style>